// @flow

import PropTypes from 'prop-types';
import Cleave from 'cleave.js/react';
import React, { useEffect, useRef, useState } from 'react';

const parseMask = (value: string): string => {
  return value.replace(/,/g, '');
};

const DecimalInput = ({
  className,
  value,
  onChange,
  disabled,
  onBlur,
  name,
  shouldFocus,
  min,
  max,
  numeralDecimalScale,
}) => {
  const [maskedValue, setMaskedValue] = useState(value);
  const inputRef = useRef<any>(null);

  const cleaveOptions = {
    numeral: true,
    numeralPositiveOnly: true,
    numeralThousandsGroupStyle: 'thousand',
    numeralDecimalScale,
  };
  const checkForMinMax = (value: number): boolean => {
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
    if (isNaN(value)) {
      return;
    }

    const floatValue = parseFloat(value);
    if (checkForMinMax(floatValue)) {
      inputRef.current.setRawValue(maskedValue);
      return;
    }
    onChange(name, floatValue);
  };

  return (
    <Cleave
      value={maskedValue}
      onChange={handleChange}
      onBlur={onBlur}
      ref={inputRef}
      name={name}
      autoComplete="off"
      disabled={disabled}
      options={cleaveOptions}
      className={`form-control ${className}`}
    />
  );
};

DecimalInput.defaultProps = {
  className: '',
  value: '',
  shouldFocus: false,
  disabled: false,
  min: 0,
  max: Number.MAX_SAFE_INTEGER,
  onBlur: () => {},
  numeralDecimalScale: 2,
};

DecimalInput.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: (PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]): React$PropType$Primitive<number | string>),
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  shouldFocus: PropTypes.bool,
  numeralDecimalScale: PropTypes.number,
};

export default React.memo(DecimalInput);
