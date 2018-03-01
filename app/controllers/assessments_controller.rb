require 'open-uri'
require 'lti/role_helper'

class AssessmentsController < LtiBaseController

  skip_before_filter :verify_authenticity_token

  before_filter :skip_trackable
  before_filter :authenticate_user!, only: [:new, :create, :destroy]
  before_filter :check_lti, only: [:show, :edit, :lti]
  load_and_authorize_resource except: [:show, :edit, :lti]

  respond_to :html

  def index
    if params[:kind] == 'formative'
      @assessments = @assessments.where(account: current_account, kind: 'formative')
    elsif params[:kind] == 'practice'
      @assessments = @assessments.where(account: current_account, kind: 'practice')
    else
      @assessments = []
    end
  end

  def show
    if params[:load_ui] == 'true'
      @embedded = false
    else
      @embedded = params[:src_url].present? || params[:embed].present? || @is_lti
    end
    @account_id = current_account.id
    set_lti_role

    if params[:id].present? && !['load', 'offline'].include?(params[:id])
      @assessment = Assessment.where(id: params[:id], account: current_account).first
      @assessment_id = @assessment ? @assessment.id : params[:assessment_id] || 'null'
      set_all_settings(params, @assessment)

      if params[:user_id].present?
        oea_user_id = @user ? @user.id : nil
        @user_assessment = @assessment.user_assessments.where(eid: params[:user_id], lti_context_id: params[:context_id]).first
        if !@user_assessment.nil?
          @user_attempts = @user_assessment.attempts || 0
          if oea_user_id && @user_assessment.user_id != oea_user_id
            @user_assessment.user_id = oea_user_id
            @user_assessment.save
          end
          if @lti_role && @user_assessment.lti_role != @lti_role
            @user_assessment.lti_role = @lti_role
            @user_assessment.save
          end
        else
          @user_assessment = @assessment.user_assessments.create({
            :eid => params[:user_id],
            :lti_context_id => params[:context_id],
            :attempts => 0,
            :user_id => oea_user_id,
            :lti_role => @lti_role
            })
          @user_attempts = @user_assessment.attempts
        end
      end
      @eid ||= @assessment.identifier
      if @embedded
        # Just show the assessment. This is here to support old style embed with id=# and embed=true
        @src_url = embed_url(@assessment, lti_context_id: params[:context_id])
      else
        # Show the full page with analtyics and embed code buttons
        @embed_code = embed_code(@assessment, @confidence_levels, @eid, @enable_start, params[:offline].present?, nil, @style, params[:asid], @per_sec, @assessment.kind, @assessment_title)
      end
    elsif params[:assessment_id]
      @assessment = Assessment.find(params[:assessment_id])
      set_all_settings(params, @assessment)
      @src_url = embed_url(@assessment, lti_context_id: params[:context_id])
    elsif params[:src_url]
      set_all_settings(params)

      # Get the remote url where we can download the qti
      @src_url = ensure_scheme(URI.decode(params[:src_url])) if params[:src_url].present?
      if params[:load_ui] == 'true'
        # Build an embed code and stats page for an assessment loaded via a url
        @embed_code = embed_code(nil, @confidence_levels, @eid, @enable_start, params[:offline].present?, params[:src_url], @style, params[:asid], params[:per_sec], @assessment.kind, @assessment_title)
      end
    else
      raise ActiveRecord::RecordNotFound
    end

    if @assessment && @assessment.kind != 'summative' && @lti_launch
      @lti_launch.clear_outcome_data!
    end

    respond_to do |format|
      format.html { render :show, layout: @embedded ? 'assessment' : 'application' }
    end
  end

  def set_all_settings(params, assessment=nil)
    @assessment_title = params[:assessment_title]
    @confidence_levels = !!params[:confidence_levels]
    @assessment_kind = params[:assessment_kind] || 'formative'
    @enable_start = !!params[:enable_start]
    @style = params[:style] || ""
    @per_sec = params[:per_sec]
    @eid = params[:eid]
    @iframe_resize_id = params[:iframe_resize_id]
    @show_post_message_navigation = params[:ext_post_message_navigation]

    @external_user_id = params[:external_user_id] || params[:user_id]
    @external_context_id = params[:external_context_id] || params[:context_id]
    @is_lti ||= false

    if assessment
      @assessment_title = assessment.title
      if assessment_settings = assessment.default_settings
        @confidence_levels = !!assessment_settings[:confidence_levels] if params[:confidence_levels].nil?   # Prefer params
        @assessment_kind = assessment.kind                                                          # Use settings
        @enable_start = !!assessment_settings[:enable_start] if params[:enable_start].nil?          # Prefer params
        @style = assessment_settings[:style] || assessment.default_style || @style                  # Prefer settings
        @per_sec = assessment_settings[:per_sec]                                                    # Use settings
        @allowed_attempts = assessment_settings.allowed_attempts.to_s                               # Use settings
      end
    end
  end

  def edit
    @assessment = Assessment.where(id: params[:id], account: current_account).first
    raise ActiveRecord::RecordNotFound unless @assessment
    set_lti_role

    return user_not_authorized unless @lti_role == "admin"
    return user_not_authorized unless params[:edit_id].present? && params[:edit_id] == @assessment.external_edit_id
    @edit_id = params[:edit_id]
    @external_context_id = @lti_launch.lti_context_id
    if as = @assessment.default_settings
      @per_section = as[:per_sec]
    end

    render :edit, layout: 'assessment'
  end

  def set_lti_role
    role_param = params["ext_roles"] || params["roles"]
    return "student" unless role_param.present?

    roles = Lti::RoleHelper.new(role_param)
    if roles.context_admin? || roles.context_instructor? || roles.institution_admin?
      @lti_role = "admin"
    else
      @lti_role = "student"
    end
  end

  def new
  end

  def create
    @assessment.user = current_user
    @assessment.account = current_account
    @assessment.save!
    respond_with(@assessment)
  end

  def destroy
    @assessment.destroy
    respond_to do |format|
      format.html { redirect_to(user_assessments_url(current_user)) }
    end
  end

  def lti
    raise "Custom parameter custom_assessment_id require for this style of lti launch" unless params[:custom_assessment_id].present?
    params[:id] = params[:custom_assessment_id]
    show
  end

  private

    def assessment_params
      params.require(:assessment).permit(:title, :description, :xml_file, :license, :keyword_list)
    end

    def check_lti
      if request.post?
        do_lti
        @is_lti = true
      end
    end
end
