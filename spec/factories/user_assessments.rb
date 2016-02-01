FactoryGirl.define do
  factory :user_assessment do
    assessment
    user
    attempts 3
    eid 'fake_external_identifier'
    lti_context_id 'fake_lti_context_id'
  end

end
