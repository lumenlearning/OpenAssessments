require 'rails_helper'
require 'json2qti'
require 'nokogiri'

describe Json2Qti::MultipleChoice do
  let(:json) {
    {"id" => "3790",
     "title" => "",
     "question_type" => "essay_question",
     "material" => "<div><p>Express your feelings about that one thing.</p></div>",
     "feedback" => {"general_fb" => "<p>Example answers are: <br>Weird. Because reasons.</p>\n<p>Great.<span> Because reasons.</span></p>"},
     "outcome" => {
             "shortOutcome" => "Short Name",
             "longOutcome" => "Long Name",
             "outcomeGuid" => "f71c5ce2"
     }
    }
  }
  let(:question) { Json2Qti::Essay.new(json) }

  it "should have question material" do
    node = Nokogiri::XML(question.to_qti)

    expect(node.at_css('presentation material mattext').text).to eq json["material"]
  end

  it "should have a response_str and label" do
    node = Nokogiri::XML(question.to_qti)

    label = node.at_css("response_str[ident=#{question.respident}]")
    expect(label.at_css('render_fib response_label')['ident']).to eq 'answer1'
  end

  it "should set the question type" do
    expect(question.to_qti).to include("<fieldentry>essay_question</fieldentry>")
  end

end