require 'rails_helper'
require 'support/nokogiri_helpers'

RSpec.configure do |config|
  config.include NokogiriHelpers
end

describe AssessmentXml do
  before do
    @xml = open('./spec/fixtures/sections_assessment.xml').read
  end

  context "AssessmentXml instance" do
    before do
      @assessment_xml = AssessmentXml.new
      @assessment_xml.xml = @xml
      @assessment_xml.no_answer_xml = @xml
    end

    it "should reduce for xml" do
      post_processed_node = Nokogiri::XML(@assessment_xml.xml_with_limited_questions(1))
      post_processed_node.css('section section').each do |s|
        expect(s.css('item').count).to eq 1
      end
    end

    it "should reduce for no_anser_xml" do
      post_processed_node = Nokogiri::XML(@assessment_xml.no_answer_xml_with_limited_questions(1))
      post_processed_node.css('section section').each do |s|
        expect(s.css('item').count).to eq 1
      end
    end

  end


  context "AssessmentXml.xml_with_limited_questions" do
    before do
      @ids = []
      @post_processed_node = Nokogiri::XML(AssessmentXml.xml_with_limited_questions(@xml, 1, @ids))
    end

    it "should lower the item count in the sections" do
      @post_processed_node.css('section section').each do |s|
        expect(s.css('item').count).to eq 1
      end
    end

    it "should store the selected item identifiers" do
      @post_processed_node.css('item').each_with_index do |item, i|
        expect(@ids[i]).to eq item['ident']
      end
    end

    it "should limit without nested sections" do
      # has 8 items in 1 top-level section
      @xml = File.read(File.join(__dir__, '../fixtures/assessment.xml'))
      node = Nokogiri::XML(AssessmentXml.xml_with_limited_questions(@xml, 2))

      expect(node.css('item').count).to eq 2
    end

  end

  context "AssessmentXml.move_items_from_section" do
    before(:each) do
      @source_xml = Nokogiri::HTML::DocumentFragment.parse <<-EOSOURCEXML
<?xml version="1.0" encoding="UTF-8"?>
<questestinterop xmlns="http://www.imsglobal.org/xsd/ims_qtiasiv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/ims_qtiasiv1p2 http://www.imsglobal.org/xsd/ims_qtiasiv1p2p1.xsd">
  <assessment title="Show What You Know: Policy Application" ident="ib116e1ef09a84426bab060f8d936d8b7_swyk">
    <section ident="root_section">
      <section title="Liquidity Trap" ident="170">
        <item title="" ident="7773">
          <itemmetadata>
            <qtimetadata>
              <qtimetadatafield>
                <fieldlabel>question_type</fieldlabel>
                <fieldentry>multiple_answers_question</fieldentry>
              </qtimetadatafield>
              <qtimetadatafield>
                <fieldlabel>outcome_guid</fieldlabel>
                <fieldentry>65b449c6-afb8-416f-960b-8aaf69cb4ed2</fieldentry>
              </qtimetadatafield>
              <qtimetadatafield>
                <fieldlabel>outcome_short_title</fieldlabel>
                <fieldentry>Liquidity Trap</fieldentry>
              </qtimetadatafield>
              <qtimetadatafield>
                <fieldlabel>outcome_long_title</fieldlabel>
                <fieldentry>Explain the implications of a Liquidity Trap</fieldentry>
              </qtimetadatafield>
            </qtimetadata>
          </itemmetadata>
        </item>
      </section>
      <section title="The Expenditure Multiplier" ident="2902">
        <item title="" ident="1737">
          <itemmetadata>
            <qtimetadata>
              <qtimetadatafield>
                <fieldlabel>question_type</fieldlabel>
                <fieldentry>multiple_answers_question</fieldentry>
              </qtimetadatafield>
              <qtimetadatafield>
                <fieldlabel>outcome_guid</fieldlabel>
                <fieldentry>adfb2853-598d-48f7-8206-50edaac3a16c</fieldentry>
              </qtimetadatafield>
              <qtimetadatafield>
                <fieldlabel>outcome_short_title</fieldlabel>
                <fieldentry>The Expenditure Multiplier</fieldentry>
              </qtimetadatafield>
              <qtimetadatafield>
                <fieldlabel>outcome_long_title</fieldlabel>
                <fieldentry>Explain the significance of the Expenditure Multiplier</fieldentry>
              </qtimetadatafield>
            </qtimetadata>
          </itemmetadata>
        </item>
      </section>
      <section title="Crowding Out" ident="5247">
        <item title="" ident="5326">
          <itemmetadata>
            <qtimetadata>
              <qtimetadatafield>
                <fieldlabel>question_type</fieldlabel>
                <fieldentry>multiple_answers_question</fieldentry>
              </qtimetadatafield>
              <qtimetadatafield>
                <fieldlabel>outcome_guid</fieldlabel>
                <fieldentry>129039d4-84ae-4b3d-8593-2917acdea4e2</fieldentry>
              </qtimetadatafield>
              <qtimetadatafield>
                <fieldlabel>outcome_short_title</fieldlabel>
                <fieldentry>Crowding Out</fieldentry>
              </qtimetadatafield>
              <qtimetadatafield>
                <fieldlabel>outcome_long_title</fieldlabel>
                <fieldentry>Explain how Crowding Out weakens the effectiveness of fiscal policy</fieldentry>
              </qtimetadatafield>
            </qtimetadata>
          </itemmetadata>
        </item>
      </section>
    </section>
  </assessment>
