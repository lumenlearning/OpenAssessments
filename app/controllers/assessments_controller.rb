require 'open-uri'
require 'lti_role_helper'

class AssessmentsController < ApplicationController

  skip_before_filter :verify_authenticity_token
  
  before_filter :skip_trackable
  before_filter :authenticate_user!, only: [:new, :create, :destroy]
  before_filter :check_lti, only: [:show, :lti]
  load_and_authorize_resource except: [:show, :lti]

  respond_to :html

  def index
    @assessments = @assessments.where(account: current_account, kind: ['formative', 'show_what_you_know'])
  end

  def show
    if params[:load_ui] == 'true'
      @embedded = false
    else
      @embedded = params[:src_url].present? || params[:embed].present? || @is_lti
    end
    @confidence_levels = params[:confidence_levels] ? true : false
    @enable_start = params[:enable_start] ? true : false
    @eid = params[:eid] if params[:eid]
    @keywords = params[:keywords] if params[:keywords]
    @external_user_id = params[:external_user_id] if params[:external_user_id]
    @external_context_id = params[:external_context_id] if params[:external_context_id]
    @results_end_point = ensure_scheme(params[:results_end_point]) if params[:results_end_point].present?
    @style = params[:style] ? params[:style] :  ""
    @per_sec = params[:per_sec] ? params[:per_sec] : nil
    @account_id = current_account.id
    set_lti_role

    if params[:id].present? && !['load', 'offline'].include?(params[:id])
      @assessment = Assessment.where(id: params[:id], account: current_account).first
      @assessment_id = @assessment ? @assessment.id : params[:assessment_id] || 'null'
      @assessment_settings = params[:asid] ?  AssessmentSetting.find(params[:asid]) : @assessment.default_settings || current_account.default_settings || AssessmentSetting.where(is_default: true).first
      @style ||= @assessment.default_style if @assessment.default_style
      @assessment_title = @assessment.title
      node = Nokogiri::XML(@assessment.assessment_xmls.where(kind: "summative").last.xml)
      @section_count = node.css('section section').count
      if @assessment_settings.present?
        @style = @style != "" ? @style : @assessment_settings[:style] || ""
        @enable_start = params[:enable_start] ?  @enable_start : @assessment_settings[:enable_start] || false
        @confidence_levels = params[:confidence_levels] ?  @confidence_levels : @assessment_settings[:confidence_levels] || false
        @per_sec = @per_sec ? @per_sec : @assessment_settings[:per_sec] || ""  
      end
      @assessment_kind = @assessment.kind
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
        @embed_code = embed_code(@assessment, @confidence_levels, @eid, @enable_start, params[:offline].present?, nil, @style, params[:asid], @per_sec, @assessment_kind, @assessment_title, @section_count)
      end
    else
      # Get the remote url where we can download the qti
      @src_url = ensure_scheme(URI.decode(params[:src_url])) if params[:src_url].present?
      if params[:load_ui] == 'true'
        # Build an embed code and stats page for an assessment loaded via a url
        @embed_code = embed_code(nil, @confidence_levels, @eid, @enable_start, params[:offline].present?, params[:src_url], @style, params[:asid], params[:per_sec], @assessment_kind, @assessment_title, @section_count)
      end

    end

    if params[:offline].present? && @src_url.present?
      @src_data = open(@src_url).read
      xml = EdxSequentialParser.parse(@src_data)
      # edX
      if defined?(xml.verticals)
        base_uri = @src_url[0, @src_url.index('sequential')];
        @edx_verticals = crawlEdx(base_uri, 'vertical', xml.verticals.map(&:url_name))
        @edx_problems = {}
        @edx_verticals.each do |id, vertical|
          xml = EdxVerticalParser.parse(vertical)
          @edx_problems.merge!(crawlEdx(base_uri, 'problem', xml.problems.map(&:url_name)))
        end
      end
    end

    @is_lti ||= false
    @assessment_kind  ||= params[:assessment_kind]
    @assessment_title ||= params[:assessment_title]
    @section_count    ||= params[:section_count]
    # extract LTI values
    @external_user_id ||= params[:user_id]
    @external_context_id ||= params[:context_id]

    @show_post_message_navigation = params[:ext_post_message_navigation]

    respond_to do |format|
      format.html { render :show, layout: @embedded ? 'assessment' : 'application' }
    end
  end

  def set_lti_role
    role_param = params["ext_roles"] || params["roles"]
    return "student" unless role_param.present?

    roles = LtiRoleHelper.new(role_param)
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

    def crawlEdx(base_uri, type, ids)
      ids.inject({}) do |hsh, id|
        hsh[id] = open(base_uri + type + '/' + id + '.xml').read
        hsh
      end
    end

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
