import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';

export const CustomSelect = ({
  name,
  value,
  options,
  disabled,
  onChange,
  placeholder,
  wrapperStyles,
  wrapperClassName,
}) => {
  const handleChange = (value) => {
    onChange(name, value);
  };

  const customStyles = {
    container: (provided) => {
      return {
        ...provided,
        minHeight: 31,
        height: 'auto',
      };
    },
    control: (provided, state) => {
      const backgroundColor = state.isDisabled
        ? '#e9ecef'
        : provided.backgroundColor;
      const boxShadow = state.isFocused ? 'none' : provided.isFocused;
      const border = state.isFocused
        ? '1px solid #66afe9'
        : '1px solid #dee2e6';
      const padding = (state) => {
        if (!state.isMulti) {
          return '0 0 0 6px';
        } else {
          if (state.hasValue) {
            return '0 0 0 2px';
          } else {
            return '0 0 0 6px';
          }
        }
      };
      return {
        ...provided,
        fontSize: 14,
        minHeight: 29,
        height: 'auto',
        backgroundColor,
        border,
        borderRadius: 0,
        padding: padding(state),
        boxShadow,
      };
    },
    valueContainer: (provided) => {
      return {
        ...provided,
        minHeight: 20,
        alignItems: 'flex-start',
        padding: '0px 0px',
      };
    },
    multiValue: (provided) => ({
      ...provided,
      height: 24,
      borderRadius: 0,
      backgroundColor: '#F2F4FF',
      border: '1px solid #D0D7EA',
      margin: '3px 2px',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      padding: '2px 6px',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      borderRadius: 0,
      cursor: 'pointer',
    }),
  };

  return (
    <div style={wrapperStyles} className={wrapperClassName}>
      <Select
        isDisabled={disabled}
        name={name}
        value={options.find(({ value: v }) => value === v)}
        onChange={handleChange}
        placeholder={placeholder}
        classNamePrefix="react-select-custom"
        options={options}
        styles={customStyles}
      />
    </div>
  );
};

CustomSelect.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  wrapperClassName: PropTypes.string,
  disabled: PropTypes.bool,
  wrapperStyles: PropTypes.shape({}),
};