</questestinterop>
      EOSOURCEXML

      @destination_xml = Nokogiri::HTML::DocumentFragment.parse <<-EODESTXML
<?xml version="1.0" encoding="UTF-8"?>
<questestinterop xmlns="http://www.imsglobal.org/xsd/ims_qtiasiv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/ims_qtiasiv1p2 http://www.imsglobal.org/xsd/ims_qtiasiv1p2p1.xsd">
  <assessment title="Show What You Know: Macro Workings" ident="if8390a2480634681a1608f47c0a529fe_swyk">
    <section ident="root_section">
      <section title="The Business Cycle" ident="4112">
        <item title="" ident="1998">
          <itemmetadata>
            <qtimetadata>
              <qtimetadatafield>
                <fieldlabel>question_type</fieldlabel>
                <fieldentry>multiple_answers_question</fieldentry>
              </qtimetadatafield>
              <qtimetadatafield>
                <fieldlabel>outcome_guid</fieldlabel>
                <fieldentry>6538eeef-76a6-4971-a730-356b299ded48</fieldentry>
              </qtimetadatafield>
              <qtimetadatafield>
                <fieldlabel>outcome_short_title</fieldlabel>
                <fieldentry>The Business Cycle</fieldentry>
              </qtimetadatafield>
              <qtimetadatafield>
                <fieldlabel>outcome_long_title</fieldlabel>
                <fieldentry>Describe the business cycle and its primary phases</fieldentry>
              </qtimetadatafield>
            </qtimetadata>
          </itemmetadata>
        </item>
      </section>
      <section title="Defining Economic Growth" ident="8139">
        <item title="" ident="9436">
          <itemmetadata>
            <qtimetadata>
              <qtimetadatafield>
                <fieldlabel>question_type</fieldlabel>
                <fieldentry>multiple_answers_question</fieldentry>
              </qtimetadatafield>
              <qtimetadatafield>
                <fieldlabel>outcome_guid</fieldlabel>
                <fieldentry>a9ba38f3-acc9-42bd-9567-9442d87819d7</fieldentry>
              </qtimetadatafield>
              <qtimetadatafield>
                <fieldlabel>outcome_short_title</fieldlabel>
                <fieldentry>Defining Economic Growth</fieldentry>
              </qtimetadatafield>
              <qtimetadatafield>
                <fieldlabel>outcome_long_title</fieldlabel>
                <fieldentry>Define economic growth</fieldentry>
              </qtimetadatafield>
            </qtimetadata>
          </itemmetadata>
        </item>
      </section>
      <section title="Sources of Economic Growth" ident="3150">
        <item title="" ident="7876">
          <itemmetadata>
            <qtimetadata>
              <qtimetadatafield>
                <fieldlabel>question_type</fieldlabel>
                <fieldentry>multiple_answers_question</fieldentry>
              </qtimetadatafield>
              <qtimetadatafield>
                <fieldlabel>outcome_guid</fieldlabel>
                <fieldentry>3f99debb-6b1d-4544-a147-357df2a0e997</fieldentry>
              </qtimetadatafield>
              <qtimetadatafield>
                <fieldlabel>outcome_short_title</fieldlabel>
                <fieldentry>Sources of Economic Growth</fieldentry>
              </qtimetadatafield>
              <qtimetadatafield>
                <fieldlabel>outcome_long_title</fieldlabel>
                <fieldentry>Identify the sources of economic growth</fieldentry>
              </qtimetadatafield>
            </qtimetadata>
          </itemmetadata>
        </item>
      </section>
    </section>
  </assessment>
</questestinterop>
      EODESTXML

      @source_section = @source_xml.css("section[ident='170']").first
      @destination_section = @destination_xml.css("section[ident='root_section']").first
    end

    it "should move the item from the source to the destination, if the guid is found in the item in the source" do
      AssessmentXml.move_items(@source_section, @destination_section, '65b449c6-afb8-416f-960b-8aaf69cb4ed2')
      expect(retrieve_children_elements(@source_section).length).to eq 0
      expect(retrieve_children_elements(@source_section.parent).length).to eq 3
      expect(retrieve_children_elements(@destination_section).length).to eq 4
    end

    it "should leave the two XMLs unchanged if guid is not found in the source" do
      original_source_parent = @source_section.parent
      AssessmentXml.move_items(@source_section, @destination_section, 'adfb2853-598d-48f7-8206-50edaac3a16c')
      expect(retrieve_children_elements(original_source_parent).length).to eq 3
      expect(retrieve_children_elements(@destination_section).length).to eq 3
    end
  end

end
