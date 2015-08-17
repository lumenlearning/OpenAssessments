import React              from 'react';
import TestUtils          from 'react/lib/ReactTestUtils';
import Item               from './item';
import StubContext        from '../../../specs_support/stub_context';

describe('item', function() {

  var question = {};
  var currentIndex = 0;
  
  var settings = {
    assessmentKind: "formative"
  };
  
  var assessment = {}
  var questionCount = 10;
  var Content = StubContext(Item, {question: question, currentIndex: currentIndex, settings: settings, questionCount: questionCount, assessment: assessment})
  var result = TestUtils.renderIntoDocument(<Content />);

  it('renders an item', function() {
    expect(React.findDOMNode(result).textContent).toContain("Choose ALL that apply");
  });
  
});