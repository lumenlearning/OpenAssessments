module MigrationHelpers
  module AssessmentXmlUpdater

    # Copy the #xml from formative xmls into #no_answer_xml of new combined model
    # This should be safe since it doesn't change the "kind"
    def self.copy_no_answer_into_formative
      AssessmentXml.formative.each do |formative|
        if summative = AssessmentXml.summative.where(assessment_id: formative.assessment_id).first
          formative.no_answer_xml = summative.xml
          formative.save!
        else
          puts "no summative pair foound for formative #{formative.id} and assessment #{formative.assessment_id}"
        end
      end
    end


    # Assign all formative XMLs to current_assessment_xml on their Assessments
    # but only if they have a no_answer_xml value
    def self.assign_formative_xml_to_assessment
      AssessmentXml.formative.where('no_answer_xml IS NOT NULL').each do |formative|
        if assessment = formative.assessment
          assessment.current_assessment_xml_id ||= formative.id
          assessment.save! if assessment.changed?
        end
      end
    end


    def self.update_section_and_item_counts
    end

    def self.update_kind_values
    end

  end
end