import React, { useEffect } from 'react';

import PropTypes from 'prop-types';

import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { observer } from 'mobx-react';

import applicationStore from '../../stores/applicationStore';
import Loading from '../Layout/Loading';
const { REACT_APP_AUTH0_AUDIENCE } = process.env;
const onRedirecting = () => <Loading />;

const Auth = observer(({ children }) => {
  const { getAccessTokenSilently, logout } = useAuth0();

  useEffect(() => {
    (async () => {
      try {
        const accessToken = await getAccessTokenSilently({
          audience: REACT_APP_AUTH0_AUDIENCE,
        });
        if (accessToken) {
          // Get access token
          sessionStorage.setItem('ccpAdminAccessToken', accessToken);
          const response = await applicationStore.appInit();
          // Logout user if signed with different Auth0 credentials
          if (response?.status === 401) {
            logout();
            sessionStorage.removeItem('ccpAdminAccessToken');
          } else {
            applicationStore.stopLoading();
          }
        } else {
          sessionStorage.removeItem('ccpAdminAccessToken');
          applicationStore.stopLoading();
        }
      } catch (e) {
        console.log(e);
        applicationStore.stopLoading();
      }
    })();
  }, [getAccessTokenSilently, logout]);

  return applicationStore.loading ? <Loading /> : children;
});

Auth.displayName = 'Authentication';

export const Authentication = withAuthenticationRequired(Auth, {
  onRedirecting,
});

Auth.propTypes = {
  children: PropTypes.node,
};
