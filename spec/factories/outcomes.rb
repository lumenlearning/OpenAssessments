FactoryGirl.define do

  factory :outcome do
    name { FactoryGirl.generate(:name) }
    mc3_bank_id { FactoryGirl.generate(:bank_id) }
    mc3_objective_id { FactoryGirl.generate(:objective_id) }
  end

end