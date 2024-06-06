import React from 'react';
import { useHistory } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';

import AppUnavailable from '../src/components/Common/AppUnavailable';

const Auth0ProviderWithHistory = ({ children }) => {
  const history = useHistory();

  const onRedirectCallBack = (appState) => {
    history.push(appState?.returnTo || window.location.pathname);
  };

  const {
    REACT_APP_AUTH0_DOMAIN,
    REACT_APP_AUTH0_CLIENT_ID,
    REACT_APP_AUTH0_AUDIENCE,
  } = process.env;

  if (
    decodeURIComponent(history.location.search).split('&')[0] ===
    '?error=unauthorized'
  ) {
    sessionStorage.removeItem('ccpAdminAccessToken');
    return (
      <Auth0Provider
        domain={REACT_APP_AUTH0_DOMAIN}
        clientId={REACT_APP_AUTH0_CLIENT_ID}
        audience={REACT_APP_AUTH0_AUDIENCE}
        redirectUri={window.location.origin + '/admin'}
        onRedirectCallback={onRedirectCallBack}
      >
        <AppUnavailable />
      </Auth0Provider>
    );
  }

  return (
    <Auth0Provider
      domain={REACT_APP_AUTH0_DOMAIN}
      clientId={REACT_APP_AUTH0_CLIENT_ID}
      audience={REACT_APP_AUTH0_AUDIENCE}
      redirectUri={window.location.origin + '/admin'}
      onRedirectCallback={onRedirectCallBack}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;
