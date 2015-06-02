import React              from 'react';
import TestUtils          from 'react/lib/ReactTestUtils';
import QTIMultipleChoice  from './qti_multiple_choice';

describe('qti multiple choice', function() {

  var result;
  var items = [
  	{
  		id: 1,
    	material: "The multiple choice label",
      messages: {'message0.1', 'message0.2', 'message0.3'}
  	},
  	{
  		id: 2,
    	material: "The multiple choice label 2",
      messages: {'message1.1', 'message1.2', 'message1.3'}
  	}
  ];

  beforeEach(()=>{
    result = TestUtils.renderIntoDocument(<QTIMultipleChoice items={items} />);
  });

  it('renders the radio button label', function() {
    expect(React.findDOMNode(result).textContent).toContain(items[0].material);
  });

  it('renders input attributes', function() {
    expect(React.findDOMNode(result).childNodes[0].childNodes[0].childNodes[0].attributes.name.value).toContain("answer-radio");
  });

});
