class AssessmentXml < ActiveRecord::Base
  belongs_to :assessment

  store_accessor :data, :section_count, :item_count

  scope :by_newest, -> { order(created_at: :desc) }
  scope :summative, -> { where(kind: 'summative') }
  scope :formative, -> { where(kind: 'formative') }
  scope :qti, -> { where(kind: 'qti') }

  def self.by_kind(kind)
    where(kind: kind)
  end

  def xml_with_limited_questions(per_section, selected_item_ids=nil)
    AssessmentXml.xml_with_limited_questions(self.xml, per_section, selected_item_ids)
  end

  def no_answer_xml_with_limited_questions(per_section, selected_item_ids=nil)
    AssessmentXml.xml_with_limited_questions(self.no_answer_xml, per_section, selected_item_ids)
  end

  def self.xml_with_limited_questions(xml, per_section, selected_item_ids=nil)
    node = Nokogiri::XML(xml)

    if node.css('section section').any?
      node.css('section section').each do |s|
        while s.css('item').count > per_section
          s.css('item')[rand(s.css('item').count)].remove
        end
      end
    else
      node.css('section').each do |s|
        while s.css('item').count > per_section
          s.css('item')[rand(s.css('item').count)].remove
        end
      end
    end

    if selected_item_ids
      node.css('item').each do |item|
        selected_item_ids << item['ident']
      end
    end

    node.to_xml
  end

  def self.remove_questions_for_guid(xml, guid)
    node = Nokogiri::XML(xml)

    # We expect an xml structure like ...
    # <section>
    #     <section><item /></section>
    # </section>
    if node.css('section section').any?
      node.css('section section').each do |section|
        remove_items_from_section(section, guid)
      end
    # But sometimes the xml structure can be just one "section" deep ...
    # <section>
    #     <item />
    # </section>
    else
      node.css('section').each do |section|
        remove_items_from_section(section, guid)
      end
    end

    # after removing items, remove section if section is now empty
    if node.css('section section').any?
      node.css('section section').each do |section|
        unless section.css('item').any?
          section.remove
        end
      end
    end

    node.to_xml
  end

  # Remove all items from a given section for a given outcome guid
  #
  # Inside a section, we expect an xml structure like...
  # <item>
  #   <itemmetadata>
  #     <qtimetadata>
  #       ...
  #       <qtimetadatafield>
  #         <fieldlabel>outcome_guid</fieldlabel>
  #         <fieldentry>12345678-cd69-46f6-807a-asdfghjkl666</fieldentry>
  #       </qtimetadatafield>
  #       ...
  #     </qtimetadata>
  #   </itemmetadata>
  # </item>
  def self.remove_items_from_section(section, guid)
    if section.css('item').any?
      section.css('item').each do |item|
        if item.css('itemmetadata qtimetadata qtimetadatafield').any?
          item.css('itemmetadata qtimetadata qtimetadatafield').each do |metafield|
            if metafield.css('fieldentry').children.to_s == guid.to_s
              # remove item with given outcome guid
              item.remove
            end
          end
        end
      end
    end
  end

  def self.clear_empty_child_sections!(doc)
    if root_section_contains_child_sections?(doc)
      doc.css('section section').each do |section|
        unless section.css('item').any?
          section.remove
        end
      end
    end
  end

  def self.root_section(doc)
    doc.css('assessment > section').first
  end

  def self.move_questions_to_different_section_for_guid(source_xml_string, destination_xml_string, guid, after_guid = nil)
    source_doc = Nokogiri::XML(source_xml_string)
    destination_doc = Nokogiri::XML(destination_xml_string)

    if root_section_contains_child_sections?(source_doc)
      source_doc.css('section section').each do |source_section|
        move_questions_from_source_section!(source_doc, source_section, destination_doc, guid, after_guid)
      end
      clear_empty_child_sections!(source_doc)
    else
      source_section = root_section(source_doc)
      move_questions_from_source_section!(source_doc, source_section, destination_doc, guid, after_guid)
    end
    return source_doc.to_xml, destination_doc.to_xml
  end

  def self.is_section_for?(section, guid)
    section.to_s =~ /#{guid}/
  end

  def self.move_questions_from_source_section!(source_doc, source_section, destination_doc, guid, after_guid)
    if is_section_for?(source_section, guid) # is the guid present in this section's xml?
      dest_root_section = root_section(destination_doc)
      if root_section_contains_child_sections?(destination_doc)
        destination_section = create_mirror_section!(source_doc, source_section, dest_root_section, guid, after_guid)
      else
        destination_section = dest_root_section
      end
      move_items(source_section, destination_section, guid)
    end
  end

  def self.root_section_contains_child_sections?(doc)
    doc.css('section section').any?
  end

  def self.find_mirror_section_position(root_section, after_guid)
    if after_guid && after_guid.size > 0
      after_guid_sections = root_section.children.select { |section| is_section_for?(section, after_guid) }
      if !after_guid_sections.nil? && !after_guid_sections.empty?
        return after_guid_sections.last
      end
    end
    return root_section.children.first # if no after_guid or the after_guid's home section could not be found,
                                       # simply return the first child
  end

  def self.create_mirror_section!(source_document, source_section, destination_root_section, guid, after_guid)
    mirror_section = Nokogiri::XML::Node.new "section", source_document
    if source_section['ident']
      if source_section['ident'] == "root_section"
        mirror_section['ident'] = "copy_for_#{guid}"
      else
        mirror_section['ident'] = source_section['ident']
      end
    end
    if source_section['title']
      mirror_section['title'] = source_section['title']
    end
    insertion_point = find_mirror_section_position(destination_root_section, after_guid)
    insertion_point.next = mirror_section
    mirror_section
  end

  # Moves all items from a given section for a given outcome guid to another section
  #
  # Inside a section, we expect an xml structure like...
  # <item>
  #   <itemmetadata>
  #     <qtimetadata>
  #       ...
  #       <qtimetadatafield>
  #         <fieldlabel>outcome_guid</fieldlabel>
  #         <fieldentry>12345678-cd69-46f6-807a-asdfghjkl666</fieldentry>
  #       </qtimetadatafield>
  #       ...
  #     </qtimetadata>
  #   </itemmetadata>
  # </item>
  def self.move_items(source_section, destination_section, guid)
    if source_section.css('item').any?
      source_section.css('item').each do |item|
        if item.css('itemmetadata qtimetadata qtimetadatafield').any?
          item.css('itemmetadata qtimetadata qtimetadatafield').each do |metafield|
            if metafield.css('fieldentry').children.to_s == guid.to_s
              # remove item with given outcome guid
              item.unlink # remove from source
              item.default_namespace = "http://www.imsglobal.org/xsd/ims_qtiasiv1p2"
              destination_section.add_child(item)
            end
          end
        end
      end
    end
  end

  def self.move_questions_within_same_section_for_guid(xml_string, guid, after_guid = nil)
    doc = Nokogiri::XML(xml_string)
    root = root_section(doc)

    # find section for guid
    moving_section = root.children.find { |section| is_section_for?(section, guid) }
    if moving_section
      moving_section.unlink
      moving_section.default_namespace = "http://www.imsglobal.org/xsd/ims_qtiasiv1p2"

      if after_guid && after_guid.size > 0
        destination_sections = root.children.select { |section| is_section_for?(section, after_guid) }
        if !destination_sections.nil? && !destination_sections.empty?
          destination_sections.last.next = moving_section
        else
          root.children.before(moving_section)
        end
      else
        # not after, so it must be first
        root.children.before(moving_section)
      end
    end

    return doc.to_xml
  end
end
