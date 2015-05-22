import React              from 'react';
import TestUtils          from 'react/lib/ReactTestUtils';
import Checkbox           from './checkbox';

describe('checkbox', function() {

  it('renders the checkbox', function() {
    var result = TestUtils.renderIntoDocument(<Checkbox />);
    expect(result).toBeDefined();
    spyOn(result, 'handleCheck');
    console.log(result.refs.checkbox.refs.enhancedSwitch.refs.checkbox)
    var input = result.refs.checkbox.refs.enhancedSwitch.refs.checkbox;
    TestUtils.Simulate.click(input);
    expect(result.handleCheck).toHaveBeenCalled();
  });
});