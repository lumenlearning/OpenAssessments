class Api::UserAssessmentsController < Api::ApiController
  before_action :ensure_context_admin, only:[:index, :update_attempts]

  def index
    scope = UserAssessment.where(lti_context_id: params[:context_id]).
            where(assessment_id: params[:assessment_id]).
            where('user_id is not null').
            where('lti_role != ?', 'admin').
            select(:id, :assessment_id, :attempts, :user_id).
            includes(:user)

    respond_with(:json, custom_json(scope))
  end

  def update_attempts
    ua = UserAssessment.where(lti_context_id: params[:context_id]).find(params[:user_assessment_id])

    ua.attempts = params[:user_assessment][:attempts]
    if ua.save
      render json: ua_json(ua, ua.assessment)
    else
      render json: {errors: ua.errors.full_messages}, status: 422
    end
  end

  def update
    assessment = Assessment.find(params[:assessmentId])
    if assessment != nil
      if params[:lti_context_id].present?
        @user_assessment = assessment.user_assessments.where(eid: params[:id], lti_context_id: params[:lti_context_id]).first
      else
        @user_assessment = assessment.user_assessments.where(eid: params[:id]).first
      end
      if !@user_assessment.nil? && assessment.kind != 'summative'
        @user_assessment.increment_attempts!
      end
    end
    respond_with(:api, @user_assessment)
  end

  private

  # makes sure the JWT token allows admin scope for this LTI context id
  def ensure_context_admin
    return true if token_has_admin_scope(params[:context_id])
    render :json => { :error => "Unauthorized" }, status: :unauthorized
    false
  end

  def custom_json(user_assessments)
    assessment = Assessment.where(id: params[:assessment_id], account: current_account).select(:id, :title).first
    allowed = allowed_attempts(assessment)
    user_assessments = user_assessments.to_a

    results = AssessmentResult.where(user_assessment_id: user_assessments.map(&:id)).
                    select(:id, :created_at, :score, :attempt, :user_id, :user_assessment_id).to_a.
                    group_by{|r|r.user_assessment_id}
    user_assessments.map do |ua|
      ua_json(ua, assessment, allowed, results[ua.id] || [])
    end
  end

  def allowed_attempts(assessment)
    if assessment && settings = assessment.default_settings
      settings.allowed_attempts
    else
      nil
    end
  end

  def ua_json(ua, assessment, allowed=nil, results=nil)
    allowed ||= allowed_attempts(assessment)
    results ||= ua.assessment_results.to_a
    if allowed
      allowed = allowed - ua.attempts
      allowed = 0 if allowed < 0
    end

    {
            id: ua.id,
            attempt_count: ua.attempts,
            attempts_left: allowed,
            assessment: {
                    id: assessment.id,
                    name: assessment.title
            },
            user: {
                    id: ua.user.id,
                    name: ua.user.name,
                    email: ua.user.email
            },
            attempts: results.map { |r|
              {
                      id: r.id,
                      created_at: r.created_at,
                      score: r.score,
                      attempt: r.attempt
              }
            }
    }
  end

end
