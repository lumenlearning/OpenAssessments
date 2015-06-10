require 'rails_helper'

describe Section do
  before do
    @xml = open('./spec/fixtures/section.xml').read
    assessment = FactoryGirl.create(:assessment)
    @section = Section.from_xml(@xml, assessment)
  end

  it 'should extract the identifier' do
    expect(@section.identifier).to eq 'S1002'
  end

  it 'should extract the items' do
    expect(@section.items.count).to eq 8
  end
end
