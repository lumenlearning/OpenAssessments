module Integrations 

  class CanvasCoursesLti < CanvasBaseLti

    def self.courses(canvas_authentication, lti_launch_url)
      api = Canvas.new(canvas_authentication.provider_url, canvas_authentication.token)
      
      allowed_enrollments = %w(teacher ta designer)
      allowed_courses = []
      already_courses = []
      courses = api.courses

      courses.each do |course|
        if(course['enrollments'].map{|e| e['type']} & allowed_enrollments).length > 0
          if(id = self.find_tool_id(api.get_course_lti_tools(course['id']), lti_launch_url))
            already_courses << course
          else
            allowed_courses << course
          end
        end
      end
      [allowed_courses, already_courses]
    end

    def self.setup_lti(course, consumer_key, shared_secret, canvas_authentication, lti_launch_url, lti_rich_editor_button_image_url, env)
      config_xml = Lti::Canvas.config_xml(lti_launch_url, lti_rich_editor_button_image_url, env)
      self.setup(config_xml, course, consumer_key, shared_secret, canvas_authentication, lti_launch_url, env)
    end

    def self.setup_course_navigation_lti(course, consumer_key, shared_secret, canvas_authentications, lti_launch_url, name, env)
      config_xml = Lti::Canvas.course_navigation_config_xml(lti_launch_url, name, env)
      self.setup(config_xml, course, consumer_key, shared_secret, canvas_authentications, lti_launch_url, env)
    end

    # canvas_authentications can either be a single value or an array
    def self.setup(config_xml, course, consumer_key, shared_secret, canvas_authentications, lti_launch_url, env)

      if course['authentication_id']
        canvas_authentication = canvas_authentications.find{|auth| auth.id == course['authentication_id'].to_i}
        course.delete('authentication_id')
      else
        canvas_authentication = canvas_authentications
      end

      api = Canvas.new(canvas_authentication.provider_url, canvas_authentication.token)
      existing_tools = api.get_course_lti_tools(course['id'])

      # Reset config for each iteration since we might not want the key and secret
      tool_config = {
        "config_type" => "by_xml",
        "config_xml" => config_xml
      }
      if(id = self.find_tool_id(existing_tools, lti_launch_url))
        tool = self.find_tool(existing_tools, lti_launch_url)
        # Make sure the the LTI key associated with the tool exists in our system.
        lti_connected_resource = Account.find_by_lti_key(tool['consumer_key']) || User.find_by_lti_key(tool['consumer_key'])
        if lti_connected_resource.blank?
          # The user or account that connected to the tool is no longer in the system or has changed their LTI key. We need to update the key and secret.
          tool_config["consumer_key"] = consumer_key
          tool_config["shared_secret"] = shared_secret
        end
        # Important! If lti_connected_resource is valid then don't update the 'oauth_consumer_key' or else external identifiers will break.
        api.update_course_lti_tool(course["id"], tool_config)
      else
        tool_config["consumer_key"] = consumer_key
        tool_config["shared_secret"] = shared_secret
        api.create_course_lti_tool(course["id"], tool_config)
      end

    end

  end

end