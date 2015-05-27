import React              from 'react';
import TestUtils          from 'react/lib/ReactTestUtils';
import Item               from './item';

describe('loading', function() {

  var question = {};
  var currentIndex = 0;
  var settings = {};
  var questionCount = 10;

  var result = TestUtils.renderIntoDocument(<Item 
    question={question} 
    currentIndex={currentIndex} 
    settings={settings}
    questionCount={questionCount} />);

  it('renders an item', function() {
    expect(React.findDOMNode(result).textContent).toContain("1 of 10");
  });
  
});