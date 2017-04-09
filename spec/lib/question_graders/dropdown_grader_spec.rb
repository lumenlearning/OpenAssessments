require 'rails_helper'
require 'assessment_grader'

describe QuestionGraders::DropdownGrader do
  before do
    @questions = [{"id" => "4965",
                   "timeSpent" => 4069,
                   "startTime" => 1449619801421,
                   "outcome_guid" => "2222222222222"},
    ]

    @dd_answers = [
            {"dropdown_id" => "dropdown1", "chosen_answer_id" => "968"},
            {"dropdown_id" => "dropdown2", "chosen_answer_id" => "4960"},
            {"dropdown_id" => "dropdown3", "chosen_answer_id" => "6259"}
    ]


    file = File.join(__dir__, '../../fixtures/multi_dropdown_question.xml')
    assessment = Assessment.create!(title: 'dropdown testing', xml_file: open(file).read)
    @grader = AssessmentGrader.new(@questions, [@dd_answers], assessment)
    @question_node = @grader.get_question_node_from_index(0)
  end

  it "should return 1.0 when all correct" do
    expect(subject.grade(@question_node, @dd_answers)).to be 1.0
  end

  it "should return 0.0 when all wrong" do
    @dd_answers.each{|a| a["chosen_answer_id"] = "nope"}
    expect(subject.grade(@question_node, @dd_answers)).to be 0.0
  end

  it "should return 0.333 when 1/3 correct" do
    @dd_answers[0]["chosen_answer_id"] = 'nope'
    @dd_answers[1]["chosen_answer_id"] = 'nope'
    expect(subject.grade(@question_node, @dd_answers)).to be 0.333
  end

  it "should return 0.667 when 2/3 correct" do
    @dd_answers[0]["chosen_answer_id"] = 'nope'
    expect(subject.grade(@question_node, @dd_answers)).to be 0.667
  end

  it "should parse the correct answer from the QTI" do
    expect(subject.find_correct_answers(@question_node)).to eq({"dropdown1" => "968",
                                                                "dropdown2" => "4960",
                                                                "dropdown3" => "6259"})
  end


  it "AssessmentGrader should discover type and grade" do
    @grader.grade!

    expect(@grader.score).to eq 1.0
    expect(@grader.correct_list).to eq [true]
  end

end
