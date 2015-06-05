"use strict";

import React       from 'react';
import TestUtils   from 'react/lib/ReactTestUtils';
import Page        from './page';
import StubContext from '../../../specs_support/stub_context';

describe('page', function() {
  it('renders the page', function() {
    var Subject = StubContext(Page, {});
    var result = TestUtils.renderIntoDocument(<Subject />);
    expect(React.findDOMNode(result)).toBeDefined();
  });
});