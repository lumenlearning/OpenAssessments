module Json2Qti
  def self.convert_to_qti(json, opts={})
    j2q = Json2Qti::Converter.new(json, opts)
    j2q.convert_to_qti
  end
  def self.sanitize_html(html)
    full_sanitizer = Rails::Html::FullSanitizer.new
    sanitized = full_sanitizer.sanitize(html)
    sanitized
  end
end

require 'json2qti/converter'
require 'json2qti/question'
require 'json2qti/multiple_choice'
require 'json2qti/multiple_select'


# full_sanitizer = Rails::Html::FullSanitizer.new
# their use:  full_sanitizer.sanitize("<b>Bold</b> no more!  <a href='more.html'>See more here</a>...")

# @material = Json2Qti.sanitize(item["material"])
# @answers = item["answers"].map{|a| a["material"] = Json2Qti.sanitize(a["material"]
