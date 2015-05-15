import React    from 'react';
import Router   from 'react-router';

import Routes   from './routes';

var Route = Router.Route;

describe('default route', function () {

  it('renders assessment', function (done) {
    Router.run(Routes, '/', function (Handler, state) {
    	var globalSettings = {
    		srcUrl: "http://www.example.com"
    	}
    	var html = React.renderToString(<Handler params={state.params} />);
      expect(html).toMatch(/assessment/);
      done();
    });
  });

});
