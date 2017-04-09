require 'rails_helper'
require 'assessment_grader'

describe QuestionGraders::MultipleChoiceGrader do

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

    file = File.join(__dir__, '../../fixtures/swyk_quiz.xml')
    @assessment = Assessment.create!(title: 'testing', xml_file: open(file).read)
  end

  before do
    @ag = AssessmentGrader.new(@questions, @answers, @assessment)
    @question_node = @ag.get_question_node_from_index(2)
  end

  it 'returns the correct answer id' do
    expect(QuestionGraders::MultipleChoiceGrader.get_correct_mc_answer_id(@question_node)).to eq '6368'
  end

  it 'grades correctly for correctly answered' do
    expect(QuestionGraders::MultipleChoiceGrader.grade(@question_node, '6368')).to eq 1
  end

  it 'grades correctly for incorrectly answered' do
    expect(QuestionGraders::MultipleChoiceGrader.grade(@question_node, '8330')).to be 0
  end

  it 'grades correctly when no answer is chosen' do
    expect(QuestionGraders::MultipleChoiceGrader.grade(@question_node, [])).to be 0
  end


end
