"use strict";

import React                  from 'react';
import TestUtils              from 'react/lib/ReactTestUtils';
import AccountDashboard       from './account_dashboard';
import StubRouterContext      from '../../../specs_support/stub_router_context'; 

describe('account_dashboard', function() {
  var Subject = StubRouterContext(AccountDashboard, {params: {accountId: '1'}});
  var dashboard;

  beforeEach(function(){
    //Context = StubRouterContext(AccountDashboard, {accountId: 1});
    dashboard = TestUtils.renderIntoDocument(<Subject />);
  });
  
  xit('renders the account dashboard', function() {
    expect(dashboard).toBeDefined();
  });

});
