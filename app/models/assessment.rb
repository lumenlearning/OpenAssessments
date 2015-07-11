class Assessment < ActiveRecord::Base
  validates_presence_of :title

  acts_as_taggable_on :keywords

  has_many :sections, dependent: :destroy
  has_many :items, through: :sections
  has_many :assessment_results, dependent: :destroy
  belongs_to :user
  has_many :assessment_xmls, dependent: :destroy
  has_many :assessment_outcomes
  has_many :outcomes, through: :assessment_outcomes
  belongs_to :account

  has_many :assessment_settings
  has_many :user_assessments

  scope :by_newest, -> { order(created_at: :desc) }
  scope :by_oldest, -> { order(start_date: :asc) }
  scope :by_latest, -> { order(updated_at: :desc) }

  def self.from_xml(input_xml, user, src_url=nil, published_at=nil, file_name = nil)
    if xml = AssessmentParser.parse(input_xml).first || ItemParser.parse(input_xml).first
      assessment = Assessment.find_by(identifier: xml.ident, user_id: user.id) || user.assessments.build
      assessment.identifier = xml.ident
      assessment.title = xml.title
    else
      assessment = Assessment.find_by(identifier: file_name, user_id: user.id) || user.assessments.build
      assessment.identifier = file_name
      assessment.title = File.basename(file_name)
    end
    assessment.description = 'Assessment'
    assessment.src_url = src_url
    assessment.published_at = published_at
    assessment.save!

    # Create a formative xml entry
    assessment.assessment_xmls.create!(
      xml: input_xml,
      kind: "formative"
    )

    if xml && xml.respond_to?(:sections)
      assessment.create_subitems(xml)
    end

    # Create a summative xml entry (no answers in xml)
    sumative_xml = input_xml
    sumative_xml.gsub! /<conditionvar>(.*?)<\/conditionvar>/m, ''
    assessment.assessment_xmls.create!(
      xml: sumative_xml,
      kind: "summative"
    )

    assessment
  end

  def create_subitems(xml)
    xml.sections.collect do |section_xml|
      Section.from_xml(section_xml, self)
    end
  end

  def raw_results( scope_url = nil )
    results = scope_url ? assessment_results.where("referer LIKE ?", "%#{scope_url}%") : assessment_results
  end

  def results_summary( scope_url = nil )
    @results_summary ||= begin
      users = []
      referers = []

      results = raw_results( scope_url )

      results.map do |assessment_result|
        users << assessment_result.user if !users.include?(assessment_result.user)
        referers << assessment_result.referer if !assessment_result.referer.nil? && !referers.include?(item_result.referer)
      end

      submitted = results.by_status_final.load

      {
        renders: users.count,
        submitted: submitted,
        users: users,
        referers: referers,
      }
    end
  end

end
