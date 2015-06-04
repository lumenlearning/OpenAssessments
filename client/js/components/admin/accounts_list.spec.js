"use strict";

import React              from 'react';
import TestUtils          from 'react/lib/ReactTestUtils';
import AccountsList       from './accounts_list';
import StubContext        from '../../../specs_support/stub_context'; 

describe('accounts_list', function() {
  
  it('renders the Accounts List', function() {
    var accounts = [{ id: '1', name: "TestName"}];
    var Subject = StubContext(AccountsList, { menuItems: accounts });
    var result = TestUtils.renderIntoDocument(<Subject />);
    expect(React.findDOMNode(result).textContent).toContain("TestName");
  });

});