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

  attr_accessor :xml_file

  before_save :save_xml
  after_save  :create_subitems

  def save_xml
    return unless xml_file.present?
    if xml_file.is_a?(String)
      xml = xml_file
    else 
      xml = xml_file.read
    end    

    self.assessment_xmls.destroy_all

    # Create a formative xml entry
    self.assessment_xmls.build(
      xml: xml,
      kind: "formative"
    )

    # Create a summative xml entry (no answers in xml)
    sumative_xml = xml.gsub /<conditionvar>(.*?)<\/conditionvar>/m, ''
    self.assessment_xmls.build(
      xml: sumative_xml,
      kind: "summative"
    )

    # set values from xml
    if parsed_xml(xml)
      self.identifier ||= @parsed_xml.ident
      self.title ||= @parsed_xml.title
    end

  end

  def parsed_xml(xml = nil)
    @parsed_xml ||= AssessmentParser.parse(xml).first if xml.present?
    @parsed_xml
  end

  def default_settings
    self.assessment_settings.any? ? self.assessment_settings.first : nil
  end

  def default_style
    self.account ? self.account.default_style : nil
  end

  # TODO Decide if we still want to break the QTI into separate objects
  def create_subitems
    if parsed_xml && parsed_xml.respond_to?(:sections)
      parsed_xml.sections.collect do |section_xml|
        Section.from_xml(section_xml, self)
      end
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
