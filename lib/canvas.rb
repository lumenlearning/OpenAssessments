class Canvas

  def initialize(canvas_uri, canvas_api_key)
    @per_page = 100
    @canvas_uri = UrlHelper.scheme_host(canvas_uri)
    @canvas_api_key = canvas_api_key
  end

  def headers
    {
      "Authorization" => "Bearer #{@canvas_api_key}",
      "content_type" => "json",
      'User-Agent' => "CanvasAPI Ruby"
    }
  end

  def full_url(api_url)
    "#{@canvas_uri}/api/v1/#{api_url}"
  end

  def api_put_request(api_url, payload)
    check_result(HTTParty.put(full_url(api_url), :headers => headers, :body => payload))
  end

  def api_post_request(api_url, payload)
    check_result(HTTParty.post(full_url(api_url), :headers => headers, :body => payload))
  end

  def api_get_request(api_url)
    check_result(HTTParty.get(full_url(api_url), :headers => headers))
  end

  def check_result(result)
    if result.response.code == '401'
      raise Canvas::UnauthorizedException, result['errors']
    elsif result.response.code == '404'
      raise Canvas::NotFoundException, result['errors']
    elsif !['200', '201'].include?(result.response.code)
      raise Canvas::InvalidRequestException, result['errors']
    end
    result
  end

  def make_paged_api_request(api_url)
    next_page = true
    results = []
    connector = api_url.include?('?') ? '&' : '?'
    page = 0
    while next_page do
      result = api_get_request("#{api_url}#{connector}per_page=#{@per_page}")
      result << "&page=#{page}" if page > 0
      result.each{|r| results << r }
      next_page = result.headers['link'].split(',').find{|l| l.split('\; ')[1] == 'rel="next"' }
      page += 1
    end
    results
  end

  def is_account_admin
    api_get_request("accounts/self") # If user can access this endpoint they are an account admin
    true
  rescue Canvas::UnauthorizedException => ex
    false  
  end

  def accounts
    account = api_get_request("accounts/self")
    [account]
  rescue Canvas::UnauthorizedException => ex
    api_get_request("course_accounts")
  end

  def assignments(course_id)
    api_get_request("courses/#{course_id}/assignments")
  end

  def discussion_topics(course_id)
    api_get_request("courses/#{course_id}/discussion_topics")
  end

  def courses(user_id = nil)
    if user_id
      api_get_request("courses?as_user_id=#{user_id}")
    else
      api_get_request("courses")
    end
  end

  def recent_logins(course_id)
    api_get_request("courses/#{course_id}/recent_students")
  end

  def students(course_id)
    make_paged_api_request("courses/#{course_id}/users?enrollment_type=student")
  end

  def course_participation(course_id, student_id)
    api_get_request("courses/#{course_id}/analytics/users/#{student_id}/activity")
  end

  def quiz_submissions(course_id, quiz_id)
    api_get_request("courses/#{course_id}/submissions")
  end

  def quizzes(course_id)
    api_get_request("courses/#{course_id}/quizzes")
  end

  def assignment_submissions(course_id)
    api_get_request("courses/#{course_id}/students/submissions?student_ids[]=all")
  end

  def student_assignment_data(course_id, student_id)
    api_get_request("courses/#{course_id}/analytics/users/#{student_id}/assignments")
  end

  def get_profile(user_id)
    api_get_request("users/self/profile?as_user_id=#{user_id}")
  end

  def user_activity(user_id)
    api_get_request("users/activity_stream?as_user_id=#{user_id}")
  end

  def create_conversation(recipients, subject, body)
    api_post_request("conversations", {
      recipients: recipients,
      subject: subject,
      body: body,
      scope: 'unread'
    })
  end

  def get_conversation(conversation_id)
    api_get_request("conversations/#{conversation_id}")
  end

  def add_message(conversation_id, recipients, body)
    api_post_request("conversations/#{conversation_id}/add_message", {
      recipients: recipients,
      body: body,
      scope: 'unread'
    })
  end

  def get_course_lti_tools(course_id)
    api_get_request("courses/#{course_id}/external_tools")
  end

  def update_course_lti_tool(course_id, external_tool_id, tool_config)
    api_put_request("courses/#{course_id}/external_tools/#{external_tool_id}", tool_config)
  end

  def create_course_lti_tool(course_id, tool_config)
    api_post_request("courses/#{course_id}/external_tools", tool_config)
  end

  def get_account_lti_tools(account_id)
    api_get_request("accounts/#{account_id}/external_tools")
  end

  def update_account_lti_tool(account_id, external_tool_id, tool_config)
    api_put_request("accounts/#{account_id}/external_tools/#{external_tool_id}", tool_config)
  end
  
  def create_account_lti_tool(account_id, tool_config)
    api_post_request("accounts/#{account_id}/external_tools", tool_config)
  end

  # Exceptions

  class UnauthorizedException < Exception
  end

  class InvalidRequestException < Exception
  end

  class NotFoundException < Exception
  end

end
