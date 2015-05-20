import React              from 'react';
import TestUtils          from 'react/lib/ReactTestUtils';
import Checkbox          from './checkbox';

describe('checkbox', function() {

  it('renders the checkbox', function() {
 
    var result = TestUtils.renderIntoDocument(<Checkbox />);
     
    console.log(result)
    expect(result).toBeDefined();
    console.log(result.refs.checkbox.refs.enhancedSwitch.refs.checkbox);
    spyOn(result, 'handleCheck');
    // TestUtils.Simulate.click(result.refs.checkbox.refs.enhancedSwitch.refs.checkbox);
    // expect(result.handleCheck).toHaveBeenCalled();


  });
});