module Json2Qti
  def self.convert_to_qti(json, opts={})
    j2q = Json2Qti::Converter.new(json, opts)
    j2q.convert_to_qti
  end

  def self.white_list_sanitize_html(html)
    white_list_sanitizer = Rails::Html::WhiteListSanitizer.new
    sanitized = white_list_sanitizer.sanitize(html, tags: %w(a abbr acronym address area audio b bdo big blockquote br button caption center cite code col colgroup dd del dfn dir div dl dt em figure figcaption font form h1 h2 h3 h4 h5 h6 h7 h8 hr i iframe img input ins kbd label legend li map menu ol optgroup option p param pre q s samp select small source span strike strong sub sup table tbody td textarea tfoot th thead tr track tt u ul var video), attributes: %w(src style href))
    sanitized
  end

end

require 'json2qti/converter'
require 'json2qti/question'
require 'json2qti/multiple_choice'
require 'json2qti/multiple_select'

# ones I question:  embed ins video track audio
