import React    from 'react';
import Router   from 'react-router';

import routes   from './routes';

var Route = Router.Route;

describe('default route', function () {
  it('renders home', function (done) {
    Router.run(routes, '/', function (Handler, state){
      var html = React.renderToString(<Handler params={state.params} />);
      expect(html).toMatch(/Home/);
      done();
    });
  });
});
