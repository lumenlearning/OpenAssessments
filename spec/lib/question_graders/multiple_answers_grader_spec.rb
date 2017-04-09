require 'rails_helper'
require 'assessment_grader'

describe QuestionGraders::MultipleAnswersGrader do

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
    @question_node0 = @ag.get_question_node_from_index(0)
    @question_node1 = @ag.get_question_node_from_index(1)
  end

  it 'grades correctly for all correctly answered' do
    expect(QuestionGraders::MultipleAnswersGrader.grade(@question_node0, ['9755'])).to be 1
    expect(QuestionGraders::MultipleAnswersGrader.grade(@question_node1, ['483', '1708'])).to be 1
  end

  it 'grades correctly for 1 correct other correct unanswered' do
    expect(QuestionGraders::MultipleAnswersGrader.grade(@question_node1, ['483'])).to be 0.5
  end

  it 'grades correctly for 1 correct 2 wrong' do
    expect(QuestionGraders::MultipleAnswersGrader.grade(@question_node1, ['483', '6386', '1111'])).to be 0.0
  end

  it 'grades correctly when wrong count would make it a negative score' do
    expect(QuestionGraders::MultipleAnswersGrader.grade(@question_node1, ['483', '6386', '1111', '2222', '3333'])).to be 0.0
  end

  it 'grades correctly for 1 right 1 wrong' do
    expect(QuestionGraders::MultipleAnswersGrader.grade(@question_node0, ['9755', '4501'])).to eq 0.667
    expect(QuestionGraders::MultipleAnswersGrader.grade(@question_node1, ['483', '6386'])).to eq 0.25
  end

  it 'grades correctly for 1 right 2 wrong' do
    expect(QuestionGraders::MultipleAnswersGrader.grade(@question_node0, ['9755', '4501', '6570'])).to eq 0.333
  end

  it 'grades correctly for 2 right 1 wrong' do
    expect(QuestionGraders::MultipleAnswersGrader.grade(@question_node1, ['483', '1708', '6386'])).to eq 0.75
  end

  it 'grades correctly for 2 right 2 wrong' do
    expect(QuestionGraders::MultipleAnswersGrader.grade(@question_node1, ['483', '1708', '6386', '1111'])).to eq 0.5
  end

  it 'grades correctly for all wrong' do
    expect(QuestionGraders::MultipleAnswersGrader.grade(@question_node0, ['6570'])).to eq 0
    expect(QuestionGraders::MultipleAnswersGrader.grade(@question_node1, ['6386', '1111'])).to eq 0
  end

  it 'grades correctly when no answers are chosen' do
    expect(QuestionGraders::MultipleAnswersGrader.grade(@question_node0, [])).to eq 0
    expect(QuestionGraders::MultipleAnswersGrader.grade(@question_node1, [])).to eq 0
  end

  it "AssessmentGrader should discover type and grade" do
    @ag.grade!

    expect(@ag.score).to eq 1.0
    expect(@ag.correct_list).to eq [true, true, true]
  end

end
