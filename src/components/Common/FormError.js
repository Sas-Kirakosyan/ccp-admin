import React from 'react';
import PropTypes from 'prop-types';

import textContent from '../../data/const/textContent';

const FormError = ({ errorText, className, customStyles }) => (
  <span className={`text-danger text-sm ${className}`} style={customStyles}>
    {errorText}
  </span>
);

FormError.defaultProps = {
  errorText: textContent.errors.REQUIRED,
  className: '',
  customStyles: null,
};

FormError.propTypes = {
  errorText: PropTypes.string,
  className: PropTypes.string,
  customStyles: PropTypes.shape({}),
};

export default FormError;
