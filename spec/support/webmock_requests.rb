require 'webmock/rspec'

# Don't allow real connections when testing
WebMock.disable_net_connect!(allow_localhost: true)

canvas_headers = {
  "cache-control"=>["must-revalidate, private, max-age=0"], 
  "content-type"=>["application/json; charset=utf-8"], 
  "date"=>["Tue, 17 Mar 2015 20:58:42 GMT"], 
  "etag"=>["\"c130ed4522ebea32d2649aff2e30fd3a\""], 
  "link"=>["<https://canvas.instructure.com/api/v1/courses/4346~228/external_tools?page=1&per_page=10>; rel=\"current\",<https://canvas.instructure.com/api/v1/courses/4346~228/external_tools?page=1&per_page=10>; rel=\"first\",<https://canvas.instructure.com/api/v1/courses/4346~228/external_tools?page=1&per_page=10>; rel=\"last\""], 
  "p3p"=>["CP=\"None, see http://www.instructure.com/privacy-policy\""], 
  "server"=>["Apache"], 
  "set-cookie"=>["_csrf_token=9ATKDp5mkAhXm5DTVw54PeMj0FoKrA%2BUNQnFEfXgUs6eL4cl5hXEZwL5xoM%2FdhlS2xWAMT%2BHQs1iRLYkv9YTtg%3D%3D; path=/; secure", 
  "canvas_session=LxC99e7zSpIBWuoSrxCHdg.xTKVNyuNeaLj864o1zvSA2YTzFQTPbQNpYoi2ktpSRSfjl0Q7CQe7W543_0So0FLILT3TkPbbGjcfoRGZNBhdWw8iOr7QRrIFwTHFdLNE7DWMRM4ZhX16kNxCI0_OD7g.iGFa_i2CresH7XxNz2ZwUksLtOk.VQiVgw; path=/; secure; HttpOnly"], 
  "status"=>["200"], 
  "vary"=>["Accept-Encoding"], 
  "x-canvas-meta"=>["a=1;g=4MRcxnx6vQbFXxhLb8005m5WXFM2Z2i8lQwhJ1QT;s=4346;c=cluster35;z=us-east-1e;b=746692;m=746756;u=0.05;y=0.00;d=0.05;"], 
  "x-canvas-user-id"=>["43460000000000001"], 
  "x-frame-options"=>["SAMEORIGIN"], 
  "x-rack-cache"=>["miss"], 
  "x-request-context-id"=>["51a34ee0-af16-0132-cb5f-12e99fa8d58a"], 
  "x-runtime"=>["0.186145"], 
  "x-session-id"=>["48896cba407171322f5b940099073514"], 
  "x-ua-compatible"=>["IE=Edge,chrome=1"], 
  "content-length"=>["2561"], 
  "connection"=>["Close"]
}

def lti_tool_json
  "{\"consumer_key\":\"fake\",\"created_at\":\"2015-03-11T02:12:39Z\",\"description\":\"Customizable free textbooks\",\"domain\":null,\"id\":43460000000000549,\"name\":\"CK-12\",\"updated_at\":\"2015-03-11T02:12:39Z\",\"url\":\"https://www.edu-apps.org/tool_redirect?id=ck12\",\"privacy_level\":\"anonymous\",\"custom_fields\":{},\"workflow_state\":\"anonymous\",\"vendor_help_link\":null,\"user_navigation\":null,\"course_navigation\":null,\"account_navigation\":null,\"resource_selection\":{\"url\":\"https://www.edu-apps.org/tool_redirect?id=ck12\",\"text\":\"CK-12\",\"selection_width\":690,\"selection_height\":530,\"label\":\"CK-12\",\"icon_url\":\"https://www.edu-apps.org/tools/ck12/icon.png\"},\"editor_button\":{\"url\":\"https://www.edu-apps.org/tool_redirect?id=ck12\",\"text\":\"CK-12\",\"selection_width\":690,\"selection_height\":530,\"icon_url\":\"https://www.edu-apps.org/tools/ck12/icon.png\",\"label\":\"CK-12\"},\"homework_submission\":null,\"migration_selection\":null,\"course_home_sub_navigation\":null,\"course_settings_sub_navigation\":null,\"global_navigation\":null,\"assignment_menu\":null,\"file_menu\":null,\"discussion_topic_menu\":null,\"module_menu\":null,\"quiz_menu\":null,\"wiki_page_menu\":null,\"tool_configuration\":null,\"icon_url\":\"https://www.edu-apps.org/tools/ck12/icon.png\",\"not_selectable\":false}"
end

def lti_tool_json2
  "{\"consumer_key\":\"fake\",\"created_at\":\"2015-03-11T02:12:39Z\",\"description\":\"Search publicly available YouTube videos. A new icon will show up in your course rich editor letting you search YouTube and click to embed videos in your course material.\",\"domain\":\"edu-apps.org\",\"id\":43460000000000550,\"name\":\"YouTube\",\"updated_at\":\"2015-03-11T02:12:39Z\",\"url\":\"https://www.edu-apps.org/lti_public_resources/?tool_id=youtube\",\"privacy_level\":\"anonymous\",\"custom_fields\":{},\"workflow_state\":\"anonymous\",\"vendor_help_link\":null,\"user_navigation\":null,\"course_navigation\":null,\"account_navigation\":null,\"resource_selection\":{\"selection_width\":560,\"selection_height\":600,\"label\":\"YouTube\",\"icon_url\":\"https://www.edu-apps.org/assets/lti_public_resources/youtube_icon.png\"},\"editor_button\":{\"selection_width\":560,\"selection_height\":600,\"icon_url\":\"https://www.edu-apps.org/assets/lti_public_resources/youtube_icon.png\",\"label\":\"YouTube\"},\"homework_submission\":null,\"migration_selection\":null,\"course_home_sub_navigation\":null,\"course_settings_sub_navigation\":null,\"global_navigation\":null,\"assignment_menu\":null,\"file_menu\":null,\"discussion_topic_menu\":null,\"module_menu\":null,\"quiz_menu\":null,\"wiki_page_menu\":null,\"tool_configuration\":null,\"icon_url\":\"https://www.edu-apps.org/assets/lti_public_resources/youtube_icon.png\",\"not_selectable\":false}"
end

RSpec.configure do |config|
  config.before(:each) do

    # ####################################################################################### 
    # Canvas API
    #

    #
    # LTI tools
    #
    stub_request(:get, %r|http[s]*://www.example.com/api/v1/courses/.+/external_tools|).
      to_return(
        :status => 200, 
        :body => "[#{lti_tool_json}, #{lti_tool_json2}]", 
        :headers => canvas_headers)
  
    stub_request(:post, %r|http[s]*://www.example.com/api/v1/courses/.+/external_tools|).
      to_return(
        :status => 200, 
        :body => lti_tool_json, 
        :headers => canvas_headers)

    stub_request(:put, %r|http[s]*://www.example.com/api/v1/courses/.+/external_tools|).
      to_return(
        :status => 200, 
        :body => lti_tool_json,
        :headers => canvas_headers)
  end
end