module OpenAssessments
  class LtiError < StandardError; end
  class NoLtiKey < LtiError; end
  class UnknownLtiKey < LtiError; end
end