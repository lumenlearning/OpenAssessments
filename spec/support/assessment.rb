def create_assessment(assessment_options = {})
  assessment = FactoryGirl.create(:assessment, assessment_params(assessment_options))
end

def build_assessment(assessment_options = {})
  assessment = FactoryGirl.build(:assessment, assessment_params(assessment_options))
end

def assessment_params(assessment_options = {})
  file = File.join(__dir__, '../fixtures/assessment.xml')
  xml = open(file).read
  user = FactoryGirl.create(:user)
  {
    xml_file: xml, 
    user: user
  }.merge(assessment_options)
end