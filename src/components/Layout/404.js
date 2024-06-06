import React from 'react';
import PropTypes from 'prop-types';

const NotFound = ({ className }) => {
  return (
    <div
      className={`d-flex w-100 h-100 align-items-center justify-content-center ${className}`}
    >
      <div className="border p-5 d-flex flex-column align-items-center justify-content-center">
        <h1 className="mb-1 font-weight-bold">404</h1>
        <h4>Page not found</h4>
      </div>
    </div>
  );
};

export default NotFound;

NotFound.propTypes = {
  className: PropTypes.string,
};
