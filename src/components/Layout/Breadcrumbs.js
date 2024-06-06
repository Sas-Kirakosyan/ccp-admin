import React from 'react';

import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

const Breadcrumbs = ({
  items = [],
  withSettings,
  toggleSettingsPanel,
  className,
}) => {
  return (
    <div className={'breadcrumb-panel ' + className}>
      <ul className="breadcrumb">
        {items.map((item, index) => {
          return (
            <li key={index} className="breadcrumb-item">
              <Link to={item.href}>{item.name}</Link>
            </li>
          );
        })}
      </ul>

      {withSettings && (
        <div className="right-aside-toggle" onClick={toggleSettingsPanel}>
          <i className="fas fa-cog"></i>
        </div>
      )}
    </div>
  );
};

export default Breadcrumbs;

Breadcrumbs.propTypes = {
  items: PropTypes.instanceOf(Array),
  withSettings: PropTypes.bool,
  toggleSettingsPanel: PropTypes.func,
  className: PropTypes.string,
};
