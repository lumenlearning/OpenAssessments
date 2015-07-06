import React              from 'react';
import Router             from 'react-router';
import routes             from './routes';
// import SettingsActions    from '../../actions/settings';
// import UserActions        from '../actions/user';

// var Route = Router.Route;

// describe('Logged in', function () {

//  helpStubAjax(SettingsActions);

//   UserActions.login({
//     data: {
//       body: {
//         email: "joe@example.com",
//         displayName: "joe",
//         jwt_token: "asdf"
//       }
//     }
//   });
//   jasmine.clock().tick(); // Advance the clock to the next tick
  localStorage.setItem('jwt', "asdfsd");


  describe('default route', function () {
    it('renders home', function (done) {
      Router.run(routes, '/', function (Handler, state){
        var html = React.renderToString(<Handler params={state.params} />);
        expect(html).toMatch(/Home/);
        done();
      });
    });
  });

});