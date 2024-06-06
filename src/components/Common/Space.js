import React from 'react';
import PropTypes from 'prop-types';

const Space = ({ width }) => {
  return <span style={{ display: 'inline-block', width: `${width}px` }}></span>;
};

export default Space;

Space.propTypes = {
  width: PropTypes.number.isRequired,
};
