import React              from 'react';
import TestUtils          from 'react/lib/ReactTestUtils';
import QTIMultipleChoice  from './qti_multiple_choice';

describe('qti multiple choice', function() {

  var items = [
  	{
  		id: 1,
      name: "QTI Multiple Choice",
    	material: "The multiple choice label"
  	},
  	{
  		id: 2,
      name: "QTI Multiple Choice 2",
    	material: "The multiple choice label 2"
  	}
  ];
  var result = TestUtils.renderIntoDocument(<QTIMultipleChoice items={items} />);

  it('renders the radio button label', function() {
    expect(React.findDOMNode(result).textContent).toContain(items[0].material);
  });

  it('renders input attributes', function() {
    expect(React.findDOMNode(result).childNodes[0].childNodes[0].childNodes[0].attributes.name.value).toContain(items[0].name);
  });

});
