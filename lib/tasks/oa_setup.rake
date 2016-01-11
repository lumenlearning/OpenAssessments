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
  formative_assessment = Assessment.create(
    title: "Formative Quiz Example",
    description: "Use this to test formative quizzes.",
    user_id: user.id,
    account_id: account_id,
    kind: "formative"
  )
  puts "Created Formative Assessment"

  summative_assessment = Assessment.create(
    title: "Summative Quiz Example",
    description: "Use this to test formative quizzes.",
    user_id: user.id,
    account_id: account_id,
    kind: "summative"
  )
  puts "Created Summative Assessment"

  swyk_assessment = Assessment.create(
    title: "Show What You Know Quiz Example",
    description: "Use this to test show what you know quizzes.",
    user_id: user.id,
    account_id: account_id,
    kind: "show_what_you_know"
  )
  puts "Created Show What You Know Assessment"

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
      mode: "formative",
      confidence_levels: true
    )
  end

  # Defines summative-assessment-specific parameters
  summative_as = AssessmentSetting.find_by assessment_id: summative_assessment.id
  summative_as.update(
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
