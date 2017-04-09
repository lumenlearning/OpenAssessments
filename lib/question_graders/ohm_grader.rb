module QuestionGraders
  module OhmGrader

    # MOM returns a a JWT signed with the shared secret
    # This allows us to trust the score even though it goes through the client
    # If the JWT is invalid we score the answer for 0 points
    # The JWT's payload looks like:
    # {
    #         "id" => 79660,
    #         "score" => 1,
    #         "redisplay" => "3766;0;(2,2)",
    #         "auth" => "secret_lookup_key"
    # }
    def self.grade(question_node, answer)
      payload, header = JWT.decode(answer, Rails.application.secrets.mom_secret)

      # Verify that the score is for the designated question
      if payload["id"] == get_mom_question_id(question_node)
        return payload["score"]
      end

      return 0
    rescue JWT::DecodeError
      # The token was invalid
      return 0
    end

    def self.get_mom_question_id(question)
      id = question.children.at_css("material mat_extension mom_question_id").text.strip
      id.to_i
    end

  end
end