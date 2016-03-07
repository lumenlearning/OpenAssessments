require "securerandom"

class LtiLaunch < ActiveRecord::Base
  store_accessor :data, :lis_result_sourcedid, :lis_outcome_service_url,
                 :outcome_error_message, :launch_error_message, :lti_roles
  belongs_to :account
  belongs_to :user
  belongs_to :lti_credential
  has_one :assessment_result

  def self.from_params(params)
    launch = LtiLaunch.new(lti_user_id: params[:user_id],
                           lti_context_id: params[:context_id],
                           tc_instance_guid: params[:tool_consumer_instance_guid],
                           oauth_nonce: params[:oauth_nonce],
                           was_valid: false,
    )
    launch.save_outcome_data(params)
    launch.lti_roles = params["ext_roles"] || params["roles"]

    launch.save
    launch
  end

  def save_outcome_data(params)
    self.lis_result_sourcedid = params[:lis_result_sourcedid]
    self.lis_outcome_service_url = params[:lis_outcome_service_url]
  end

  def send_outcome_to_tool_consumer(score=1)
    @tp = lti_credential.create_tool_provider(self.data)

    if !@tp.outcome_service?
      self.outcome_error_message = "No lis variables set"
      self.save
      return false
    end

    # post the given score to the TC
    res = @tp.post_replace_result!(score)

    if res.success?
      true
    else
      self.outcome_error_message = "#{res.response_code} - #{res.code_major} - #{res.severity} - #{res.description}"
      self.save
      false
    end
  end

  def self.valid_nonce?(nonce, valid_minutes=5)
    now = Time.now.utc.to_i
    LtiLaunch.where(oauth_nonce: nonce).each do |launch|
      return false if now - launch.created_at.utc.to_i < valid_minutes * 60
    end

    true
  end
end
