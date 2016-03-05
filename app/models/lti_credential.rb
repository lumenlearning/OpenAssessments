class LtiCredential < ActiveRecord::Base
  attr_encrypted :lti_secret, key: Rails.application.secrets.encryption_key, mode: :per_attribute_iv_and_salt
  validates_presence_of :account_id

  scope :enabled, -> {where(enabled: true)}

  belongs_to :account

  def create_tool_provider(params={})
    IMS::LTI::ToolProvider.new(self.lti_key, self.lti_secret, params)
  end
end
