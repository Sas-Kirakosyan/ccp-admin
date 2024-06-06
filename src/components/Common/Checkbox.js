import React from 'react';
import { Input } from 'reactstrap';
import PropTypes from 'prop-types';

import InfoPopover from './InfoPopover';

const Checkbox = ({
  id,
  name,
  label,
  checked,
  disabled,
  className,
  hasPopover,
  popoverDesc,
  handleCheck,
  popoverTarget,
}) => {
  return (
    <div className={'checkbox c-checkbox ' + className}>
      <label className="mb-0 align-items-center flex-nowrap d-flex">
        <Input
          name={name}
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={handleCheck}
        />
        <span className="fa fa-check" />
        <label
          htmlFor={id}
          className={
            'checkbox-label text-nowrap' + (hasPopover ? ' popover-label' : '')
          }
          id={popoverTarget}
        >
          {label}
        </label>
      </label>

      {hasPopover && (
        <InfoPopover
          targetId={popoverTarget}
          placement="top"
          title={label}
          desc={popoverDesc}
        />
      )}
    </div>
  );
};

export default Checkbox;

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  label: PropTypes.string,
  checked: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  hasPopover: PropTypes.bool,
  popoverDesc: PropTypes.string,
  handleCheck: PropTypes.func,
  popoverTarget: PropTypes.string,
};
