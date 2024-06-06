import React from 'react';

import PropTypes from 'prop-types';

import Select from 'react-select';

const ReactSelectComponent = ({
  isMulti,
  isDisabled,
  placeholder,
  value,
  onChange,
  options,
  className,
}) => {
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
      const border = state.isFocused ? '1px solid red' : '1px solid red';
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
    <Select
      className={'react-select ' + className}
      classNamePrefix={'react-select'}
      styles={customStyles}
      isMulti={isMulti}
      isDisabled={isDisabled}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      options={options}
    />
  );
};

export default ReactSelectComponent;

ReactSelectComponent.propTypes = {
  isMulti: PropTypes.bool,
  isDisabled: PropTypes.bool,
  placeholder: PropTypes.string,
  value: PropTypes.instanceOf(Object),
  onChange: PropTypes.func,
  options: PropTypes.instanceOf(Array),
  className: PropTypes.string,
};
