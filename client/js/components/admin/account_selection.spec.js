"use strict";

import React              from 'react';
import TestUtils          from 'react/lib/ReactTestUtils';
import AccountSelection   from './account_selection';
import SettingsActions    from '../../actions/settings';
import StubContext        from '../../../specs_support/stub_context'; 

describe('account_selection', function() {
  // TO RUN MORE TESTS YOU WILL HAVE TO SIMULATE LOGGING IN

  helpStubAjax(SettingsActions);

  it('renders account selection page', function() {
    localStorage.setItem('jwt', "asdfasdfasf");
    var Subject = StubContext(AccountSelection, {});
    var result = TestUtils.renderIntoDocument(<Subject />);
    expect(React.findDOMNode(result).textContent).toContain("Account");
    localStorage.removeItem('jwt');
  });

  it('does not render the page if you are not logged in', function() {
    var Subject = StubContext(AccountSelection, {});
    var result = TestUtils.renderIntoDocument(<Subject />);
    expect(React.findDOMNode(result).textContent).not.toContain("Account");
  });

});