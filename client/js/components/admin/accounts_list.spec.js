import React              from 'react';
import TestUtils          from 'react/lib/ReactTestUtils';
import AccountsList       from './accounts_list';
import StubRouterContext  from '../../../specs_support/stub_router_context'; 
describe('accounts_list', function() {
  
  it('renders the Accounts List', function() {
    var accounts = [{ id: '1', name: "TestName"}];
    var Subject = StubRouterContext(AccountsList, {menuItems: accounts });
    var result = TestUtils.renderIntoDocument(<Subject />);
    expect(result.getDOMNode().textContent).toContain("TestName");
  });

});