import PropTypes from 'prop-types';
import Cleave from 'cleave.js/react';
import React, { useEffect, useRef, useState } from 'react';

const cleaveOptions = {
  numeral: true,
  numeralDecimalScale: 0,
  numeralPositiveOnly: true,
  numeralThousandsGroupStyle: 'thousand',
};

const parseMask = (value) => {
  return value.replace(/,/g, '');
};

const IntegerInput = ({
  className,
  value,
  onChange,
  onBlur,
  name,
  shouldFocus,
  min,
  max,
  style,
  disabled,
}) => {
  const [maskedValue, setMaskedValue] = useState(value);
  const inputRef = useRef(null);

  const checkForMinMax = (value) => {
    return value < min || value > max;
  };

  useEffect(() => {
    setMaskedValue(value);
  }, [value]);

  useEffect(() => {
    if (shouldFocus && inputRef.current) {
      inputRef.current.element.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    if (!e.currentTarget) {
      return;
    }

    const value = parseMask(e.currentTarget.value).trim();
    if (value === '') {
      onChange(name, '');
      setMaskedValue('');
      return;
    }

    const intValue = parseInt(value);
    if (checkForMinMax(intValue)) {
      inputRef.current.setRawValue(maskedValue);
      return;
    }
    onChange(name, intValue);
  };

  return (
    <Cleave
      disabled={disabled}
      style={style}
      value={maskedValue}
      onChange={handleChange}
      onBlur={onBlur}
      ref={inputRef}
      name={name}
      autoComplete="off"
      options={cleaveOptions}
      data-testid="integerInput"
      className={`form-control ${className}`}
    />
  );
};

IntegerInput.defaultProps = {
  className: '',
  value: '',
  shouldFocus: false,
  min: 0,
  max: Number.MAX_SAFE_INTEGER,
  onBlur: () => {},
  style: null,
  disabled: false,
};

IntegerInput.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  className: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  shouldFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  style: PropTypes.shape({}),
};

export default React.memo(IntegerInput);
