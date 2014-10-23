require 'rails_helper'
require 'webmock/rspec'

describe EvaluationsController do
  describe "GET index" do
    it "assigns courses list of canvas courses" do
      WebMock.stub_request(:get, "http://www.example.com/api/v1/courses?as_user_id=1").
         with(:headers => {'Authorization'=>'Bearer'}).to_return(:body => [{"account_id"=>81259,
        "course_code"=>"SCI302",
        "default_view"=>"feed",
        "id"=>663611,
        "name"=>"Chemistry",
        "start_at"=>nil,
        "end_at"=>nil,
        "public_syllabus"=>false,
        "storage_quota_mb"=>250,
        "apply_assignment_group_weights"=>false,
        "calendar"=>{"ics"=>"https://canvas.instructure.com/feeds/calendars/course_sKEd2SIM9DcN1JEE95IZEIyLdOIGjsfTo8DD9oSR.ics"},
        "sis_course_id"=>nil,
        "integration_id"=>nil,
        "enrollments"=>[{"type"=>"teacher", "role"=>"TeacherEnrollment", "enrollment_state"=>"active"}],
        "hide_final_grades"=>false,
        "workflow_state"=>"unpublished"},
       {"account_id"=>81259,
        "course_code"=>"Chem",
        "default_view"=>"feed",
        "id"=>861303,
        "name"=>"Chem",
        "start_at"=>"2014-06-17T16:38:00Z",
        "end_at"=>nil,
        "public_syllabus"=>false,
        "storage_quota_mb"=>250,
        "apply_assignment_group_weights"=>false,
        "calendar"=>{"ics"=>"https://canvas.instructure.com/feeds/calendars/course_RCpAJnZQ7N6787QpBZElgvg8X4i12NhuNuxhYcxP.ics"},
        "sis_course_id"=>nil,
        "integration_id"=>nil,
        "enrollments"=>[{"type"=>"teacher", "role"=>"TeacherEnrollment", "enrollment_state"=>"active"}],
        "hide_final_grades"=>false,
        "workflow_state"=>"available"}], :status => 200)
      login_user
      external_identifier = double(:external_identifier, :custom_canvas_user_id => 1)
      subject.instance_variable_set(:@external_identifier, external_identifier)
      get :index
      expect(assigns(:courses).body.count).to eq(2)

    end

  end
end