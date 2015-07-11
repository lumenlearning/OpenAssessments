FactoryGirl.define do

  sequence :lti_key do |n|
    "lti_key_#{n}"
  end

  sequence :identifier do |n|
    "id_#{n}"
  end

  sequence :domain do |n|
    "www.example#{n}.com"
  end

  sequence :code do |n|
    "code#{n}"
  end

  sequence :name do |n|
    "user_#{n}"
  end

  sequence :email do |n|
    "user_#{n}@example.com"
  end

  sequence :password do |n|
    "password_#{n}"
  end

  sequence :title do |n|
    "a_title#{n}"
  end

  sequence :abbr do |n|
    "a#{n}"
  end

  sequence :height do |n|
    n + 600
  end

  sequence :keywords do |n|
    "a#{n}, b#{n}"
  end

  sequence :uri do |n|
    "n#{n}.example.com"
  end

  sequence :description do |n|
    "This is the description: #{n}"
  end

  sequence :locale do |n|
    "a#{n}"
  end

  sequence :address do |n|
    "#{n} West #{n} South"
  end

  sequence :bank_id do |n|
    "asdf#{n}"
  end

  sequence :objective_id do |n|
    "oiu#{n}"
  end
  
end