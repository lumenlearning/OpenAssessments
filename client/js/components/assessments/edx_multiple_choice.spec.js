import React                 from 'react';
import TestUtils             from 'react/lib/ReactTestUtils';
import EdxMultipleChoice     from './edx_multiple_choice';

describe('edx multiple choice', function() {

  var item = {
    messages: ["My Message1", "My Message2"],
    isGraded: false,
    title: "The edx title",
    question: "The edx question",
    solution: ""
  };

  var answeredItem = {
    messages: ["My Message1", "My Message2"],
    isGraded: true,
    title: "The edx title",
    question: "The edx question",
    solution: "The edx solution"
  }
  var result = TestUtils.renderIntoDocument(<EdxMultipleChoice item={item} />);

  it('renders the title', function() {
    expect(React.findDOMNode(result).textContent).toContain(item.title);
  });

  it('renders the messages', function() {
    expect(React.findDOMNode(result).textContent).toContain(item.messages[0]);
    expect(React.findDOMNode(result).textContent).toContain(item.messages[1]);
  });

  it('renders a message', function() {
    expect(React.findDOMNode(result).textContent).toContain(item.messages[0]);
  });

  it('renders the question', function() {
    expect(React.findDOMNode(result).textContent).toContain(item.question);
  });

  it('does not render the solution if the question is not answered', function() {
    expect(React.findDOMNode(result).textContent).toContain(item.solution);
  });

  it('renders the solution', function() {
    var result = TestUtils.renderIntoDocument(<EdxMultipleChoice item={answeredItem} />);
    expect(React.findDOMNode(result).textContent).toContain(answeredItem.solution);
  });
});
