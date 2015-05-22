"use strict()";

import React                   from 'react';
import TestUtils               from 'react/lib/ReactTestUtils';
import EdxNumericInput         from './edx_numeric_input';

describe('edx numeric input', function() {

  var item = {
    title: "A title",
    question: "How much wood can a wood chuck, chuck.",
    messages: ["Message 1", "Message 2"],
    isGraded: false,
    solution: 'I rock'
  };
  var result = TestUtils.renderIntoDocument(<EdxNumericInput item={item} />);

  it('renders the title', function() {
    expect(React.findDOMNode(result).textContent).toContain(item.title);
  });

  it('renders the question', function() {
    expect(React.findDOMNode(result).textContent).toContain(item.question);
  });

  it('renders the messages', function() {
    expect(React.findDOMNode(result).textContent).toContain(item.messages[0]);
    expect(React.findDOMNode(result).textContent).toContain(item.messages[1]);
  });

  it('does not render the solution', function() {
    expect(React.findDOMNode(result).textContent).not.toContain(item.solution);
  });

});

describe('edx numeric input graded', function() {

  var item = {
    title: "A title",
    question: "How much wood can a wood chuck, chuck.",
    messages: ["Message 1", "Message 2"],
    isGraded: true,
    solution: 'I rock'
  };
  var result = TestUtils.renderIntoDocument(<EdxNumericInput item={item} />);

  it('renders the solution', function() {
    expect(React.findDOMNode(result).textContent).toContain(item.solution);
  });

});
