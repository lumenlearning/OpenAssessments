require 'rails_helper'
require 'support/nokogiri_helpers'

RSpec.configure do |config|
  config.include NokogiriHelpers
end

describe AssessmentXml do
  before do
    @xml = open('./spec/fixtures/sections_assessment.xml').read

    @business_cycle_item = <<-BCIXML
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
    BCIXML

    @standard_destination_xml = <<-EODESTXML
      <?xml version="1.0" encoding="UTF-8"?>
      <questestinterop xmlns="http://www.imsglobal.org/xsd/ims_qtiasiv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/ims_qtiasiv1p2 http://www.imsglobal.org/xsd/ims_qtiasiv1p2p1.xsd">
        <assessment title="Show What You Know: Macro Workings" ident="if8390a2480634681a1608f47c0a529fe_swyk">
          <section ident="root_section">
            <section title="The Business Cycle" ident="4112">
              #{@business_cycle_item}
            </section>
          </section>
        </assessment>
      </questestinterop>
    EODESTXML

    @liquity_trap_item = <<-LTIXML
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
    LTIXML

    @liquidity_trap_section = <<-LTSXML
      <section title="Liquidity Trap" ident="170">
        #{@liquity_trap_item}
      </section>
    LTSXML

    @expenditure_multiplier_item1 = <<-EXIXML
      <item title="" ident="1737">
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
              <fieldentry>The Expenditure Multiplier</fieldentry>
            </qtimetadatafield>
            <qtimetadatafield>
              <fieldlabel>outcome_long_title</fieldlabel>
              <fieldentry>Explain the significance of the Expenditure Multiplier</fieldentry>
            </qtimetadatafield>
          </qtimetadata>
        </itemmetadata>
      </item>
    EXIXML

    @expenditure_multiplier_item2 = <<-EXI2XML
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
    EXI2XML

    @expenditure_multiplier_section = <<-EMSXML
      <section title="The Expenditure Multiplier" ident="2902">
        #{@expenditure_multiplier_item2}
      </section>
    EMSXML

    @crowding_out_item = <<-COIXML
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
    COIXML

    @crowding_out_section = <<-COSXML
      <section title="Crowding Out" ident="5247">
        #{@crowding_out_item}
      </section>
    COSXML
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
      @source_xml = Nokogiri::XML <<-EOSOURCEXML
<?xml version="1.0" encoding="UTF-8"?>
<questestinterop xmlns="http://www.imsglobal.org/xsd/ims_qtiasiv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/ims_qtiasiv1p2 http://www.imsglobal.org/xsd/ims_qtiasiv1p2p1.xsd">
  <assessment title="Show What You Know: Policy Application" ident="ib116e1ef09a84426bab060f8d936d8b7_swyk">
    <section ident="root_section">
      #{@liquidity_trap_section}
      #{@expenditure_multiplier_section}
      #{@crowding_out_section}
    </section>
  </assessment>
</questestinterop>
      EOSOURCEXML

      @destination_xml = Nokogiri::XML <<-EODESTXML
