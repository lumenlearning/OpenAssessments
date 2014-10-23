
class Canvas
  def initialize(canvas_uri, canvas_api_key)
    @per_page = 100
    @canvas_uri = canvas_uri
    @canvas_api_key = canvas_api_key
  end

  def headers
    {
      "Authorization" => "Bearer #{@canvas_api_key}",
      "content_type" => "json"
    }
  end

  def full_url(api_url)
    base_uri = UrlHelper.scheme_host(@canvas_uri)
    "#{base_uri}/api/v1/#{api_url}"
  end

  def api_post_request(api_url, payload)
    check_result(HTTParty.post(full_url(api_url), :headers => headers, :body => payload))
  end

  def api_get_request(api_url)
    check_result(HTTParty.get(full_url(api_url), :headers => headers))
  end

  def check_result(result)
    if result.response.code == '401'
      raise Canvas::CanvasTokenExpiredException, [result['error']]
    elsif result.response.code == '404'
      raise Canvas::CanvasNotFoundException, [result['error']]
    elsif !['200', '201'].include?(result.response.code)
      message = result['message'] rescue result.response.body
      raise Canvas::CanvasInvalidRequestException, [message]
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

  def assignments(course_id)
    api_get_request("courses/#{course_id}/assignments")
  end

  def discussion_topics(course_id)
    api_get_request("courses/#{course_id}/discussion_topics")
  end

  def get_courses(user_id)
    api_get_request("courses?as_user_id=#{user_id}")
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

  # Exceptions
  class CanvasTokenExpiredException < Exception
  end

  class CanvasInvalidRequestException < Exception
  end

  class CanvasNotFoundException < Exception
  end

end
