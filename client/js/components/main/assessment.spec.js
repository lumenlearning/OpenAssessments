import React              from 'react';
import TestUtils          from 'react/lib/ReactTestUtils';
import Assessment         from './assessment';
import StubContext        from '../../../specs_support/stub_context';
import AssessmentActions from '../../actions/assessment';

describe('assessment', function() {
  var result;

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.Ajax.install();
    AssessmentActions.submitAssessment("100", 0, "questions", "answers");
    jasmine.Ajax.requests.mostRecent().respondWith({
      "status"        : 200,
      "contentType"     : "text/plain",
      "responseText" : "{}"     
    });
    jasmine.clock().tick();
    var subject = StubContext(<Assessment />, null, null);
    result = TestUtils.renderIntoDocument(<subject />);
  });
  
  afterEach(() => {
    // becuase if the component stays mounted and the store changes it rerenders and fails other tests
    React.unmountComponentAtNode(React.findDOMNode(result).parentNode)
    jasmine.clock().uninstall();
    jasmine.Ajax.uninstall();
  });

  it('renders the assessment', function(){
    expect(result).toBeDefined();
  });
});