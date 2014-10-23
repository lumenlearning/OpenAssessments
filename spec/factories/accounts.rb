# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do

  sequence :lti_key do |n|
    "lti_key_#{n}"
  end

  sequence :domain do |n|
    "www.example.com"
  end

  factory :account do
    name { FactoryGirl.generate(:name) }
    lti_key { FactoryGirl.generate(:lti_key) }
    domain { FactoryGirl.generate(:domain) }
    canvas_uri { FactoryGirl.generate(:domain) }

  end
end
