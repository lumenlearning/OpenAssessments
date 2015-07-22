class AssessmentSetting < ActiveRecord::Base
  belongs_to :assessment
  belongs_to :account
end
