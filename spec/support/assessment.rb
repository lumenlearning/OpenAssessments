def make_assessment
  file = File.join(__dir__, '../fixtures/assessment.xml')
  xml = open(file).read
  user = FactoryGirl.create(:user)
  Assessment.from_xml(xml, user)
end