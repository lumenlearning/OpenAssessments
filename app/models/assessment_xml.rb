class AssessmentXml < ActiveRecord::Base
  belongs_to :assessment

  scope :by_newest, -> { order(created_at: :desc) }
  scope :summative, -> { where(kind: 'summative') }
  scope :formative, -> { where(kind: 'formative') }

  attr_reader :last_selected_item_ids

  def self.by_kind(kind)
    where(kind: kind)
  end

  def xml_with_limited_questions(per_section)
    node = Nokogiri::XML(self.xml)

    node.css('section section').each do |s|
      while s.css('item').count > per_section
        s.css('item')[rand(s.css('item').count)].remove
      end
    end

    @last_selected_item_ids = []
    node.css('item').each do |item|
      @last_selected_item_ids << item['ident']
    end

    node.to_xml
  end

end
