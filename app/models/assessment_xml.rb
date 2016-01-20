class AssessmentXml < ActiveRecord::Base
  belongs_to :assessment

  scope :by_newest, -> { order(created_at: :desc) }
  scope :summative, -> { where(kind: 'summative') }
  scope :formative, -> { where(kind: 'formative') }

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

  def xml_with_specific_items(assessment_result)
   question_ids = assessment_result.answered_question_ids

  node = Nokogiri::XML(self.xml)

   node.css('item').each do |i|
     if !question_ids.member?(i['ident'])
       i.remove
     end
   end
   node.to_xml
 end
end
