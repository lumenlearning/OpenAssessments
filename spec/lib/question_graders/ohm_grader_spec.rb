require 'rails_helper'
require 'assessment_grader'
require 'jwt'

describe QuestionGraders::OhmGrader do
  before do
    @questions = [{"id" => "iminutehour",
                   "confidenceLevel" => "Just A Guess",
                   "timeSpent" => 4069,
                   "startTime" => 1449619801421,
                   "outcome_guid" => "2222222222222"},
    ]

    @jwt_paylod = {"id" => 987, "score" => 1, "redisplay" => "987;0;(2,2)", "auth" => "oi"}
    @correct_jwt = JWT.encode(@jwt_paylod, Rails.application.secrets.mom_secret)

    file = File.join(__dir__, '../../fixtures/mom_embed_formative.xml')
    assessment = Assessment.create!(title: 'testing', xml_file: open(file).read)
    @grader = AssessmentGrader.new(@questions, [@correct_jwt], assessment)
  end

  it "should get mom question id from `mat_extension mom_embed_url` field" do
    expect(QuestionGraders::OhmGrader.get_mom_question_id(@grader.get_question_node_from_index(0))).to be 987
  end

  it "should return score from JWT when valid" do
    expect(QuestionGraders::OhmGrader.grade(@grader.get_question_node_from_index(0), @correct_jwt)).to be 1
  end

  it "should return 0 for invalid JWT" do
    expect(QuestionGraders::OhmGrader.grade(@grader.get_question_node_from_index(0), "haha")).to be 0

    different_key = JWT.encode(@jwt_paylod, "notsecret")
    expect(QuestionGraders::OhmGrader.grade(@grader.get_question_node_from_index(0), different_key)).to be 0
  end

  it "should return 0 when JWT's question id is different than QTI's" do
    @jwt_paylod["id"] = 10
    different_id = JWT.encode(@jwt_paylod, Rails.application.secrets.mom_secret)

    expect(QuestionGraders::OhmGrader.grade(@grader.get_question_node_from_index(0), different_id)).to be 0
  end

  it "AssessmentGrader should discover type and grade" do
    @grader.grade!

    expect(@grader.score).to eq 1.0
    expect(@grader.correct_list).to eq [true]
  end

end