<?xml version="1.0" encoding="UTF-8"?>
<questestinterop xmlns="http://www.imsglobal.org/xsd/ims_qtiasiv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/ims_qtiasiv1p2 http://www.imsglobal.org/xsd/ims_qtiasiv1p2p1.xsd">
  <assessment title="Show What You Know: Macro Workings" ident="if8390a2480634681a1608f47c0a529fe_swyk">
    <section ident="root_section">
      <section title="The Business Cycle" ident="4112">
        #{@business_cycle_item}
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

    it "will remove only those items in a section which match the guid" do
      two_items_source_xml = Nokogiri::XML <<-EOSOURCEXML
    <?xml version="1.0" encoding="UTF-8"?>
    <questestinterop xmlns="http://www.imsglobal.org/xsd/ims_qtiasiv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/ims_qtiasiv1p2 http://www.imsglobal.org/xsd/ims_qtiasiv1p2p1.xsd">
      <assessment title="Show What You Know: Policy Application" ident="ib116e1ef09a84426bab060f8d936d8b7_swyk">
        <section ident="root_section">
          <section title="Liquidity Trap" ident="170">
            #{@liquity_trap_item}
            #{@crowding_out_item}
          </section>
          #{@expenditure_multiplier_section}
        </section>
      </assessment>
    </questestinterop>
          EOSOURCEXML

      two_items_source_section = two_items_source_xml.css("section[ident='170']").first

      AssessmentXml.move_items(two_items_source_section, @destination_section, '65b449c6-afb8-416f-960b-8aaf69cb4ed2')
      expect(retrieve_children_elements(two_items_source_section).length).to eq 1
      expect(retrieve_children_elements(two_items_source_section.parent).length).to eq 2
      expect(retrieve_children_elements(@destination_section).length).to eq 4
    end

    it "will remove all of the items from the source section if they match on guid" do
      two_items_source_xml = Nokogiri::XML <<-EOSOURCEXML
    <?xml version="1.0" encoding="UTF-8"?>
    <questestinterop xmlns="http://www.imsglobal.org/xsd/ims_qtiasiv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/ims_qtiasiv1p2 http://www.imsglobal.org/xsd/ims_qtiasiv1p2p1.xsd">
      <assessment title="Show What You Know: Policy Application" ident="ib116e1ef09a84426bab060f8d936d8b7_swyk">
        <section ident="root_section">
          <section title="Liquidity Trap" ident="170">
            #{@liquity_trap_item}
            <item title="" ident="5326">
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
          #{@expenditure_multiplier_section}
        </section>
      </assessment>
    </questestinterop>
          EOSOURCEXML

      two_items_source_section = two_items_source_xml.css("section[ident='170']").first
      AssessmentXml.move_items(two_items_source_section, @destination_section, '65b449c6-afb8-416f-960b-8aaf69cb4ed2')
      expect(retrieve_children_elements(two_items_source_section).length).to eq 0
      expect(retrieve_children_elements(two_items_source_section.parent).length).to eq 2
      expect(retrieve_children_elements(@destination_section).length).to eq 5
    end
  end

  context "AssessmentXml.clear_empty_child_sections!" do
    it "will clear sections which are empty" do
      xml = Nokogiri::XML <<-EOXML
    <?xml version="1.0" encoding="UTF-8"?>
    <questestinterop xmlns="http://www.imsglobal.org/xsd/ims_qtiasiv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/ims_qtiasiv1p2 http://www.imsglobal.org/xsd/ims_qtiasiv1p2p1.xsd">
      <assessment title="Show What You Know: Policy Application" ident="ib116e1ef09a84426bab060f8d936d8b7_swyk">
        <section ident="root_section">
          <section title="Liquidity Trap" ident="170">
          </section>
        </section>
      </assessment>
    </questestinterop>
          EOXML
      section = xml.css("section[ident='root_section']").first
      
      AssessmentXml.clear_empty_child_sections!(xml)
      expect(retrieve_children_elements(section).length).to be 0
    end

    it "will not clear sections which have items in them" do
      xml = Nokogiri::XML <<-EOXML
    <?xml version="1.0" encoding="UTF-8"?>
    <questestinterop xmlns="http://www.imsglobal.org/xsd/ims_qtiasiv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/ims_qtiasiv1p2 http://www.imsglobal.org/xsd/ims_qtiasiv1p2p1.xsd">
      <assessment title="Show What You Know: Policy Application" ident="ib116e1ef09a84426bab060f8d936d8b7_swyk">
        <section ident="root_section">
          #{@liquidity_trap_section}
        </section>
      </assessment>
    </questestinterop>
          EOXML
      section = xml.css("section[ident='root_section']").first

      AssessmentXml.clear_empty_child_sections!(xml)
      expect(retrieve_children_elements(section).length).to be 1
    end
  end

  context "AssessmentXml.root_section_contains_child_sections?" do
    it "will return true if the root section has child sections" do
      xml = Nokogiri::XML <<-EOXML
    <?xml version="1.0" encoding="UTF-8"?>
    <questestinterop xmlns="http://www.imsglobal.org/xsd/ims_qtiasiv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/ims_qtiasiv1p2 http://www.imsglobal.org/xsd/ims_qtiasiv1p2p1.xsd">
      <assessment title="Show What You Know: Policy Application" ident="ib116e1ef09a84426bab060f8d936d8b7_swyk">
        <section ident="root_section">
          #{@liquidity_trap_section}
        </section>
      </assessment>
    </questestinterop>
          EOXML
      expect(AssessmentXml.root_section_contains_child_sections?(xml)).to be_truthy
    end

    it "will return false if the root section does not have child sections" do
      xml = Nokogiri::XML <<-EOXML
    <?xml version="1.0" encoding="UTF-8"?>
    <questestinterop xmlns="http://www.imsglobal.org/xsd/ims_qtiasiv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/ims_qtiasiv1p2 http://www.imsglobal.org/xsd/ims_qtiasiv1p2p1.xsd">
      <assessment title="Show What You Know: Policy Application" ident="ib116e1ef09a84426bab060f8d936d8b7_swyk">
        <section ident="root_section">
          #{@liquity_trap_item}
        </section>
      </assessment>
    </questestinterop>
          EOXML
      expect(AssessmentXml.root_section_contains_child_sections?(xml)).to be_falsy
    end
  end

  context "AssessmentXml.create_mirror_section!" do
    it "will create a mirror section" do
      source_xml = Nokogiri::XML <<-EOSOURCEXML
