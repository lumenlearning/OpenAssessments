class AssessmentXml < ActiveRecord::Base
  belongs_to :assessment

  scope :by_newest, -> { order(created_at: :desc) }

  def self.by_kind(kind)
    where(kind: kind)
  end

end
