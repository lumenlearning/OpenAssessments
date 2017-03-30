require 'rails_helper'
require 'jwt'

describe AssessmentGrader do
  # example of what params to GradesController#create looks like
    # params = {"itemToGrade" =>
    #                   {"questions" =>
    #                            [{"id" => "4965",
    #                              "confidenceLevel" => "Just A Guess",
    #                              "timeSpent" => 4069,
    #                              "startTime" => 1449619801421,
    #                              "outcome_guid" => "f71c5ce2-46b7-4cce-9531-1680d42faf1b"},
    #                             {"id" => "3790",
    #                              "confidenceLevel" => "Pretty Sure",
    #                              "timeSpent" => 3236,
    #                              "startTime" => 1449619805490,
    #                              "outcome_guid" => "9a82d67b-21ce-4cbf-8298-6bd1109f03b2"},
    #                             {"id" => "5555",
    #                              "confidenceLevel" => "Very Sure",
    #                              "timeSpent" => 1593,
    #                              "startTime" => 1449619808726,
    #                              "outcome_guid" => "a9fc4312-f9dd-4430-bea7-b551790a4c51"},
    #                             ],
    #                    "answers" => [["4501"], ["6386"], ["6368"]],
    #                    "assessmentId" => "345",
    #                    "identifier" => "ib7b957adb7ce471691e27cf3dd9d37a7_swyk",
    #                    "settings" =>
    #                            {"externalUserId" => "1d59ddbce40747fd7c9664c7c08e24017b8b734c",
    #                             "externalContextId" => "d4dcc12bc137c611fb8d61d0cb77f1f6c4473f34",
    #                             "userAssessmentId" => "36853",
    #                             "userAttempts" => 3,
    #                             "srcUrl" =>
    #                                     "https://assessments.lumenlearning.com/api/assessments/345.xml?lti_context_id=d4dcc12bc137c611fb8d61d0cb77f1f6c4473f34",
    #                             "lisResultSourceDid" => "",
    #                             "lisOutcomeServiceUrl" => "",
    #                             "lisUserId" => "1d59ddbce40747fd7c9664c7c08e24017b8b734c",
    #                             "isLti" => true,
    #                             "ltiRole" => "admin",
    #                             "assessmentKind" => "show_what_you_know",
    #                             "accountId" => "1"}}}
  before do
    @questions = [{"id" => "4965",
                   "confidenceLevel" => "Just A Guess",
                   "timeSpent" => 4069,
                   "startTime" => 1449619801421,
                   "outcome_guid" => "f71c5ce2-46b7-4cce-9531-1680d42faf1b"},
                  {"id" => "3790",
                   "confidenceLevel" => "Pretty Sure",
                   "timeSpent" => 3236,
                   "startTime" => 1449619805490,
                   "outcome_guid" => "9a82d67b-21ce-4cbf-8298-6bd1109f03b2"},
                  {"id" => "5555",
                   "confidenceLevel" => "Very Sure",
                   "timeSpent" => 1593,
                   "startTime" => 1449619808726,
                   "outcome_guid" => "a9fc4312-f9dd-4430-bea7-b551790a4c51"},
                  ]

    @answers = [["9755"], ["483", "1708"], "6368"]

    file = File.join(__dir__, '../fixtures/swyk_quiz.xml')
    @assessment = Assessment.create!(title: 'testing', xml_file: open(file).read )
  end

  context "Grades quiz" do
    it "grades a quiz with all correctly chosen answers" do
      ag = AssessmentGrader.new(@questions, @answers, @assessment)
      ag.grade!
      expect(ag.score).to eq 1
      expect(ag.correct_list).to eq [true, true, true]
    end

    it "grades a quiz with all incorrectly chosen answers" do
      ag = AssessmentGrader.new(@questions, [["4501"], ["6386"], "7824"], @assessment)
      ag.grade!
      expect(ag.score).to eq 0
      expect(ag.correct_list).to eq [false, false, false]
    end

    it "grades a quiz with one wrong answer" do
      ag = AssessmentGrader.new(@questions, [["4501"], ["483", "1708"], "6368"], @assessment)
      ag.grade!
      expect(ag.score).to eq 0.667
      expect(ag.correct_list).to eq [false, true, true]
    end

    it "grades a quiz with one partially right" do
      ag = AssessmentGrader.new(@questions, [["9755"], ["483", "6386"], "6368"], @assessment)
      ag.grade!
      expect(ag.score).to eq 0.75
      expect(ag.correct_list).to eq [true, "partial", true]
    end
  end

  context "Multiple answer questions" do
    it 'grades correctly for all correctly answered' do
      ag = AssessmentGrader.new(@questions, @answers, @assessment)
      expect(ag.grade_multiple_answers(0, ['9755'])).to be 1
      expect(ag.grade_multiple_answers(1, ['483', '1708'])).to be 1
    end

    it 'grades correctly for 1 correct other correct unanswered' do
      ag = AssessmentGrader.new(@questions, @answers, @assessment)
      expect(ag.grade_multiple_answers(1, ['483'])).to be 0.5
    end

    it 'grades correctly for 1 correct 2 wrong' do
      ag = AssessmentGrader.new(@questions, @answers, @assessment)
      expect(ag.grade_multiple_answers(1, ['483', '6386', '1111'])).to be 0.0
    end

    it 'grades correctly when wrong count would make it a negative score' do
      ag = AssessmentGrader.new(@questions, @answers, @assessment)
      expect(ag.grade_multiple_answers(1, ['483', '6386', '1111', '2222', '3333'])).to be 0.0
    end

    it 'grades correctly for 1 right 1 wrong' do
      ag = AssessmentGrader.new(@questions, @answers, @assessment)
      expect(ag.grade_multiple_answers(0, ['9755', '4501'])).to eq 0.667
      expect(ag.grade_multiple_answers(1, ['483', '6386'])).to eq 0.25
    end

    it 'grades correctly for 1 right 2 wrong' do
      ag = AssessmentGrader.new(@questions, @answers, @assessment)
      expect(ag.grade_multiple_answers(0, ['9755', '4501', '6570'])).to eq 0.333
    end

    it 'grades correctly for 2 right 1 wrong' do
      ag = AssessmentGrader.new(@questions, @answers, @assessment)
      expect(ag.grade_multiple_answers(1, ['483', '1708', '6386'])).to eq 0.75
    end

    it 'grades correctly for 2 right 2 wrong' do
      ag = AssessmentGrader.new(@questions, @answers, @assessment)
      expect(ag.grade_multiple_answers(1, ['483', '1708', '6386', '1111'])).to eq 0.5
    end

    it 'grades correctly for all wrong' do
      ag = AssessmentGrader.new(@questions, @answers, @assessment)
      expect(ag.grade_multiple_answers(0, ['6570'])).to eq 0
      expect(ag.grade_multiple_answers(1, ['6386', '1111'])).to eq 0
    end

    it 'grades correctly when no answers are chosen' do
      ag = AssessmentGrader.new(@questions, @answers, @assessment)
      expect(ag.grade_multiple_answers(0, [])).to eq 0
      expect(ag.grade_multiple_answers(1, [])).to eq 0
    end
  end

  context "Multiple choice question" do
    it 'returns the correct answer id' do
      ag = AssessmentGrader.new(@questions, @answers, @assessment)
      expect(ag.get_correct_mc_answer_id(2)).to eq '6368'
    end

    it 'grades correctly for correctly answered' do
      ag = AssessmentGrader.new(@questions, @answers, @assessment)
      expect(ag.grade_multiple_choice(2, '6368')).to eq 1
    end

    it 'grades correctly for incorrectly answered' do
      ag = AssessmentGrader.new(@questions, @answers, @assessment)
      expect(ag.grade_multiple_choice(2, '8330')).to be 0
    end

    it 'grades correctly when no answer is chosen' do
      ag = AssessmentGrader.new(@questions, @answers, @assessment)
      expect(ag.grade_multiple_choice(2, [])).to be 0
    end
  end

  context "Embedded MOM Questions" do
    before do
      @questions = [{"id" => "iminutehour",
                     "confidenceLevel" => "Just A Guess",
                     "timeSpent" => 4069,
                     "startTime" => 1449619801421,
                     "outcome_guid" => "2222222222222"},
      ]

      @jwt_paylod = {"id" => 987, "score" => 1, "redisplay" => "987;0;(2,2)", "auth" => "oi"}
      @correct_jwt = JWT.encode(@jwt_paylod, Rails.application.secrets.mom_secret)

      file = File.join(__dir__, '../fixtures/mom_embed_formative.xml')
      assessment = Assessment.create!(title: 'testing', xml_file: open(file).read)
      @grader = AssessmentGrader.new(@questions, [@correct_jwt], assessment)
    end

    it "should get mom question id from `mat_extension mom_embed_url` field" do
      expect(@grader.get_mom_question_id(0)).to be 987
    end

    it "should return score from JWT when valid" do
      expect(@grader.grade_mom_embed(0, @correct_jwt)).to be 1
    end

    it "should return 0 for invalid JWT" do
      expect(@grader.grade_mom_embed(0, "haha")).to be 0

      different_key = JWT.encode(@jwt_paylod, "notsecret")
      expect(@grader.grade_mom_embed(0, different_key)).to be 0
    end

    it "should return 0 when JWT's question id is different than QTI's" do
      @jwt_paylod["id"] = 10
      different_id = JWT.encode(@jwt_paylod, Rails.application.secrets.mom_secret)

      expect(@grader.grade_mom_embed(0, different_id)).to be 0
    end
  end

  context "Essay" do
    before do
      @questions = [{"id" => "3790",
                     "timeSpent" => 4069,
                     "startTime" => 1449619801421,
                     "outcome_guid" => "2222222222222"},
      ]

      file = File.join(__dir__, '../fixtures/essay_question.xml')
      assessment = Assessment.create!(title: 'essay testing', xml_file: open(file).read)
      @grader = AssessmentGrader.new(@questions, ["my answer"], assessment)
    end

    it "should mark it correct if there is a non-blank response" do
      expect(@grader.grade_essay_question(0, 'hi')).to be 1
    end

    it "should mark it incorrect if there is a blank response" do
      expect(@grader.grade_essay_question(0, '')).to be 0
      expect(@grader.grade_essay_question(0, ' ')).to be 0
      expect(@grader.grade_essay_question(0, "\n")).to be 0
    end

    it "should handle an answer in an array" do
      expect(@grader.grade_essay_question(0, ['hi'])).to be 1
    end

    it "should discover type and grade" do
      @grader.grade!

      expect(@grader.score).to eq 1.0
      expect(@grader.correct_list).to eq [true]
    end

  end

end
