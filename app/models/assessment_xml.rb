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

  def self.move_questions_from_source_section!(source_doc, source_section, destination_doc, guid)
    if source_section.to_s =~ /#{guid}/ # is the guid present in this section's xml?
      dest_root_section = root_section(destination_doc)
      if root_section_contains_child_sections?(destination_doc)
        destination_section = create_mirror_section!(source_doc, source_section, dest_root_section, guid)
      else
        destination_section = dest_root_section
      end
      move_items(source_section, destination_section, guid)
    end
  end

  def self.root_section_contains_child_sections?(doc)
    doc.css('section section').any?
  end

  def self.create_mirror_section!(source_document, source_section, destination_root_section, guid)
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
    destination_root_section.children.last.next = mirror_section
    mirror_section
  end

  def self.move_questions_for_guid(source_xml, destination_xml, guid)
    node = Nokogiri::XML(source_xml)

    if node.css('section section').any?
      node.css('section section').each do |section|
        remove_items_from_section(section, guid)
      end
    else
      node.css('section').each do |section|
        remove_items_from_section(section, guid)
      end
    end

    # after moving items, remove section if section is now empty
    if node.css('section section').any?
      node.css('section section').each do |section|
        unless section.css('item').any?
          section.remove
        end
      end
    end

    node.to_xml
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
            if metafield.css('fieldentry').children.to_s == guid.to_s && item.parent
              section = item.parent
              # remove item with given outcome guid
              section.unlink # remove from source
              destination_section.children.last.next = section # and add to destination
            end
          end
        end
      end
    end
  end
end
