import React    from 'react';
import Router   from 'react-router';

import Settings from './utils/settings';
import routes   from './routes';

var Route = Router.Route;

describe('default route', function () {
  it('renders assessment', function (done) {
    Router.run(routes, '/', function (Handler, state){
      var html = React.renderToString(<Handler params={state.params} settings={Settings.load()} />);
      expect(html).toMatch(/Home/);
      done();
    });
  });
});
