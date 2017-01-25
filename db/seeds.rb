admin = CreateAdminService.new.call
puts 'CREATED ADMIN USER: ' << admin.email

# Setup default accounts
canvas_uri = ENV["APP_DEFAULT_CANVAS_URL"] || 'https://canvas.instructure.com'

if Rails.env.production?
  canvas_uri ||= 'https://canvas.instructure.com'
else
  canvas_uri ||= 'https://atomicjolt.instructure.com'
end

# Ensure there are no trailing dots on domain names. See secrets.yml, "application_url" property.
app_subdomain = ENV['APP_SUBDOMAIN']
app_url = ENV['APP_URL']

if app_subdomain.nil? || app_subdomain.empty?
  first_account_domain = 'lvh.me'
elsif app_url.nil? || app_url.empty?
  first_account_domain = app_subdomain
else
  first_account_domain = app_subdomain + '.' + app_url
end

accounts = [{
  code: ENV["APP_SUBDOMAIN"],
  name: Rails.application.secrets.application_name,
  domain: first_account_domain,
  lti_key: ENV["APP_SUBDOMAIN"],
  canvas_uri: canvas_uri
}]


# Setup accounts
accounts.each do |account|
  if a = Account.find_by(code: account[:code])
    a.update_attributes!(account)
  else
    a = Account.create!(account)
  end
end

account = Account.find_by(code: ENV["APP_SUBDOMAIN"])

# Load QTI files
Dir.glob("db/qti/*") do |f|
  puts "****************************************************************"
  puts "Adding QTI file #{f}"
  puts "****************************************************************"
  xml_file = File.open(f, "rb").read
  if assessment = Assessment.find_by(title: f)
    assessment.title = f
    assessment.xml_file = xml_file
    assessment.user = admin
    assessment.account_id = account.id
    assessment.kind = "formative"
    assessment.save!
  else
    Assessment.create!(
      title: f,
      xml_file: xml_file,
      user: admin,
      kind: "formative",
      account_id: account.id
    )
  end
end

if assessment = Assessment.find_by(title: 'drupal.xml')
  assessment.recommended_height = 960
  assessment.save!
end
