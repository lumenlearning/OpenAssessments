import React    from 'react';
import Router   from 'react-router';

import routes   from '../js/routes';
import Settings from '../js/utils/settings';

let Route = Router.Route;

describe('default route', function () {
  it('renders assessment', function (done) {
    Router.run(routes, '/', function (Handler, state){
      var html = React.renderToString(<Handler params={state.params} settings={Settings.load()} />);
      expect(html).toMatch(/Home/);
      done();
    });
  });
});
