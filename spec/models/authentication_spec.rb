require 'spec_helper'

describe Authentication do
  %w(user_id token secret provider provider_url json_response uid provider_avatar refresh_token).each do |field|
    it { should allow_mass_assignment_of(field.to_sym) }
  end

  it { should belong_to :user }
end
