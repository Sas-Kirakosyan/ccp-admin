import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';

import AppUnavailable from './AppUnavailable';
import Loading from '../Layout/Loading';
import { ping } from '../../services/applicationService';

const AppPing = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isServiceAvailable, setIsServiceAvailable] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await ping();
        setIsServiceAvailable(true);
      } catch (error) {
        setIsServiceAvailable(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return isServiceAvailable ? children : <AppUnavailable />;
};

export default AppPing;

AppPing.propTypes = {
  children: PropTypes.node.isRequired,
};
