require 'rails_helper'
require 'json2qti'
require 'nokogiri'

describe Json2Qti::OhmEmbed do
  let(:json) {
    {"id" => "iminutehour",
     "title" => "",
     "question_type" => "mom_embed",
     "material" => "",
     "answers" => [],
     "outcome" => {"shortOutcome" => "Minute to Hours Time Conversion",
                   "longOutcome" => "This is useful.",
                   "outcomeGuid" => "2222222222222"},
     "mom_embed" => {"questionId" => "987",
                     "embedUrl" => "https://www.myopenmath.com/OEAembedq.php?id=987&amp;jssubmit=1&amp;showscoredonsubmit=0",
                     "jwt" => "",
                     "domain" => "www.myopenmath.com",
                     "iframeHeight" => nil}
    }
  }
  let(:question){Json2Qti::OhmEmbed.new(json)}

  it "should have an iframe in presentation > material > mattext" do
    node = Nokogiri::XML(question.to_qti)
    material = node.at_css('presentation > material > mattext').text

    expect(material).to_not include(json["mom_embed"]["embedUrl"])
    expect(material).to eq (Json2Qti::OhmEmbed::IFRAME % ["987", question.ohm_url])
  end

  it "should info in presentation > material > mat_extension" do
    node = Nokogiri::XML(question.to_qti)

    expect(node.at_css('presentation > material > mat_extension > mom_domain').text).to eq json["mom_embed"]["domain"]
    expect(node.at_css('presentation > material > mat_extension > mom_question_id').text).to eq json["mom_embed"]["questionId"]
    expect(node.at_css('presentation > material > mat_extension > mom_embed_url').text).to eq question.ohm_url
    expect(node.at_css('presentation > material > mat_extension > mom_embed_url').text).to_not eq json["mom_embed"]["embedUrl"]
  end


  it "should leave grading comment in resprocessing > itemproc_extension" do
    node = Nokogiri::XML(question.to_qti)
    ext = node.at_css('resprocessing > itemproc_extension')
    comment = ext.children.find{|n| n.comment? }

    expect(comment).to_not be_nil
  end

  it "should set the question type" do
    expect(question.to_qti).to include("<fieldentry>mom_embed</fieldentry>")
  end
end