module NokogiriHelpers
  def retrieve_children_elements(node)
    node.children.select { |child| child.element? }
  end
end