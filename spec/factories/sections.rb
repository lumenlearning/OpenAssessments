FactoryGirl.define do
  
  factory :section do
    assessment
    identifier { FactoryGirl.generate(:identifier) }
  end

end