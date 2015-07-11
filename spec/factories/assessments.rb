FactoryGirl.define do
  factory :assessment do
    identifier { FactoryGirl.generate(:identifier) }
    title       { FactoryGirl.generate(:name) }
    description { FactoryGirl.generate(:description) }
    src_url     { FactoryGirl.generate(:uri) }
    recommended_height { FactoryGirl.generate(:height) }
    keyword_list { FactoryGirl.generate(:keywords) }
    user
    account
  end
end