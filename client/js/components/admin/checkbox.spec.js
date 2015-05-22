"use strict";

import React              from 'react';
import TestUtils          from 'react/lib/ReactTestUtils';
import Checkbox           from './checkbox';

describe('checkbox', function() {
  var checkbox;

  beforeEach(function() {
    checkbox = TestUtils.renderIntoDocument(<Checkbox />);
  });

  it('renders the checkbox', function() {
    expect(checkbox).toBeDefined();
  });

  it('Calls handleCheck when the checkbox is checked', function() {
    spyOn(checkbox, 'handleCheck');
    TestUtils.Simulate.change(checkbox.getDOMNode().firstChild, {"checked": true});
    expect(checkbox.handleCheck).toHaveBeenCalled();
  });
});
