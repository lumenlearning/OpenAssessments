require 'json2qti'
require 'assessment_copier'

class Api::AssessmentsController < Api::ApiController
  
  respond_to :xml, :json

  before_action :ensure_context_admin, only:[:json_update, :review_show]
  load_and_authorize_resource except: [:show, :json_update, :copy, :review_show]
  skip_before_action :validate_token, only: [:show]
  skip_before_action :protect_account, only: [:show]
  before_action :ensure_copy_admin, only:[:copy]

  def index
    page = (params[:page] || 1).to_i
    per_page = 100
    @assessments = Assessment.all
    if params[:q].present?
      q = "%#{params[:q]}%"
      @assessments = @assessments.where("title ILIKE ? OR description ILIKE ?", q, q).paginate(:page => page, :per_page => per_page)
    end
    respond_to do |format|
      format.json { render :json => @assessments }
      format.xml { render }
    end
  end

  def show
    assessment = Assessment.where(id: params[:id], account: current_account).first
    review_or_edit = !!(params[:for_review] || params[:for_edit])
    if (!assessment.formative? && !assessment.practice?) || review_or_edit
      return unless validate_token
    end

    user_assessment = nil
    if user = current_user
      if params[:lti_context_id].present?
        user_assessment = assessment.user_assessments.where(user_id: user.id, lti_context_id: params[:lti_context_id]).first
      else
        #todo don't allow summative without a context
        user_assessment = assessment.user_assessments.where(user_id: user.id).first
      end
    end

    assessment_settings = params[:asid] ?  assessment.assessment_settings.find(params[:asid]) : assessment.default_settings || current_account.default_settings || AssessmentSetting.where(is_default: true).first

    if params[:for_review]
      # check context admin
      return unless ensure_context_admin
    end
    if params[:for_edit]
      #check context admin && edit id scope
      return unless ensure_context_admin
      return unless ensure_edit_id_scope(assessment.external_edit_id)
    end

    # If it's a summative quiz the attempts are incremented here instead of UserAttemptsController#update
    # todo: refactor so that all attempts are incremented via the xml fetch? Maybe not because externally hosted xml files.
    if assessment.summative? && !review_or_edit
      if user_assessment && @lti_launch

        if user_assessment.lti_role == 'student' && user_assessment.attempts >= assessment_settings.allowed_attempts
          render :json => {:error => "Too many attempts."}, status: :unauthorized
          return
        end

        @result = assessment.assessment_results.build
        @result.user_assessment = user_assessment
        @result.lti_launch = @lti_launch
        @result.external_user_id = @lti_launch.lti_user_id if @lti_launch
        @result.attempt = user_assessment.attempts || 0
        @result.user = current_user
        @result.session_status = AssessmentResult::STATUS_PENDING_SUBMISSION
        @result.save!

        user_assessment.increment_attempts!
      else
        render :json => {:error => "Can't take summative without LtiLaunch or UserAssessment."}, status: :unauthorized
        return
      end
    end

    respond_to do |format|
      format.json { render :json => assessment }
      format.xml do
        if review_or_edit
          render :text => assessment.xml_with_answers
        elsif assessment.practice?
          render :text => assessment.xml_with_answers
        else
          selected_items = []
          if assessment_settings && assessment_settings.per_sec
            xml = assessment.xml_without_answers(assessment_settings.per_sec.to_i, selected_items)
          else
            xml = assessment.xml_without_answers(nil, selected_items)
          end
          #todo : once all assessments are updated to have a current this won't be needed
          asmnt_xml = assessment.current_assessment_xml || assessment.assessment_xmls.where(kind: 'summative').first

          if @result
            @result.assessment_xml = asmnt_xml
            @result.question_ids = selected_items
            @result.save!
          end

          render :text => xml
        end
      end
    end
  end

  def review_show
    assessment = Assessment.where(id: params[:assessment_id], account: current_account).first
    xml = nil

    if params[:assessment_result_id]
      ar = AssessmentResult.find(params[:assessment_result_id])
      ua = ar.user_assessment

      if !ua || ua.lti_context_id != @lti_launch.lti_context_id
        render :json => {:error => "This Assessment Result is not from this context."}, status: :unauthorized
        return
      end

      if ar.assessment_xml && (ar.assessment_xml.kind == 'summative' || ar.assessment_xml.kind == 'qti')
        xml = ar.assessment_xml.xml
      end

    end

    render :xml => xml || assessment.xml_with_answers
  end

  # *******************************************************************
  # URL PARAMS
  # allowed_attempts (int) How many attempts the learner gets
  # enable_start (bool) show the start screen
  # style (string) set to "lumen_learning" to use the lumen learning theme. Leave out for default style
  # per_sec (int) give it the number of random questions from each section you want.
  # confidence_levels (bool) display confidence controls
  #
  # Example
  # https://assessments.lumenlearning.com/assessments/15?style=lumen_learning&asid=1&per_sec=2&confidence_levels=true&enable_start=true
  # ********************************************************************

  def create
    @assessment.user = current_user
    @assessment.account = current_account
    @assessment.save!
    @assessment.assessment_settings.create(settings_params)
    
    respond_with(:api, @assessment)
  end

  def update
    @assessment.update(update_params)
    if settings = @assessment.default_settings
      settings.update(settings_params)
    else
      @assessment.assessment_settings.create(settings_params)
    end
    
    respond_with(:api, @assessment)
  end

  def json_update
    assessment = Assessment.where(id: params[:assessment_id], account: current_account).first
    raise ActiveRecord::RecordNotFound unless assessment
    return unless ensure_edit_id_scope(assessment.external_edit_id)

    clean_params = params.require(:assessment)
    assessment.title = clean_params[:title]

    if clean_params[:items]
      opts = {}
      if settings = assessment.default_settings
        if settings.per_sec
          opts["group_by_section"] = true
          opts["per_sec"] = settings.per_sec
        end
      end
      xml = Json2Qti.convert_to_qti(clean_params, opts)

      assessment.xml_file = xml
    end

    assessment.save!

    # yes, confusing to return XML from JSON update, but that's the format it's saved in
    render :xml => assessment.xml_with_answers
  end

  def copy
    assessment = Assessment.where(id: params[:assessment_id]).first
    raise ActiveRecord::RecordNotFound unless assessment

    new_assessment = AssessmentCopier.copy!(assessment, edit_id: params.require(:edit_id), context_ids_to_update: params.require(:context_ids_to_update).split(","))

    render :json => new_assessment
  end

  private

  # makes sure the JWT token allows admin scope for this LTI context id
  def ensure_edit_id_scope(edit_id)
    return true if token_has_edit_id_scope(edit_id)
    render :json => {:error => "Unauthorized for this edit scope"}, status: :unauthorized
    false
  end

    def create_params
      params.require(:assessment).permit(:title, :description, :license, :xml_file,
                                         :src_url, :recommended_height, :keyword_list,
                                         :account_id, :kind)
    end

    def update_params
      params.require(:assessment).permit(:title, :description, :license, :xml_file,
                                         :src_url, :recommended_height, :keyword_list,
                                         :account_id, :kind)
    end
  
  def settings_params
    settings = params.require(:assessment).permit(:allowed_attempts, :per_sec, :confidence_levels, :style, :enable_start)
    settings[:allowed_attempts] = settings[:allowed_attempts].to_i if settings[:allowed_attempts]
    settings[:per_sec] = settings[:per_sec].to_i if settings[:per_sec]
    settings[:confidence_levels] = settings[:confidence_levels] == 'true' if settings[:confidence_levels]
    settings[:enable_start] = settings[:enable_start] == 'true' if settings[:enable_start]
    settings[:mode] = @assessment.kind
    settings
  end

end
