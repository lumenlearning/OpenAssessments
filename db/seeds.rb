admin = CreateAdminService.new.call
puts 'CREATED ADMIN USER: ' << admin.email

# Setup default accounts
if Rails.env.production?
  accounts = [{
    code: 'openassessments',
    name: 'Open Assessments',
    domain: 'http://www.openassessments.com',
    lti_key: 'openassessments',
    lti_secret: '588a0bd03a8fe1c298b667549559334c2aa84a549406457fff37c585039c3d4d717ff2f3fa387da1ba2cb92192630d0003b6a9aace819c40322cd3f4864e0dce',
    canvas_uri: 'https://canvas.instructure.com'
  }]
else
  accounts = [{
    code: 'openassessmentsdev',
    name: 'Open Assessments Dev',
    domain: 'http://openassessments.ngrok.com',
    lti_key: 'openassessments',
    lti_secret: '0b92c73ea0a8c3bae738317e1777d20bec01662862f67b48a1f626e5d07b10c35fc8daedc4fc6269d6592185fce05320ecc53a999e97e214f2f306ed04135f13',
    canvas_uri: 'https://canvas.instructure.com'
  }]
end

# Setup accounts
accounts.each do |account|
  if a = Account.find_by(code: account[:code])
    a.update_attributes!(account)
  else
    Account.create!(account)
  end
end


# Load QTI files
Dir.glob("db/qti/*") do |f|
  puts "****************************************************************"
  puts "Adding QTI file #{f}"
  puts "****************************************************************"
  xml_file = File.open(f, "rb").read
  Assessment.from_xml(xml_file, admin, nil, nil, f)
end

if assessment = Assessment.find_by(title: 'drupal.xml')
  assessment.recommended_height = 960
  assessment.save!
end