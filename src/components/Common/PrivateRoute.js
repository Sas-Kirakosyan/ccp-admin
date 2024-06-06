import React from 'react';

import PropTypes from 'prop-types';

import { Route } from 'react-router-dom';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import Loading from '../Layout/Loading';

const PrivateRoute = ({ component, ...args }) => {
  return (
    <Route
      component={withAuthenticationRequired(component, {
        onRedirecting: () => <Loading />,
      })}
      {...args}
    />
  );
};

export default PrivateRoute;

PrivateRoute.propTypes = {
  component: PropTypes.instanceOf(Object),
  args: PropTypes.instanceOf(Object),
};