<?xml version="1.0" encoding="UTF-8"?>
<questestinterop xmlns="http://www.imsglobal.org/xsd/ims_qtiasiv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/ims_qtiasiv1p2 http://www.imsglobal.org/xsd/ims_qtiasiv1p2p1.xsd">
  <assessment title="Show What You Know: Policy Application" ident="ib116e1ef09a84426bab060f8d936d8b7_swyk">
    <section ident="root_section">
      <section ident="170">
        #{@liquity_trap_item}
      </section>
    </section>
  </assessment>
</questestinterop>
      EOSOURCEXML

      destination_xml = Nokogiri::XML @standard_destination_xml

      source_section = source_xml.css("section[ident='170']").first
      destination_section = destination_xml.css("section[ident='root_section']").first

      mirror_section = AssessmentXml.create_mirror_section!(source_xml, source_section, destination_section, "65b449c6-afb8-416f-960b-8aaf69cb4ed2", "6538eeef-76a6-4971-a730-356b299ded48")
      expect(retrieve_children_elements(source_section).length).to be 1
      expect(retrieve_children_elements(source_section.parent).length).to be 1
      expect(retrieve_children_elements(destination_section).length).to be 2
      expect(mirror_section).not_to be_nil
      expect(mirror_section['ident']).to eq "170"
    end

    it "will add ident and title to mirror section element if source element contains them" do
      source_xml = Nokogiri::XML <<-EOSOURCEXML
<?xml version="1.0" encoding="UTF-8"?>
<questestinterop xmlns="http://www.imsglobal.org/xsd/ims_qtiasiv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/ims_qtiasiv1p2 http://www.imsglobal.org/xsd/ims_qtiasiv1p2p1.xsd">
  <assessment title="Show What You Know: Policy Application" ident="ib116e1ef09a84426bab060f8d936d8b7_swyk">
    <section ident="root_section">
      #{@liquidity_trap_section}
    </section>
  </assessment>
</questestinterop>
      EOSOURCEXML

      destination_xml = Nokogiri::XML @standard_destination_xml

      source_section = source_xml.css("section[ident='170']").first
      destination_section = destination_xml.css("section[ident='root_section']").first

      mirror_section = AssessmentXml.create_mirror_section!(source_xml, source_section, destination_section, "65b449c6-afb8-416f-960b-8aaf69cb4ed2", "6538eeef-76a6-4971-a730-356b299ded48")
      expect(retrieve_children_elements(destination_section).last['ident']).to eq "170"
      expect(retrieve_children_elements(destination_section).last['title']).to eq "Liquidity Trap"
      expect(mirror_section).not_to be_nil
      expect(mirror_section['ident']).to eq "170"
      expect(mirror_section['title']).to eq "Liquidity Trap"
    end

    it "will give mirror section a new name if copying from source root section" do
      source_xml = Nokogiri::XML <<-EOSOURCEXML
<?xml version="1.0" encoding="UTF-8"?>
<questestinterop xmlns="http://www.imsglobal.org/xsd/ims_qtiasiv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/ims_qtiasiv1p2 http://www.imsglobal.org/xsd/ims_qtiasiv1p2p1.xsd">
  <assessment title="Show What You Know: Policy Application" ident="ib116e1ef09a84426bab060f8d936d8b7_swyk">
    <section ident="root_section">
      #{@liquity_trap_item}
    </section>
  </assessment>
