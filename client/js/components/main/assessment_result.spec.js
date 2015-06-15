import React              from 'react';
import TestUtils          from 'react/lib/ReactTestUtils';
import AssessmentResult   from './assessment_result';
import AssessmentActions from '../../actions/assessment';

describe('assessment result', function() {
  
  beforeEach(() => {
    jasmine.clock().install();
    jasmine.Ajax.install();
    AssessmentActions.submitAssessment("100", 0, "questions", "answers");
    jasmine.Ajax.requests.mostRecent().respondWith({
      "status"        : 200,
      "contentType"     : "text/plain",
      "responseText" : JSON.stringify({score: "100", feedback: "you did good"})     
    });
    jasmine.clock().tick(); // Advance the clock to the next tick
  });
  
  afterEach(() => {
      jasmine.clock().uninstall();
      jasmine.Ajax.uninstall();
  });

  it('renders the assessment result', function(){

    var result = TestUtils.renderIntoDocument(<AssessmentResult />);
    var content = React.findDOMNode(result).textContent;
    expect(content.length > 0).toBe(true);
  });
});