"use strict";

import React            from 'react';
import TestUtils        from 'react/lib/ReactTestUtils';
import AccountsActions  from '../../actions/admin';
import AccountsStore    from "../../stores/accounts";
import AccountDashboard from './account_dashboard';
import SettingsActions  from '../../actions/settings';
import StubContext      from '../../../specs_support/stub_context';

describe('account_dashboard', function() {
  var accountId = 1;
  var Subject = new StubContext(AccountDashboard, {params: {accountId: accountId}});
  var dashboard;
  var currentAccountName;
  var currentAccount;

  helpStubAjax(SettingsActions, 'account dashboard');

  beforeEach(()=>{
    AccountsActions.loadAccounts();
    // jasmine.Ajax.requests.mostRecent().respondWith({
    //   "status"        : 200,
    //   "contentType"     : "text/plain",
    //   "responseText" : JSON.stringify([{canvas_uri: "https://canvas.instructure.com",
    //     code: "canvasstarterapp",
    //     created_at: "2015-05-08T19:06:02.755Z",
    //     domain: "canvasstarterapp.ngrok.io",
    //     id: 1, lti_key: "canvasstarterapp",
    //     lti_secret: "d52ca2c9892975bbb9def56e68eefe8e92a338d9b74d73ec5dad64803a376b2f1f5129c0bd9f7e73684526c234e0835bd1635e09d427cd45cb0de4296278682f",
    //     name: "Canvas Stater App",
    //     updated_at: "2015-05-08T19:06:02.755Z"}])
    // });

    jasmine.clock().tick();
    dashboard = TestUtils.renderIntoDocument(<Subject />);
    //AccountsActions.loadAccounts();
     // Advance the clock to the next tick
    currentAccount = AccountsStore.accountById(accountId);
    currentAccountName = currentAccount.name;
  });
  
  it('renders the account dashboard', function() {
    expect(dashboard).toBeDefined();
  });

  it('renders the account name', function() {
    var result = TestUtils.renderIntoDocument(<Subject />);
    expect(React.findDOMNode(result).textContent).toContain(currentAccountName);
  });


});
