import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const REDIRECT_TIMEOUT = 3;
const INTERVAL = 1000;

const AppUnavailable = () => {
  const [counter, setCounter] = useState(REDIRECT_TIMEOUT);
  const { logout } = useAuth0();

  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), INTERVAL);
    if (counter === 0) {
      logout();
    }

    return () => clearInterval(timer);
  }, [counter, logout]);

  return (
    <div className="app-unavailable">
      <i className="fas fa-exclamation-triangle mb-4"></i>
      <h4>Access denied!</h4>
      <p>Redirecting in: {counter}</p>
    </div>
  );
};

export default AppUnavailable;
