"use strict";

import React              from 'react';
import TestUtils          from 'react/lib/ReactTestUtils';
import Checkbox           from './checkbox';
import StubContext        from '../../../specs_support/stub_context'; 

describe('checkbox', function() {
  
  var checkboxDOM;
  var checkbox;

  beforeEach(function() {
    var Subject = StubContext(Checkbox, {});
    var result = TestUtils.renderIntoDocument(<Subject />);
    checkboxDOM = React.findDOMNode(result);
    checkbox = result.originalComponent();
  });

  it('renders the checkbox', function() {
    expect(checkboxDOM).toBeDefined();
  });

  it('Calls handleCheck when the checkbox is checked', function() {
    spyOn(checkbox, 'handleCheck');
    TestUtils.Simulate.change(checkboxDOM.firstChild, {"checked": true});
    expect(checkbox.handleCheck).toHaveBeenCalled();
  });

});
