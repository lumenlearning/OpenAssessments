require 'json2qti'
require 'assessment_copier'

class Api::AssessmentsController < Api::ApiController
  
  respond_to :xml, :json

  before_action :ensure_context_admin, only:[:json_update]
  load_and_authorize_resource except: [:show, :json_update, :copy]
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
    unless assessment.kind == 'formative'
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

    for_review = false

    # If it's a summative quiz the attempts are incremented here instead of UserAttemptsController#update
    # todo: refactor so that all attempts are incremented via the xml fetch? Maybe not because externally hosted xml files.
    if assessment.kind == 'summative'
      if user_assessment && @lti_launch
        #todo - If not admin return unauthorized error instead of starting quiz?
        for_review = user_assessment.lti_role == 'admin' && (params[:for_review] || params[:for_edit])

        if user_assessment.lti_role == 'student' && user_assessment.attempts >= assessment_settings.allowed_attempts
          render :json => {:error => "Too many attempts."}, status: :unauthorized
          return
        end

        unless for_review
          @result = assessment.assessment_results.build
          @result.user_assessment = user_assessment
          @result.lti_launch = @lti_launch
          @result.external_user_id = @lti_launch.lti_user_id if @lti_launch
          @result.attempt = user_assessment.attempts || 0
          @result.user = current_user
          @result.session_status = AssessmentResult::STATUS_PENDING_SUBMISSION
          @result.save!

          user_assessment.increment_attempts!
        end
      else
        render :json => {:error => "Can't take summative without LtiLaunch or UserAssessment."}, status: :unauthorized
        return
      end
    end

    respond_to do |format|
      format.json { render :json => assessment }
      format.xml do
        if for_review
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

  # *******************************************************************
  # URL PARAMS
  #
  # enable_start
  # => set to true or false to show the start screen
  # style
  # => set to "lumen_learning" to use the lumen learning theme. Leave out for default style
  # asid
  # => give it an id to load an assessment setting which determines how many attempts a studen has to take the quiz. Right now there is no
  #    way to create one of these so if you need one you can find the assessment you want in the database and create one by doing .assessment_settings.create({allowed_attempts: n})
  # per_sec
  # => give it the number of random questions from each section you want.
  # confidence_levels
  # => set to true or false to display confidence controls
  # Example
  # https://assessments.lumenlearning.com/assessments/15?style=lumen_learning&asid=1&per_sec=2&confidence_levels=true&enable_start=true
  # ********************************************************************

  def create
    @assessment.user = current_user
    @assessment.account = current_account
    @assessment.save!
    respond_with(:api, @assessment)
  end

  def update
    @assessment.update(update_params)
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

    new_assessment = AssessmentCopier.copy!(assessment, edit_id: params.require(:edit_id), context_ids_to_update: params.require(:context_ids_to_update))

    render :json => new_assessment
  end

  private

  # makes sure the JWT token allows admin scope for this LTI context id
  def ensure_edit_id_scope(edit_id)
    return true if token_has_edit_id_scope(edit_id)
    render :json => {:error => "Unauthorized"}, status: :unauthorized
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

end
