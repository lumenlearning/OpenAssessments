module NokogiriHelpers
  def retrieve_children_elements(node)
    node.children.select { |child| child.element? }
  end

  def retrieve_child_sections(node)
    node.children.select { |child| child.name == "section" }
  end
end