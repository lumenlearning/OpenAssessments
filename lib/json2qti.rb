module Json2Qti
  def self.convert_to_qti(json, opts={})
    j2q = Json2Qti::Converter.new(json, opts)
    j2q.convert_to_qti
  end
end

require 'json2qti/converter'
require 'json2qti/question'
require 'json2qti/essay'
require 'json2qti/multiple_choice'
require 'json2qti/multiple_dropdowns'
require 'json2qti/multiple_select'
require 'json2qti/ohm_embed'
