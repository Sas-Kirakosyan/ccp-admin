import React from 'react';

import PropTypes from 'prop-types';

const RadioButton = ({
  id,
  name,
  value,
  onChange,
  checked,
  className = '',
  label,
}) => {
  return (
    <label className={`radio-checkbox-container ${className}`} htmlFor={id}>
      <input
        data-testid="radio"
        id={id}
        type="radio"
        checked={checked}
        value={value}
        name={name}
        onChange={() => onChange(name)}
      />
      <span className="checkmark"></span>
      <span className="option-name text-nowrap">{label}</span>
    </label>
  );
};

export default RadioButton;

RadioButton.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  checked: PropTypes.bool,
  className: PropTypes.string,
  label: PropTypes.string,
};
