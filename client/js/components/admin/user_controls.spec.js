"use strict";

import React              from 'react';
import TestUtils          from 'react/lib/ReactTestUtils';
import UserControls       from './user_controls';
import StubContext        from '../../../specs_support/stub_context'; 

describe('user_controls', function() {
  helpStubAjax(SettingsActions);

  var Subject;
  var result;

  beforeEach(()=>{
    Subject = StubContext(UserControls);
    result = TestUtils.renderIntoDocument(<Subject />);
  });

  it("renders user controls", function() {
    expect(React.findDOMNode(result).textContent).toBeDefined();
  });

  afterEach(()=>{
    React.unmountComponentAtNode(React.findDOMNode(result).parentNode)
  });
  
});