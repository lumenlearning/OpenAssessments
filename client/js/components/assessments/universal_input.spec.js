import React              from 'react';
import TestUtils          from 'react/lib/ReactTestUtils';
import UniveralInput      from './universal_input';
describe('universal_input', function() {

  var item = {
        id       : 0,
        url      : "www.iamcool.com",
        title    : "title",
        xml      : null,
        standard : 'edX',
        edXMaterial : "<p>hello world</p>",
        answers  : [{material: "test 1"}, {material: "test2"}],
        isGraded: true,
        question_type: "edx_multiple_choice" 
      };
  var result = TestUtils.renderIntoDocument(<UniveralInput item={item} />);



  it('renders the universal_input', function() {
    expect(React.findDOMNode(result)).toBeDefined();
  });

});