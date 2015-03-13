# https://canvas.instructure.com/doc/api/tools_xml.html
# LTI gem docs: https://github.com/instructure/ims-lti
module Lti

  class Canvas

    def self.tool_mode(env)
      "(#{env})" if env.present? && env != 'production'
    end

    def self.tool_name(env)
      "#{Rails.application.secrets.application_name} #{self.tool_mode(env)}"
    end

    def self.config_xml(url, button_url, env = '')
      tc = IMS::LTI::ToolConfig.new(:title => self.tool_name(env), :launch_url => url)
      tc.description = "#{Rails.application.secrets.application_name}"
      config = {
        'privacy_level' => 'public',
        'resource_selection' => {
          'url' => url,
          'text' => '#{Rails.application.secrets.application_name}',
          'selection_width' => '892',
          'selection_height' => '800'
        },
        'editor_button' => {
          'url' => url,
          'icon_url' => button_url,
          'text' => '#{Rails.application.secrets.application_name}',
          'selection_width' => '892',
          'selection_height' => '800'
        }
      }
      tc.set_ext_params('canvas.instructure.com', config)
      tc.to_xml(:indent => 2)
    end

    def self.course_navigation_config_xml(launch_url, name, env = '')
      tc = IMS::LTI::ToolConfig.new(:title => "#{name}#{self.tool_mode(env)}", :launch_url => launch_url)
      tc.description = Rails.application.secrets.application_name
      config = {
        'privacy_level' => 'public',
        'course_navigation' => {
          'url' => launch_url,
          'default' => 'enabled',
          'visibility' => 'public',
          'text' => name,
          'enabled' => true
        }
      }
      tc.set_ext_params('canvas.instructure.com', config)
      tc.to_xml(:indent => 2)
    end

  end

end