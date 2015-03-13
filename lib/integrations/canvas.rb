class Integrations::Canvas

  def self.get_courses(canvas_authentication, lti_launch_url)
    base_uri = UrlHelper.scheme_host(canvas_authentication.provider_url)
    headers = { "Authorization" => "Bearer #{canvas_authentication.token}" }
    allowed_enrollments = %w(teacher ta designer)
    allowed_courses = []
    already_courses = []
    courses = HTTParty.get("#{base_uri}/api/v1/courses", :headers => headers)
    if courses.response.code == '401'
      raise Integrations::CanvasTokenExpiredException
    elsif courses.response.code != '200'
      raise Integrations::CanvasInvalidRequestException, [courses['message']]
    end
    courses.each do |course|
      if(course['enrollments'].map{|e| e['type']} & allowed_enrollments).length > 0
        existing_tools = HTTParty.get("#{base_uri}/api/v1/courses/#{course['id']}/external_tools", :headers => headers)
        if(id = self.find_tool_id(existing_tools, lti_launch_url))
          already_courses << course
        else
          allowed_courses << course
        end
      end
    end
    [allowed_courses, already_courses]
  end

  def self.setup_lti(courses, consumer_key, shared_secret, canvas_authentication, lti_launch_url, lti_rich_editor_button_image_url, env)
    config_xml = Lti::Canvas.config_xml(lti_launch_url, lti_rich_editor_button_image_url, env)
    self.setup(config_xml, courses, consumer_key, shared_secret, canvas_authentication, lti_launch_url, env)
  end

  def self.setup_course_navigation_lti(courses, consumer_key, shared_secret, canvas_authentications, lti_launch_url, name, env)
    config_xml = Lti::Canvas.course_navigation_config_xml(lti_launch_url, name, env)
    self.setup(config_xml, courses, consumer_key, shared_secret, canvas_authentications, lti_launch_url, env)
  end

  # canvas_authentications can either be a single value or an array
  def self.setup(config_xml, courses, consumer_key, shared_secret, canvas_authentications, lti_launch_url, env)

    errors = []
    courses.each do |course_id, course|
      course = Yajl::Parser.parse(course)

      if course['authentication_id']
        canvas_authentication = canvas_authentications.find{|auth| auth.id == course['authentication_id'].to_i}
        course.delete('authentication_id')
      else
        canvas_authentication = canvas_authentications
      end

      base_uri = UrlHelper.scheme_host(canvas_authentication.provider_url)
      headers = { "Authorization" => "Bearer #{canvas_authentication.token}" }

      existing_tools = HTTParty.get("#{base_uri}/api/v1/courses/#{course['id']}/external_tools", :headers => headers)

      if existing_tools.response.code != '200'
        errors << "Could not add tools to #{course['name']}: #{existing_tools['message']}"
      else
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

          result = HTTParty.put("#{base_uri}/api/v1/courses/#{course['id']}/external_tools/#{id}", :headers => headers, :body => tool_config)
          self.check_result(result, errors, 'update')
        else
          tool_config["consumer_key"] = consumer_key
          tool_config["shared_secret"] = shared_secret
          result = HTTParty.post("#{base_uri}/api/v1/courses/#{course['id']}/external_tools", :headers => headers, :body => tool_config)
          self.check_result(result, errors, 'add')
        end

      end

    end

    errors
  end

  def self.asdf
  end

  def self.find_tool_id(existing_tools, tool_launch_url)
    if tool = self.find_tool(existing_tools, tool_launch_url)
      tool['id']
    end
  end

  def self.find_tool(existing_tools, tool_launch_url)
    existing_tools.find{|t| t['url'] == tool_launch_url}
  end

  def self.check_result(result, errors, kind)
    if result.response.code != '200'
      errors << "Could not #{kind} tool: #{result['message']}"
    end
  end

end

class Integrations::CanvasTokenExpiredException < Exception
end

class Integrations::CanvasInvalidRequestException < Exception
end
