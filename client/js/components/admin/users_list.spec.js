"use strict";

import React              from 'react';
import TestUtils          from 'react/lib/ReactTestUtils';
import UsersList          from './users_list';
import SettingsActions    from '../../actions/settings';
import StubContext        from '../../../specs_support/stub_context'; 

describe('users_list', function() {

  helpStubAjax(SettingsActions);

  it("renders the users list", function() {
    var params = { accountId: 1 };

    var Subject = StubContext(UsersList, { params: params });
    var result = TestUtils.renderIntoDocument(<Subject />);
    expect(React.findDOMNode(result).textContent).toContain("Users");
  });
  
});