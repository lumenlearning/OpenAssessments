
class Api::AssessmentsController < Api::ApiController
  
  respond_to :xml, :json

  load_and_authorize_resource except: [:show]
  skip_before_action :validate_token, only: [:show]

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
    validate_token unless assessment.kind == 'formative'

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
      if user_assessment
        for_review = user_assessment.lti_role == 'admin' && params[:for_review]

        if user_assessment.lti_role == 'student' && user_assessment.attempts >= assessment_settings.allowed_attempts
          render :json => {:error => "Too many attempts."}, status: :unauthorized
          return
        end

        user_assessment.increment_attempts! unless for_review
      else
        render :json => {:error => "Can't validate user_assessment for summative assessment."}, status: :unauthorized
        return
      end
    end

    respond_to do |format|
      format.json { render :json => assessment }
      format.xml do
        if for_review
          render :text => assessment.assessment_xmls.formative.by_newest.first.xml
        elsif assessment_settings && assessment_settings.per_sec
          render :text => assessment.assessment_xmls.by_newest.first.xml_with_limited_questions(assessment_settings.per_sec.to_i)
        else
          render :text => assessment.assessment_xmls.by_newest.first.xml
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

  private

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
