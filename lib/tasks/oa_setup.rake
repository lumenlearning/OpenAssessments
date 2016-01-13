task :oa_setup => :environment do

  account_id = Account.find(1).id

  puts "Would you like to delete past data? y/n"
  response = STDIN.gets.chomp
  if response == "y"
    User.destroy_all
    Assessment.destroy_all
    AssessmentSetting.destroy_all
    puts "Past data deleted"
  end

  # Prompts user for the email address to be used for signing in to OA
  puts  "Please enter your email"
  email = STDIN.gets

  # Prompts user for the password to be used for signing in to OA
  puts  "Please enter your password (at least 8 characters)"
  password = STDIN.noecho(&:gets).chomp

  # Creates a user object
  # email: [User Entry] password: password
  user = User.create(
    email: email,
    password: password,
    remember_created_at: Time.now,
    confirmation_sent_at: Time.now,
    role: 2,
    confirmed_at: Time.now,
    current_sign_in_at: Time.now,
    account_id: account_id
  )
  user.add_to_role("administrator")
  puts "User created"

  # Creates the Formative, Summative, and Show What You Know quizzes
  i = 0
  quiz_types = ["formative", "summative", "show_what_you_know"]

  while i < 3 do
    Assessment.create(
      title: "#{quiz_types[i]} quiz example",
      description: "use this to test #{quiz_types[i]} quizzes.",
      user_id: user.id,
      account_id: account_id,
      kind: "#{quiz_types[i]}"
    )
    puts "Created #{quiz_types[i]} assessment"
    i += 1
  end

  # Creates a simple 3 question quiz for all three quiz types
  Assessment.all.each do |assessment|
    File.open("spec/fixtures/swyk_quiz.xml") do |file|
      assessment.xml_file = file
      assessment.save!
    end

    AssessmentSetting.create(
      assessment_id: assessment.id,
      account_id: account_id,
      style: "lumen_learning",
      enable_start: true,
      mode: assessment.kind,
      confidence_levels: true
    )
  end

  # Defines summative-assessment-specific parameters
  as = AssessmentSetting.find_by assessment_id: Assessment.find_by(kind: "summative").id
  as.update(
    per_sec: 2,
    allowed_attempts: 2
  )
  puts "Created Assessment Settings"

  # Sets the account domain to 'localhost', and the key/secret to 'fake'
  account = Account.find(1)
  account.update(
    domain: "localhost",
    lti_key: "fake",
    lti_secret: "fake"
  )

  puts "All done!"

end
