FactoryGirl.define do

  factory :item_result do
    item
    user
    assessment_result
    session_status { 'initial' }
  end

end