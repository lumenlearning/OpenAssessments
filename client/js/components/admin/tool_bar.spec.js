"use strict";

import React          from 'react';
import TestUtils      from 'react/lib/ReactTestUtils';
import ToolBar        from './tool_bar';

describe('toolBar', function(){
  var toolBar;

  beforeEach(function(){
    toolBar = TestUtils.renderIntoDocument(<ToolBar />);
  });
  it('It renders the toolbar', function(){
    expect(toolBar).toBeDefined();
  });

});