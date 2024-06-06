import React from 'react';

import PropTypes from 'prop-types';

import { MoonLoader } from 'react-spinners';

const LoadingOverlay = ({ extraClass }) => {
  return (
    <div className={`spinner-wrapper ${extraClass}`}>
      <MoonLoader color="#506D9B" size={25} />
    </div>
  );
};

export default LoadingOverlay;

LoadingOverlay.propTypes = {
  extraClass: PropTypes.string,
};