</questestinterop>
      EOSOURCEXML

      destination_xml = Nokogiri::XML @standard_destination_xml

      source_section = source_xml.css("section[ident='root_section']").first
      destination_section = destination_xml.css("section[ident='root_section']").first

      mirror_section = AssessmentXml.create_mirror_section!(source_xml, source_section, destination_section, "65b449c6-afb8-416f-960b-8aaf69cb4ed2", "6538eeef-76a6-4971-a730-356b299ded48")
      expect(retrieve_children_elements(destination_section).last['ident']).to eq "copy_for_65b449c6-afb8-416f-960b-8aaf69cb4ed2"
      expect(mirror_section).not_to be_nil
      expect(mirror_section['ident']).to eq "copy_for_65b449c6-afb8-416f-960b-8aaf69cb4ed2"
    end

    it "will put the mirror section after the first section containing the after_guid" do
      source_xml = Nokogiri::XML <<-EOSOURCEXML
        <?xml version="1.0" encoding="UTF-8"?>
        <questestinterop xmlns="http://www.imsglobal.org/xsd/ims_qtiasiv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/ims_qtiasiv1p2 http://www.imsglobal.org/xsd/ims_qtiasiv1p2p1.xsd">
          <assessment title="Show What You Know: Policy Application" ident="ib116e1ef09a84426bab060f8d936d8b7_swyk">
            <section ident="root_section">
              #{@liquidity_trap_section}
            </section>
          </assessment>
        </questestinterop>
      EOSOURCEXML

      destination_xml = Nokogiri::XML @standard_destination_xml

      source_section = source_xml.css("section[ident='170']").first
      destination_section = destination_xml.css("section[ident='root_section']").first

      mirror_section = AssessmentXml.create_mirror_section!(source_xml,
        source_section,
        destination_section,
        "65b449c6-afb8-416f-960b-8aaf69cb4ed2",
        "6538eeef-76a6-4971-a730-356b299ded48")
      expect(retrieve_children_elements(destination_section).last['ident']).to eq "170"
      expect(retrieve_children_elements(destination_section).last['title']).to eq "Liquidity Trap"
      expect(mirror_section).not_to be_nil
      expect(mirror_section['ident']).to eq "170"
      expect(mirror_section['title']).to eq "Liquidity Trap"
    end

    it "will put the mirror section first if after_guid is nil" do
      source_xml = Nokogiri::XML <<-EOSOURCEXML
        <?xml version="1.0" encoding="UTF-8"?>
        <questestinterop xmlns="http://www.imsglobal.org/xsd/ims_qtiasiv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/ims_qtiasiv1p2 http://www.imsglobal.org/xsd/ims_qtiasiv1p2p1.xsd">
          <assessment title="Show What You Know: Policy Application" ident="ib116e1ef09a84426bab060f8d936d8b7_swyk">
            <section ident="root_section">
              #{@liquidity_trap_section}
            </section>
          </assessment>
        </questestinterop>
      EOSOURCEXML

      destination_xml = Nokogiri::XML @standard_destination_xml

      source_section = source_xml.css("section[ident='170']").first
      destination_section = destination_xml.css("section[ident='root_section']").first

      mirror_section = AssessmentXml.create_mirror_section!(source_xml,
        source_section,
        destination_section,
        "65b449c6-afb8-416f-960b-8aaf69cb4ed2",
        nil)
      expect(retrieve_children_elements(destination_section).first['ident']).to eq "170"
      expect(retrieve_children_elements(destination_section).first['title']).to eq "Liquidity Trap"
      expect(mirror_section).not_to be_nil
      expect(mirror_section['ident']).to eq "170"
      expect(mirror_section['title']).to eq "Liquidity Trap"
    end
  end

  context "AssessmentXml.root_section" do
    it "finds a section for the root section" do
      xml = Nokogiri::XML @standard_destination_xml

      section = AssessmentXml.root_section(xml)
      expect(section).not_to be_nil
      expect(section['ident']).to eq "root_section"
    end
  end

  context "AssessmentXml.move_questions_from_source_section!" do
    it "moves questions from source section into mirror section in destination if destination root has sections" do
      source_xml = Nokogiri::XML <<-EOSOURCEXML
