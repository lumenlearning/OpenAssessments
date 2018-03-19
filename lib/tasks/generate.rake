namespace :generate do

  desc "Seed the account with users"
  task :users, [:users, :id] => [:environment] do |t, args|

    i = 0
    users = args.users.to_i || 1
    id = args.id.to_i || 1
    account = Account.find(id)
    puts "Creating users for " + account.name + ", one moment please."
    while i < users do
      puts account.users.create(FactoryGirl.attributes_for(:user))
      i+=1
    end
    puts "Created #{users} users"
  end

  desc "seed the database with accounts"
  task :accounts, [:accounts] => [:environment] do |t, args|
    i = 0
    accounts = args.accounts.to_i || 1
    while i < accounts do
      puts Account.create(FactoryGirl.attributes_for(:account))
      i+=1
    end
    puts "Created #{accounts} accounts"
  end

  desc "generate assessments"
  namespace :quizzes do

    desc "clear all existing assessments and settings"
    task :clear => :environment do

    end

    desc "generate quizzes for local testing"
    task :all => :environment do
      create_all_quizzes
    end

    desc "generate a quiz"
    # rake generate:quizzes:one[spec/fixtures/swyk_quiz.xml,swyk]
    task :one, [:qti_file, :kind] => :environment do |t, args|
      q = create_quiz(args[:qti_file], args[:kind])
      puts "#{q.id} — fixture file: #{q.title} — type: #{q.kind}"
    end

  end

  def create_quiz(file_path, kind)
    kind ||= 'formative'
    kind = 'show_what_you_know' if kind == 'swyk'

    asmnt = Assessment.create(
            title: File.basename(file_path, '.xml'),
            description: "use this to test #{kind} quizzes.",
            account_id: 1,
            kind: kind,
            external_edit_id: 'devedit'
    )
    File.open(file_path) do |file|
      asmnt.xml_file = file
      asmnt.save!
    end

    AssessmentSetting.create(
      assessment_id: asmnt.id,
      account_id: 1,
      style: "lumen_learning",
      enable_start: asmnt.kind != 'formative' && asmnt.kind != 'practice',
      mode: asmnt.kind,
      confidence_levels: %w{formative practice}.member?(asmnt.kind),
      allowed_attempts: asmnt.kind == 'summative' ? 10 : nil,
      show_answers: %w{formative practice}.member?(asmnt.kind)
    )

    asmnt
  end

  def create_all_quizzes
    qti_files = ['spec/fixtures/swyk_quiz.xml', 'spec/fixtures/essay_question.xml', 'spec/fixtures/multi_dropdown_question.xml', 'spec/fixtures/swyk_quiz.xml', 'spec/fixtures/dropdown_essay_questions.xml']
    kinds = ['formative', 'practice', 'summative', 'show_what_you_know']
    created_quizzes = []

    qti_files.each do |file|
      kinds.each do |kind|
        created_quizzes << create_quiz(file, kind)
      end
    end

    created_quizzes.each do |q|
      puts "#{q.id} — fixture file: #{q.title} — type: #{q.kind}"
    end
  end

end
