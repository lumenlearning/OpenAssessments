import React    from 'react';
import Router   from 'react-router';

import AccountsStore   from './accounts';
import AccountsActions from '../actions/admin_accounts';
import SettingsActions from '../actions/settings';
import Dispatcher      from '../dispatcher';

describe('AccountsStore', () => {

  var defaultSettings = {
    apiUrl: "http://www.example.com/api"
  };

  beforeEach(() => {
    SettingsActions.load(defaultSettings);
    jasmine.Ajax.install();
    jasmine.clock().install(); // Mock out the built in timers
  });

  afterEach(() => {
    jasmine.Ajax.uninstall();
    jasmine.clock().uninstall();
  });
  
  describe("", () => {

    beforeEach(() => {
      AccountsActions.loadAccounts();
      jasmine.clock().tick(); // Advance the clock to the next tick
    });

    describe("current", () => {
      it("returns current accounts", (done) => {
        var accounts = AccountsStore.current();
        // TODO test accounts by providing mock data to jasmine which can then be loaded.
        done();
      });
    });

  });

});
