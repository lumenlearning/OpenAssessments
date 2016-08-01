class AssessmentXml < ActiveRecord::Base
  belongs_to :assessment

  store_accessor :data, :section_count, :item_count

  scope :by_newest, -> { order(created_at: :desc) }
  scope :summative, -> { where(kind: 'summative') }
  scope :formative, -> { where(kind: 'formative') }
  scope :qti, -> { where(kind: 'qti') }

  def self.by_kind(kind)
    where(kind: kind)
  end

  def xml_with_limited_questions(per_section, selected_item_ids=nil)
    AssessmentXml.xml_with_limited_questions(self.xml, per_section, selected_item_ids)
  end

  def no_answer_xml_with_limited_questions(per_section, selected_item_ids=nil)
    AssessmentXml.xml_with_limited_questions(self.no_answer_xml, per_section, selected_item_ids)
  end

  def self.xml_with_limited_questions(xml, per_section, selected_item_ids=nil)
    node = Nokogiri::XML(xml)

    if node.css('section section').any?
      node.css('section section').each do |s|
        while s.css('item').count > per_section
          s.css('item')[rand(s.css('item').count)].remove
        end
      end
    else
      node.css('section').each do |s|
        while s.css('item').count > per_section
          s.css('item')[rand(s.css('item').count)].remove
        end
      end
    end

    if selected_item_ids
      node.css('item').each do |item|
        selected_item_ids << item['ident']
      end
    end

    node.to_xml
  end

end
