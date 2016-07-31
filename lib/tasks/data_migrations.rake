require 'migration_helpers/assessment_xml_updater'

namespace :data_migrations do

  desc "Copy the #xml from formative xmls into #no_answer_xml of new combined model"
  task copy_no_answer_xmls_into_formative: :environment do
    puts "Copying formative xml into formative"

    MigrationHelpers::AssessmentXmlUpdater.copy_no_answer_into_formative

    puts "All done now!"
  end

  desc "Assign all formative XMLs to current_assessment_xml on their Assessments"
  task assign_formative_xml_to_assessment: :environment do
    puts "Assigning formative"

    MigrationHelpers::AssessmentXmlUpdater.assign_formative_xml_to_assessment

    puts "All done now!"
  end
end
