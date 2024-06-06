import React from 'react';
import PropTypes from 'prop-types';

export const PermissionsCell = ({ permissions }) => {
  if (permissions) {
    return (
      <div className="d-flex flex-wrap w-100 h-100">
        {permissions?.map((permission, i) => {
          return (
            <span key={i} className="highlight-word m-1">
              {permission.resource}:{permission.action}
            </span>
          );
        })}
      </div>
    );
  } else {
    return <td></td>;
  }
};

PermissionsCell.propTypes = {
  permissions: PropTypes.instanceOf(Array),
};
