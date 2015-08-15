import React    from 'react';
import Router   from 'react-router';
import AssessmentActions from "./actions/assessment";
import SettingsActions from "./actions/settings";

import Routes   from './routes';

var Route = Router.Route;

describe('default route', function () {
  var srcData;
  var settings;
  beforeAll(function(){
    jasmine.getFixtures().fixturesPath = "base/fixtures/";
    srcData = readFixtures("text.xml");
    settings = {
      assessmentKind: "formative",
      srcUrl: "asdf",
      images: {}
    };

  });
  beforeEach(()=>{
    jasmine.clock().install();
    AssessmentActions.loadAssessment(settings, srcData);
    jasmine.clock().tick();
    SettingsActions.load(settings);
    jasmine.clock().tick();
  })

  afterEach(() => {
      jasmine.clock().uninstall();
  });

  it('renders assessment', function (done) {
    Router.run(Routes, '/', function (Handler, state) {
    	var globalSettings = {
    		srcUrl: "http://www.example.com"
    	}
    	var html = React.renderToString(<Handler params={state.params} />);
      expect(html).toMatch(/start/);
      done();
    });
  });

});