<?xml version="1.0" encoding="UTF-8"?>
<questestinterop xmlns="http://www.imsglobal.org/xsd/ims_qtiasiv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/ims_qtiasiv1p2 http://www.imsglobal.org/xsd/ims_qtiasiv1p2p1.xsd">
  <assessment title="Show What You Know: Policy Application" ident="ib116e1ef09a84426bab060f8d936d8b7_swyk">
    <section ident="root_section">
      #{@liquidity_trap_section}
    </section>
  </assessment>
</questestinterop>
      EOSOURCEXML

      destination_xml = Nokogiri::XML @standard_destination_xml

      source_section = source_xml.css("section[ident='170']").first
      AssessmentXml.move_questions_from_source_section!(source_xml, source_section, destination_xml, "65b449c6-afb8-416f-960b-8aaf69cb4ed2", "6538eeef-76a6-4971-a730-356b299ded48")
      expect(retrieve_children_elements(source_section).length).to eq 0
      expect(retrieve_children_elements(source_section.parent).length).to eq 1
      destination_root_section = AssessmentXml.root_section(destination_xml)
      expect(retrieve_children_elements(destination_root_section).length).to eq 2
      expect(retrieve_children_elements(retrieve_children_elements(destination_root_section).last).length).to eq 1
    end

    it "moves questions from source section into destination root section if destination root does not have child sections" do
      source_xml = Nokogiri::XML <<-EOSOURCEXML
<?xml version="1.0" encoding="UTF-8"?>
<questestinterop xmlns="http://www.imsglobal.org/xsd/ims_qtiasiv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/ims_qtiasiv1p2 http://www.imsglobal.org/xsd/ims_qtiasiv1p2p1.xsd">
  <assessment title="Show What You Know: Policy Application" ident="ib116e1ef09a84426bab060f8d936d8b7_swyk">
    <section ident="root_section">
      #{@liquidity_trap_section}
    </section>
  </assessment>
</questestinterop>
      EOSOURCEXML

      destination_xml = Nokogiri::XML <<-EODESTXML
<?xml version="1.0" encoding="UTF-8"?>
<questestinterop xmlns="http://www.imsglobal.org/xsd/ims_qtiasiv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/ims_qtiasiv1p2 http://www.imsglobal.org/xsd/ims_qtiasiv1p2p1.xsd">
  <assessment title="Show What You Know: Macro Workings" ident="if8390a2480634681a1608f47c0a529fe_swyk">
    <section ident="root_section">
      #{@business_cycle_item}
    </section>
  </assessment>
</questestinterop>
      EODESTXML

      source_section = source_xml.css("section[ident='170']").first
      AssessmentXml.move_questions_from_source_section!(source_xml, source_section, destination_xml, "65b449c6-afb8-416f-960b-8aaf69cb4ed2", "6538eeef-76a6-4971-a730-356b299ded48")
      expect(retrieve_children_elements(source_section).length).to eq 0
      expect(retrieve_children_elements(source_section.parent).length).to eq 1
      destination_root_section = AssessmentXml.root_section(destination_xml)
      expect(retrieve_children_elements(destination_root_section).length).to eq 2
    end

    it "does not move any questions if no guid matches" do
      source_xml = Nokogiri::XML <<-EOSOURCEXML
<?xml version="1.0" encoding="UTF-8"?>
<questestinterop xmlns="http://www.imsglobal.org/xsd/ims_qtiasiv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/ims_qtiasiv1p2 http://www.imsglobal.org/xsd/ims_qtiasiv1p2p1.xsd">
  <assessment title="Show What You Know: Policy Application" ident="ib116e1ef09a84426bab060f8d936d8b7_swyk">
    <section ident="root_section">
      #{@liquidity_trap_section}
    </section>
  </assessment>
</questestinterop>
      EOSOURCEXML

      destination_xml = Nokogiri::XML @standard_destination_xml

      source_section = source_xml.css("section[ident='170']").first
      AssessmentXml.move_questions_from_source_section!(source_xml, source_section, destination_xml, "6538eeef-76a6-4971-a730-356b299ded48", nil)
      expect(retrieve_children_elements(source_section.parent).length).to eq 1
      expect(retrieve_children_elements(source_section).length).to eq 1
      destination_root_section = AssessmentXml.root_section(destination_xml)
      expect(retrieve_children_elements(destination_root_section).length).to eq 1
      expect(retrieve_children_elements(retrieve_children_elements(destination_root_section).first).length).to eq 1
    end
  end

  context "AssessmentXml.move_questions_to_different_section_for_guid" do
    it "should move items for every section which has an item with a matching guid" do
      source_xml = <<-EOSOURCEXML
