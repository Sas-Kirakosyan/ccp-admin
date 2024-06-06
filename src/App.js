import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import history from './history';

import { ToastContainer } from 'react-toastify';

import Base from './components/Layout/Base';
import Admin from './components/Admin/Admin';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-ladda-button/dist/ladda.min.css';
import 'react-toastify/dist/ReactToastify.css';

import './styles/app.scss';

import 'sweetalert2/dist/sweetalert2.min.css';

import PrivateRoute from './components/Common/PrivateRoute';
import AppPing from './components/Common/AppPing';
import Auth0ProviderWithHistory from './auth0-provide-with-history';
import NotFound from './components/Layout/404';
import { Authentication } from './components/hocs/Authentication';

const App = () => {
  return (
    <Router history={history}>
      <AppPing>
        <Auth0ProviderWithHistory>
          <Authentication>
            <Base>
              <Switch>
                <Route
                  exact
                  path="/"
                  component={() => <Redirect to="/admin" />}
                />
                <PrivateRoute path="/admin" component={Admin} />
                <Route
                  render={() => <NotFound className={'not-found-overlay'} />}
                />
              </Switch>
              <ToastContainer />
            </Base>
          </Authentication>
        </Auth0ProviderWithHistory>
      </AppPing>
    </Router>
  );
};

export default App;
