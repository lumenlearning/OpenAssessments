class AssessmentXml < ActiveRecord::Base
  belongs_to :assessment

  scope :by_newest, -> { order(created_at: :desc) }

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

    node.to_xml
  end

end