<?xml version="1.0" encoding="UTF-8"?>
<questestinterop xmlns="http://www.imsglobal.org/xsd/ims_qtiasiv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/ims_qtiasiv1p2 http://www.imsglobal.org/xsd/ims_qtiasiv1p2p1.xsd">
  <assessment title="Show What You Know: Policy Application" ident="ib116e1ef09a84426bab060f8d936d8b7_swyk">
    <section ident="root_section">
      <section title="Liquidity Trap" ident="170">
        #{@liquity_trap_item}
        #{@crowding_out_item}
      </section>
      <section title="The Expenditure Multiplier" ident="2902">
        #{@expenditure_multiplier_item1}
        #{@crowding_out_item}
      </section>
      #{@crowding_out_section}
    </section>
  </assessment>
</questestinterop>
      EOSOURCEXML

      updated_source_xml, updated_destination_xml =
        AssessmentXml.move_questions_to_different_section_for_guid(source_xml,
          @standard_destination_xml,
          "65b449c6-afb8-416f-960b-8aaf69cb4ed2",
          "6538eeef-76a6-4971-a730-356b299ded48")
      source_root = AssessmentXml.root_section(Nokogiri::XML(updated_source_xml))
      expect(retrieve_children_elements(source_root).length).to eq 3
      expect(retrieve_children_elements(retrieve_children_elements(source_root)[0]).length).to eq 1
      expect(retrieve_children_elements(retrieve_children_elements(source_root)[1]).length).to eq 1
      expect(retrieve_children_elements(retrieve_children_elements(source_root)[2]).length).to eq 1
      destination_root = AssessmentXml.root_section(Nokogiri::XML(updated_destination_xml))
      expect(retrieve_children_elements(destination_root).length).to eq 3
      expect(retrieve_children_elements(retrieve_children_elements(destination_root)[0]).length).to eq 1
      # verify that no namespace exists on item elements
      expect(retrieve_children_elements(retrieve_children_elements(destination_root)[0])[0].name).to eq "item"
      expect(retrieve_children_elements(retrieve_children_elements(destination_root)[1]).length).to eq 1
      expect(retrieve_children_elements(retrieve_children_elements(destination_root)[1])[0].name).to eq "item"
      expect(retrieve_children_elements(retrieve_children_elements(destination_root)[2]).length).to eq 1
      expect(retrieve_children_elements(retrieve_children_elements(destination_root)[2])[0].name).to eq "item"
    end

    it "should clear out sections if a child section has all items removed" do
      source_xml = <<-EOSOURCEXML
<?xml version="1.0" encoding="UTF-8"?>
<questestinterop xmlns="http://www.imsglobal.org/xsd/ims_qtiasiv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/ims_qtiasiv1p2 http://www.imsglobal.org/xsd/ims_qtiasiv1p2p1.xsd">
  <assessment title="Show What You Know: Policy Application" ident="ib116e1ef09a84426bab060f8d936d8b7_swyk">
    <section ident="root_section">
      <section title="Liquidity Trap" ident="170">
        #{@liquity_trap_item}
        <item title="" ident="5326">
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
      #{@crowding_out_section}
    </section>
  </assessment>
</questestinterop>
      EOSOURCEXML

      updated_source_xml, updated_destination_xml =
        AssessmentXml.move_questions_to_different_section_for_guid(source_xml, @standard_destination_xml, "65b449c6-afb8-416f-960b-8aaf69cb4ed2", nil)
      source_root = AssessmentXml.root_section(Nokogiri::XML(updated_source_xml))
      expect(retrieve_children_elements(source_root).length).to eq 1
      expect(retrieve_children_elements(retrieve_children_elements(source_root)[0]).length).to eq 1
      destination_root = AssessmentXml.root_section(Nokogiri::XML(updated_destination_xml))
      expect(retrieve_children_elements(destination_root).length).to eq 2
      expect(retrieve_children_elements(retrieve_children_elements(destination_root)[0]).length).to eq 2
      expect(retrieve_children_elements(retrieve_children_elements(destination_root)[1]).length).to eq 1
    end

    it "should move items from root section if no child sections exist" do
      source_xml = <<-EOSOURCEXML
