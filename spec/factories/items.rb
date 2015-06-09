FactoryGirl.define do

  factory :item do
    section
    identifier { FactoryGirl.generate(:identifier) }
    feedback "{\"Yellow\":[\"3389_fb\",\"correct_fb\"],\"yellow\":[\"9569_fb\",\"correct_fb\"],\"amarillo\":[\"4469_fb\",\"correct_fb\"],\"blue\":[\"correct_fb\"]}"
    item_feedback "{\"general_fb\":[\"That dude is old.\"],\"correct_fb\":[\"You stay on the bridge. Good job.\"],\"general_incorrect_fb\":[\"You were thrown off the bridge.\"],\"3389_fb\":[\"good\"],\"9569_fb\":[\"good again\"],\"4469_fb\":[\"spanish\"]}"
    correct_responses "[\"Yellow\",\"yellow\",\"amarillo\",\"blue\"]"
  end
  
end