require 'rails_helper'
require 'assessment_grader'

describe QuestionGraders::EssayGrader do
  before do
    @questions = [{"id" => "3790",
                   "timeSpent" => 4069,
                   "startTime" => 1449619801421,
                   "outcome_guid" => "2222222222222"},
    ]

    file = File.join(__dir__, '../../fixtures/essay_question.xml')
    assessment = Assessment.create!(title: 'essay testing', xml_file: open(file).read)
    @grader = AssessmentGrader.new(@questions, ["my answer"], assessment)
    @question_node = @grader.get_question_node_from_index(0)
  end

  it "should mark it correct if there is a non-blank response" do
    expect(subject.grade(@question_node, 'hi')).to be 1
  end

  it "should mark it incorrect if there is a blank response" do
    expect(subject.grade(@question_node, '')).to be 0
    expect(subject.grade(@question_node, ' ')).to be 0
    expect(subject.grade(@question_node, "\n")).to be 0
  end

  it "should handle an answer in an array" do
    expect(subject.grade(@question_node, ['hi'])).to be 1
  end

  it "AssessmentGrader should discover type and grade" do
    @grader.grade!

    expect(@grader.score).to eq 1.0
    expect(@grader.correct_list).to eq [true]
  end

end
