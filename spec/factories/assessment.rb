FactoryGirl.define do

  factory :assessment do

    identifier  { FactoryGirl.generate(:code) }
    title       { FactoryGirl.generate(:name) }
    description { FactoryGirl.generate(:description) }
    src_url     { FactoryGirl.generate(:uri) }
    user

  end
end