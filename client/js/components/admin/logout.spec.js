"use strict";

import React              from 'react';
import TestUtils          from 'react/lib/ReactTestUtils';
import Logout             from './logout';
import StubRouterContext  from '../../../specs_support/stub_router_context'; 

describe('logout', function() {
  var Context;
  var logout;

  beforeEach(function(){
    Context = StubRouterContext(Logout);
    logout = TestUtils.renderIntoDocument(<Context />);
  });
  
  it("renders the logout page", function() {
    expect(logout).toBeDefined();
  });
  
});