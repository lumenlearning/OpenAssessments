import React              from 'react';
import TestUtils          from 'react/lib/ReactTestUtils';
import Start              from './start';
import StubContext        from '../../../specs_support/stub_context';
import SettingsActions    from '../../actions/settings';

describe('start', function() {
  var result;

  beforeEach(() => {
    var settings = {
      assessmentKind: "summative",
      srcUrl: "asdf",
      images: {}
    };
    jasmine.clock().install();
    jasmine.Ajax.install();
    SettingsActions.load(settings);
    // jasmine.Ajax.requests.mostRecent().respondWith({
    //   "status"        : 200,
    //   "contentType"     : "text/plain",
    //   "responseText" : "{}"     
    // });
    jasmine.clock().tick();
    jasmine.clock().tick();
    var subject = StubContext(<Start />, null, null);
    result = TestUtils.renderIntoDocument(<subject />);
  });
  
  afterEach(() => {

    jasmine.clock().uninstall();
    jasmine.Ajax.uninstall();
  });

  it('renders the start page', function(){
    expect(React.findDOMNode(result)).toBeDefined();
  });
});