<?xml version="1.0" encoding="UTF-8"?>
<questestinterop xmlns="http://www.imsglobal.org/xsd/ims_qtiasiv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/ims_qtiasiv1p2 http://www.imsglobal.org/xsd/ims_qtiasiv1p2p1.xsd">
  <assessment title="Show What You Know: Policy Application" ident="ib116e1ef09a84426bab060f8d936d8b7_swyk">
    <section ident="root_section">
      #{@liquity_trap_item}
      #{@expenditure_multiplier_item1}
      #{@crowding_out_item}
    </section>
  </assessment>
</questestinterop>
      EOSOURCEXML

      updated_source_xml, updated_destination_xml =
        AssessmentXml.move_questions_to_different_section_for_guid(source_xml,
          @standard_destination_xml,
          "65b449c6-afb8-416f-960b-8aaf69cb4ed2",
          "6538eeef-76a6-4971-a730-356b299ded48")
      source_root = AssessmentXml.root_section(Nokogiri::XML(updated_source_xml))
      expect(retrieve_children_elements(source_root).length).to eq 1
      expect(retrieve_children_elements(source_root)[0].node_name).to eq "item"
      destination_root = AssessmentXml.root_section(Nokogiri::XML(updated_destination_xml))
      expect(retrieve_children_elements(destination_root).length).to eq 2
      expect(retrieve_children_elements(retrieve_children_elements(destination_root)[0]).length).to eq 1
      expect(retrieve_children_elements(retrieve_children_elements(destination_root)[1]).length).to eq 2
    end

    it "should never remove root section, even if no items or sections are left in it" do
      source_xml = <<-EOSOURCEXML
<?xml version="1.0" encoding="UTF-8"?>
<questestinterop xmlns="http://www.imsglobal.org/xsd/ims_qtiasiv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/ims_qtiasiv1p2 http://www.imsglobal.org/xsd/ims_qtiasiv1p2p1.xsd">
  <assessment title="Show What You Know: Policy Application" ident="ib116e1ef09a84426bab060f8d936d8b7_swyk">
    <section ident="root_section">
      #{@liquity_trap_item}
      #{@expenditure_multiplier_item1}
    </section>
  </assessment>
