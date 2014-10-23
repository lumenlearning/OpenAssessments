# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :external_identifier do
    identifier { FactoryGirl.generate(:name) }
    provider { FactoryGirl.generate(:uri) }
  end
end
