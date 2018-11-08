class Assessment < ActiveRecord::Base
  validates_presence_of :title

  acts_as_taggable_on :keywords

  has_many :sections, dependent: :destroy
  has_many :items, through: :sections
  has_many :assessment_results
  belongs_to :user
  has_many :assessment_xmls
  has_many :assessment_outcomes
  has_many :outcomes, through: :assessment_outcomes
  belongs_to :account
  belongs_to :current_assessment_xml, class_name: AssessmentXml, foreign_key: :current_assessment_xml_id

  has_many :assessment_settings
  has_many :user_assessments

  store_accessor :data, :external_edit_id, :copied_from_assessment_id

  scope :by_newest, -> { order(created_at: :desc) }
  scope :by_oldest, -> { order(start_date: :asc) }
  scope :by_latest, -> { order(updated_at: :desc) }
  scope :summative, -> {where kind: 'summative'}
  scope :swyk, -> {where kind: 'show_what_you_know'}
  scope :formative, -> {where kind: 'formative'}
  scope :practice, -> {where kind: 'practice'}
  scope :by_edit_id, ->(id) {where('data @> ?', {external_edit_id: id}.to_json)}
  scope :by_copied_from_assessment_id, ->(id) {where('data @> ?', {copied_from_assessment_id: id}.to_json)}

  attr_accessor :xml_file

  after_save :save_xml
  after_save :create_subitems


  def xml_with_answers(limit_section_count_to = false, selected_item_ids=nil)
    if self.current_assessment_xml
      xml = self.current_assessment_xml.xml
    else
      xml = assessment_xmls.where(kind: "formative").last.xml
    end

    if limit_section_count_to
      AssessmentXml.xml_with_limited_questions(xml, limit_section_count_to, selected_item_ids)
    else
      xml
    end
  end

  def xml_without_answers(limit_section_count_to = false, selected_item_ids=nil)
    if self.current_assessment_xml
      xml = self.current_assessment_xml.no_answer_xml
    else
      xml = assessment_xmls.where(kind: "summative").last.xml
    end

    if limit_section_count_to
      AssessmentXml.xml_with_limited_questions(xml, limit_section_count_to, selected_item_ids)
    else
      xml
    end
  end

  def save_xml
    return unless xml_file.present?
    if xml_file.is_a?(String)
      xml = xml_file
    else
      xml = xml_file.read
    end

    # Create a no answer xml entry
    no_answer_xml = xml.gsub /< *respcondition(.*?)< *\/ *respcondition *>/m, ''
    no_answer_xml = no_answer_xml.gsub /< *itemfeedback(.*?)< *\/ *itemfeedback *>/m, ''

    ax = self.assessment_xmls.build(
      xml: xml,
      no_answer_xml: no_answer_xml,
      kind: "qti"
    )

    ax.save!
    self.current_assessment_xml = ax
    self.update_column(:current_assessment_xml_id, ax.id)

    # set values from xml
    if parsed_xml(xml)
      self.identifier ||= @parsed_xml.ident
      self.title ||= @parsed_xml.title
    end

  end

  def remove_questions_for_guid!(guid)
    if (self.current_assessment_xml)
      self.xml_file = AssessmentXml.remove_questions_for_guid(self.current_assessment_xml.xml, guid)
    end
  end

  def parsed_xml(xml = nil)
    @parsed_xml ||= AssessmentParser.parse(xml).first if xml.present?
    @parsed_xml
  end

  def default_settings
    @settings ||= self.assessment_settings.any? ? self.assessment_settings.first : nil
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

  def summative?
    self.kind == 'summative'
  end

  def formative?
    self.kind == 'formative'
  end

  def practice?
    self.kind == 'practice'
  end

  def swyk?
    self.kind == 'show_what_you_know'
  end

  def section_count
    parse_counts
    @section_count
  end

  def question_count
    parse_counts
    @question_count
  end

  # parse the QTI and count how any questions there are
  # todo: do this at create/update time
  def parse_counts
    return if @section_count || @question_count

    node = Nokogiri::XML(xml_with_answers)
    @section_count = node.css('section section').count
    if default_settings && default_settings[:per_sec]
      @question_count = @section_count * default_settings[:per_sec].to_i
    else
      @question_count = node.css('item').count
    end
  end

end
