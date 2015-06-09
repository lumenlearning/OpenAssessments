FactoryGirl.define do
  factory :assessment do
    identifier { FactoryGirl.generate(:identifier) }
    title       { FactoryGirl.generate(:name) }
    description { FactoryGirl.generate(:description) }
    src_url     { FactoryGirl.generate(:uri) }
    user
  end
end