require 'rails_helper'
require 'json2qti'
require 'nokogiri'

describe Json2Qti::Question do
  let(:json) {
    {
            "id" => "4965",
            "title" => "This & That",
            "question_type" => "multiple_choice_question",
            "material" => "Which of the following? &amp;",
            "answers" => [
                    {
                            "id" => "9755",
                            "material" => "This?<script>alert('sneakiness');</script><p style='background-color: blue'>blue</p>",
                            "isCorrect" => true
                    },
                    {
                            "id" => "4501",
                            "material" => "<abbr title='Lumen'>LL</abbr> &amp; <span>Or this?</span>",
                            "isCorrect" => false
                    },
                    {
                            "id" => "4650",
                            "material" => nil,
                            "isCorrect" => nil
                    }
            ],
            "outcome" => {
                    "shortOutcome" => "Short & Name",
                    "longOutcome" => "Long & Name",
                    "outcomeGuid" => "&f71c5ce2"
            }
    }
  }
  let(:question){Json2Qti::MultipleChoice.new(json)}

  it "should add outcome" do
    expect(question.to_qti).to include("<fieldentry>Short &amp; Name</fieldentry>")
    expect(question.to_qti).to include("<fieldentry>Long &amp; Name</fieldentry>")
    expect(question.to_qti).to include("<fieldentry>&amp;f71c5ce2</fieldentry>")
  end

  it "should escape question material" do
    expect(question.to_qti).to include(%{<mattext texttype="text/html">Which of the following? &amp;amp;</mattext>})
    expect(question.to_qti).to include(%{mattext texttype="text/html">&lt;abbr title=\"Lumen\"&gt;LL&lt;/abbr&gt; &amp;amp; &lt;span&gt;Or this?&lt;/span&gt;</mattext>})
    expect(question.to_qti).to include(%{<item title="This &amp; That"})
  end

  it "should generate a new id" do
    node = Nokogiri::XML(question.to_qti)
    expect(node.at_css('item @ident').text).not_to eq '4965'
  end

  it "should set the question type" do
    expect(question.to_qti).to include("<fieldentry>multiple_choice_question</fieldentry>")
  end

  it "should sanitize material" do
    expect(question.to_qti).to include(%{<mattext texttype="text/html">Which of the following? &amp;amp;</mattext>})
    expect(question.to_qti).to include(%{<mattext texttype="text/html">This?alert('sneakiness');&lt;p style=\"background-color: blue;\"&gt;blue&lt;/p&gt;</mattext>})
  end
  it "should not sanitize title or span" do
    expect(question.to_qti).to include(%{mattext texttype="text/html">&lt;abbr title=\"Lumen\"&gt;LL&lt;/abbr&gt; &amp;amp; &lt;span&gt;Or this?&lt;/span&gt;</mattext>})
  end
  it "should return nothing if material is nil" do
    expect(question.to_qti).to include(%{mattext texttype="text/html"></mattext>})
  end
end
