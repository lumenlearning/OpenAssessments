import React    from 'react';
import Router   from 'react-router';

import Settings from './utils/settings';
import routes   from './routes';

var Route = Router.Route;

describe('default route', function () {
  it('renders assessment', function (done) {
    Router.run(routes, '/', function (Handler, state){
    	var globalSettings = {
    		srcUrl: "http://www.example.com"
    	}
    	var settings = Settings.load(globalSettings);
      var html = React.renderToString(<Handler params={state.params} settings={settings} />);
      expect(html).toMatch(/assessment/);
      done();
    });
  });
});