</questestinterop>
      EOSOURCEXML

      updated_source_xml, updated_destination_xml =
        AssessmentXml.move_questions_to_different_section_for_guid(source_xml,
          @standard_destination_xml,
          "65b449c6-afb8-416f-960b-8aaf69cb4ed2",
          "6538eeef-76a6-4971-a730-356b299ded48")
      source_root = AssessmentXml.root_section(Nokogiri::XML(updated_source_xml))
      expect(source_root).not_to be_nil
      expect(retrieve_children_elements(source_root).length).to eq 0
      destination_root = AssessmentXml.root_section(Nokogiri::XML(updated_destination_xml))
      expect(retrieve_children_elements(destination_root).length).to eq 2
      expect(retrieve_children_elements(retrieve_children_elements(destination_root)[0]).length).to eq 1
      expect(retrieve_children_elements(retrieve_children_elements(destination_root)[1]).length).to eq 2
    end
  end

  context "AssessmentXml.move_questions_within_same_section_for_guid" do
    it "should move a section to after the section with the child guid" do
      xml = <<-EOSOURCEXML
        <?xml version="1.0" encoding="UTF-8"?>
        <questestinterop xmlns="http://www.imsglobal.org/xsd/ims_qtiasiv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/ims_qtiasiv1p2 http://www.imsglobal.org/xsd/ims_qtiasiv1p2p1.xsd">
          <assessment title="Show What You Know: Policy Application" ident="ib116e1ef09a84426bab060f8d936d8b7_swyk">
            <section ident="root_section">
              #{@liquidity_trap_section}
              #{@crowding_out_section}
              #{@expenditure_multiplier_section}
            </section>
          </assessment>
        </questestinterop>
      EOSOURCEXML

      updated_xml = AssessmentXml.move_questions_within_same_section_for_guid(
        xml,
        "65b449c6-afb8-416f-960b-8aaf69cb4ed2",
        "129039d4-84ae-4b3d-8593-2917acdea4e2")
      root = AssessmentXml.root_section(Nokogiri::XML(updated_xml))
      expect(root).not_to be_nil
      expect(retrieve_children_elements(root).length).to eq 3
      expect(retrieve_children_elements(root)[0]['ident']).to eq "5247"
      expect(retrieve_children_elements(root)[1]['ident']).to eq "170"
      expect(retrieve_children_elements(root)[2]['ident']).to eq "2902"
    end

    it "should move a section to the first child of root section if after guid is nil" do
      xml = <<-EOSOURCEXML
        <?xml version="1.0" encoding="UTF-8"?>
        <questestinterop xmlns="http://www.imsglobal.org/xsd/ims_qtiasiv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/ims_qtiasiv1p2 http://www.imsglobal.org/xsd/ims_qtiasiv1p2p1.xsd">
          <assessment title="Show What You Know: Policy Application" ident="ib116e1ef09a84426bab060f8d936d8b7_swyk">
            <section ident="root_section">
              #{@liquidity_trap_section}
              #{@expenditure_multiplier_section}
              #{@crowding_out_section}
            </section>
          </assessment>
        </questestinterop>
      EOSOURCEXML

      updated_xml = AssessmentXml.move_questions_within_same_section_for_guid(
        xml,
        "129039d4-84ae-4b3d-8593-2917acdea4e2",
        nil)
      root = AssessmentXml.root_section(Nokogiri::XML(updated_xml))
      expect(root).not_to be_nil
      expect(retrieve_children_elements(root).length).to eq 3
      expect(retrieve_children_elements(root)[0]['ident']).to eq "5247"
      expect(retrieve_children_elements(root)[1]['ident']).to eq "170"
      expect(retrieve_children_elements(root)[2]['ident']).to eq "2902"
    end

    it "should move a section to the first child of root section if section matching after guid cannot be found" do
      xml = <<-EOSOURCEXML
        <?xml version="1.0" encoding="UTF-8"?>
        <questestinterop xmlns="http://www.imsglobal.org/xsd/ims_qtiasiv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/ims_qtiasiv1p2 http://www.imsglobal.org/xsd/ims_qtiasiv1p2p1.xsd">
          <assessment title="Show What You Know: Policy Application" ident="ib116e1ef09a84426bab060f8d936d8b7_swyk">
            <section ident="root_section">
              #{@liquidity_trap_section}
              #{@expenditure_multiplier_section}
              #{@crowding_out_section}
            </section>
          </assessment>
        </questestinterop>
      EOSOURCEXML

      updated_xml = AssessmentXml.move_questions_within_same_section_for_guid(
        xml,
        "129039d4-84ae-4b3d-8593-2917acdea4e2",
        "44444444-4444-4444-4444-44444444a4e4")
      root = AssessmentXml.root_section(Nokogiri::XML(updated_xml))
      expect(root).not_to be_nil
      expect(retrieve_children_elements(root).length).to eq 3
      expect(retrieve_children_elements(root)[0]['ident']).to eq "5247"
      expect(retrieve_children_elements(root)[1]['ident']).to eq "170"
      expect(retrieve_children_elements(root)[2]['ident']).to eq "2902"
    end

    it "should leave quiz unchanged if moving section cannot be found" do
      xml = <<-EOSOURCEXML
        <?xml version="1.0" encoding="UTF-8"?>
        <questestinterop xmlns="http://www.imsglobal.org/xsd/ims_qtiasiv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/ims_qtiasiv1p2 http://www.imsglobal.org/xsd/ims_qtiasiv1p2p1.xsd">
          <assessment title="Show What You Know: Policy Application" ident="ib116e1ef09a84426bab060f8d936d8b7_swyk">
            <section ident="root_section">
              #{@liquidity_trap_section}
              #{@expenditure_multiplier_section}
              #{@crowding_out_section}
            </section>
          </assessment>
        </questestinterop>
      EOSOURCEXML

      updated_xml = AssessmentXml.move_questions_within_same_section_for_guid(
        xml,
        "44444444-4444-4444-4444-44444444a4e4",
        "129039d4-84ae-4b3d-8593-2917acdea4e2")
      root = AssessmentXml.root_section(Nokogiri::XML(updated_xml))
      expect(root).not_to be_nil
      expect(retrieve_children_elements(root).length).to eq 3
      expect(retrieve_children_elements(root)[0]['ident']).to eq "170"
      expect(retrieve_children_elements(root)[1]['ident']).to eq "2902"
      expect(retrieve_children_elements(root)[2]['ident']).to eq "5247"
    end
  end
end
