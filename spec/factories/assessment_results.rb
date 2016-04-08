FactoryGirl.define do

  factory :assessment_result do
    assessment
    user
    user_assessment
		identifier 'fake_identifier'
  end

end