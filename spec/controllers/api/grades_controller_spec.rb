require 'rails_helper'

describe Api::GradesController do
  # TODO find a good way to test this.
  before do
    @account = FactoryGirl.create(:account)
    @user = FactoryGirl.create(:user, account: @account)
    @user.confirm!

    @user_assessment = FactoryGirl.create(:user_assessment)


    @admin = CreateAdminService.new.call
    @admin.make_account_admin({account_id: @account.id})

    @user_token = AuthToken.issue_token({ user_id: @user.id })
    @admin_token = AuthToken.issue_token({ user_id: @admin.id })

    allow(controller).to receive(:current_account).and_return(@account)

    @params = {"itemToGrade" =>
                      {"questions" =>
                               [{"id" => "4965",
                                 "confidenceLevel" => "Just A Guess",
                                 "timeSpent" => 4069,
                                 "startTime" => 1449619801421,
                                 "outcome_guid" => "f71c5ce2-46b7-4cce-9531-1680d42faf1b"},
                                {"id" => "3790",
                                 "confidenceLevel" => "Pretty Sure",
                                 "timeSpent" => 3236,
                                 "startTime" => 1449619805490,
                                 "outcome_guid" => "9a82d67b-21ce-4cbf-8298-6bd1109f03b2"},
                                {"id" => "5555",
                                 "confidenceLevel" => "Very Sure",
                                 "timeSpent" => 1593,
                                 "startTime" => 1449619808726,
                                 "outcome_guid" => "a9fc4312-f9dd-4430-bea7-b551790a4c51"},
                               ],
                       "answers" => [["4501"], ["6386"], "6368"],
                       "assessmentId" => nil,
                       "identifier" => "ib7b957adb7ce471691e27cf3dd9d37a7_swyk",
                       "settings" =>
                               {"externalUserId" => "1d59ddbce40747fd7c9664c7c08e24017b8b734c",
                                "externalContextId" => "d4dcc12bc137c611fb8d61d0cb77f1f6c4473f34",
                                "userAssessmentId" => "36853",
                                "userAttempts" => 3,
                                "srcUrl" =>
                                        "https://localhost/api/assessments/345.xml?lti_context_id=d4dcc12bc137c611fb8d61d0cb77f1f6c4473f34",
                                "lisResultSourceDid" => "",
                                "lisOutcomeServiceUrl" => "",
                                "lisUserId" => "1d59ddbce40747fd7c9664c7c08e24017b8b734c",
                                "isLti" => false,
                                "ltiRole" => "admin",
                                "assessmentKind" => nil,
                                "accountId" => "1"}}}
    file = File.join(__dir__, '../../fixtures/swyk_quiz.xml')
    @assessment = Assessment.create!(title: 'testing', kind: "summative", xml_file: open(file).read )
    @params["itemToGrade"]["assessmentId"] = @assessment.id
    @params["itemToGrade"]["settings"]["assessmentKind"] = @assessment.kind
    @question = @params["itemToGrade"]["questions"][0]
  end

  describe "create" do
    before do
      request.headers['Authorization'] = @admin_token
    end

    it "verifies that the Assessment is present in JSON" do
      expect(Assessment.first).to_not be(nil)
    end

    it "tests that JSON is being sent successfully and being parsed" do
      post :create, @params.to_json, format: :json
      expect(response).to have_http_status(:success)
    end

    it "tests that the correct values are being returned in JSON object" do
      post :create, @params.to_json, format: :json
      expect(response.body.include?('score' &&
                                    'feedback' &&
                                    'correct_list' &&
                                    'confidence_level_list' &&
                                    'lti_params' &&
                                    'assessment_results_id')).to be true
    end

    it "tests that the correct score is being returned in the response body" do
      post :create, @params.to_json, format: :json
      result = JSON.parse(response.body)
      expect(result['score']).to eq 33.0
    end


    it "tests that the right value is being returned from the confidence_level_list" do
      post :create, @params.to_json, format: :json
      result = JSON.parse(response.body)
      expect(result['confidence_level_list']).to eq ["Just A Guess", "Pretty Sure", "Very Sure"]
    end

    it "tests that the assessment_results_id is correct" do
      post :create, @params.to_json, format: :json
      result = JSON.parse(response.body)
      expect(result['assessment_results_id']).to eq @assessment.assessment_results.first.id
    end

    it "tests that the session_status is pending when isLti is true" do
      @params["itemToGrade"]["settings"]["isLti"] = true
      post :create, @params.to_json, format: :json
      expect(@assessment.assessment_results.first.session_status).to eq "pendingLtiOutcome"
    end

    it "tests that the session_status is complete when isLti is false" do
      post :create, @params.to_json, format: :json
      expect(@assessment.assessment_results.first.session_status).to eq "final"
    end
    it "tests that the right values are being returned from the correct_list" do
      post :create, @params.to_json, format: :json
      result = JSON.parse(response.body)
      expect(result['correct_list']).to eq [false, false, true]
    end

    it "creates item results" do
      post :create, @params.to_json, format: :json
      expect(Item.count).to be 3
    end

    describe "item_results" do

      it "creates item results" do
        post :create, @params.to_json, format: :json
        item_result = ItemResult.find_by_identifier("4965")
        expect(item_result).to_not be nil
      end

      it "tests that correct is true for right answer in item_result" do
        post :create, @params.to_json, format: :json
        item_result = ItemResult.find_by_identifier("5555")
        expect(item_result.correct).to be true
      end

      it "tests that correct is false for wrong answer in item_result" do
        post :create, @params.to_json, format: :json
        item_result = ItemResult.find_by_identifier("4965")
        expect(item_result.correct).to be false
      end

      it "tests that correct is false for partial answer in item_result" do
        post :create, @params.to_json, format: :json
        item_result = ItemResult.find_by_identifier("3790")
        expect(item_result.correct).to be false
      end

      it "tests that the time spent is correct for item_result" do
        post :create, @params.to_json, format: :json
        item_result = ItemResult.find_by_identifier("3790")
        expect(item_result.time_elapsed).to be 3236
      end

      it "tests that the answers_chosen are correct" do
        post :create, @params.to_json, format: :json
        item_result = ItemResult.find_by_identifier("3790")
        expect(item_result.answers_chosen).to eq ("6386")
      end

      it "tests that the answers_chosen are correct" do
        post :create, @params.to_json, format: :json
        item_result = ItemResult.find_by_identifier("4965")
        expect(item_result.answers_chosen).to eq ("4501")
      end

      it "tests that the answers_chosen are correct" do
        post :create, @params.to_json, format: :json
        item_result = ItemResult.find_by_identifier("5555")
        expect(item_result.answers_chosen).to eq "6368"
      end

      it "tests that score is zero for incorrectly answered question" do
        post :create, @params.to_json, format: :json
        item_result = ItemResult.find_by_identifier("4965")
        expect(item_result.score).to eq 0
      end

      it "tests that score is 1 for correctly answered question" do
        post :create, @params.to_json, format: :json
        item_result = ItemResult.find_by_identifier("5555")
        expect(item_result.score).to eq 1
      end

      it "tests that score is float for partially correct answer" do
        @params["itemToGrade"]["answers"] = [["4501"], ["483", "1111"], ["6368"]]
        post :create, @params.to_json, format: :json
        item_result = ItemResult.find_by_identifier("3790")
        expect(item_result.score).to eq 0.25
      end

      it "tests that confidence_level is correct for question" do
        post :create, @params.to_json, format: :json
        item_result = ItemResult.find_by_identifier("5555")
        expect(item_result.confidence_level).to eq 2
      end

      it "tests that confidence_level is correct for question" do
        post :create, @params.to_json, format: :json
        item_result = ItemResult.find_by_identifier("4965")
        expect(item_result.confidence_level).to eq 0
      end

      it "tests that confidence_level is correct for question" do
        post :create, @params.to_json, format: :json
        item_result = ItemResult.find_by_identifier("3790")
        expect(item_result.confidence_level).to eq 1
      end
    end
  end
end
