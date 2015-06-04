"use strict";

import React       from 'react';
import TestUtils   from 'react/lib/ReactTestUtils';
import Index       from './index';
import StubContext from '../../specs_support/stub_context';

describe('index', function() {
  it('renders the index', function() {
    var Subject = StubContext(Index, {});
    var result = TestUtils.renderIntoDocument(<Subject />);
    expect(React.findDOMNode(result)).toBeDefined();
  });
});