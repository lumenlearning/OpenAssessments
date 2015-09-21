import React              from 'react';
import TestUtils          from '../../../node_modules/react/lib/ReactTestUtils';
import ItemResult         from './item_result';
import StubContext        from "../../../specs_support/stub_context";

describe('item result', function() {
  var question = {
    material: "Hello World",
    questionType: "multiple_answers_question",
    outcomes: {
      longOutcome: "Long",
      shorOutcome: "Short"
    }
  }
  var Subject = new StubContext(ItemResult, {question: question, isCorrect: true, confidence: "Just A Guess"});
  var result = TestUtils.renderIntoDocument(<Subject />);

  it('renders the Item result with correct answer', function() {
    expect(React.findDOMNode(result).textContent).toContain("Hello World");
    expect(React.findDOMNode(result).textContent).toContain("You were correct");
  });
  
  it('renders the Item result with incorrect answer', function() {
    Subject = new StubContext(ItemResult, {question: question, isCorrect: false, confidence: "Just A Guess"});
    result = TestUtils.renderIntoDocument(<Subject />);
    expect(React.findDOMNode(result).textContent).toContain("Hello World");
    expect(React.findDOMNode(result).textContent).toContain("You were incorrect");
  });

});