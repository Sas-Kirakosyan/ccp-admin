import React from 'react';

import PropTypes from 'prop-types';

import { NavLink } from 'react-router-dom';
import applicationStore from '../../stores/applicationStore';
import { observer } from 'mobx-react';

const AsidePanel = observer(({ onToggle, collapsed }) => {
  return (
    <aside className={'aside-panel aside-nav' + (!collapsed ? ' open' : '')}>
      <div className="pb-3">
        <div className="collapse-toggle" onClick={onToggle}>
          <i className="fas fa-bars"></i>
        </div>
        <ul className="aside-nav-list list-unstyled">
          <li className="aside-nav-list-item">
            <NavLink
              exact={true}
              className="sidebar-link"
              to="/admin/audit"
              activeClassName="active"
            >
              <i className="far fa-chart-bar"></i>
              {!collapsed && <span>Audit</span>}
            </NavLink>
          </li>

          {applicationStore.permissions.issuance?.view && (
            <li className="aside-nav-list-item">
              <NavLink
                className="sidebar-link"
                to="/admin/issuances"
                activeClassName="active"
              >
                <i className="fas fa-list"></i>
                {!collapsed && <span>Issuances</span>}
              </NavLink>
            </li>
          )}

          {applicationStore.permissions.user?.view && (
            <li className="aside-nav-list-item">
              <NavLink
                className="sidebar-link"
                to="/admin/users"
                activeClassName="active"
              >
                <i className="fas fa-users"></i>
                {!collapsed && <span>Users</span>}
              </NavLink>
            </li>
          )}

          {applicationStore.permissions.organization?.view && (
            <li className="aside-nav-list-item">
              <NavLink
                className="sidebar-link"
                to="/admin/orgs"
                activeClassName="active"
              >
                <i className="far fa-building"></i>
                {!collapsed && <span>Organizations</span>}
              </NavLink>
            </li>
          )}

          {applicationStore.permissions.role?.view && (
            <li className="aside-nav-list-item">
              <NavLink
                className="sidebar-link"
                to="/admin/roles"
                activeClassName="active"
              >
                <i className="fas fa-users-cog"></i>
                {!collapsed && <span>Roles</span>}
              </NavLink>
            </li>
          )}

          {applicationStore.permissions.permission?.view && (
            <li className="aside-nav-list-item">
              <NavLink
                className="sidebar-link"
                to="/admin/permissions"
                activeClassName="active"
              >
                <i className="fas fa-key"></i>
                {!collapsed && <span>Permissions</span>}
              </NavLink>
            </li>
          )}

          {applicationStore.permissions.job?.view && (
            <li className="aside-nav-list-item">
              <NavLink
                className="sidebar-link"
                to="/admin/jobs"
                activeClassName="active"
              >
                <i className="fas fa-tasks"></i>
                {!collapsed && <span>Jobs</span>}
              </NavLink>
            </li>
          )}
          {applicationStore.permissions.swagger?.view && (
            <li className="aside-nav-list-item">
              <NavLink
                exact={true}
                className="sidebar-link"
                to="/admin/swagger"
                activeClassName="active"
              >
                <i className="fas fa-link"></i>
                {!collapsed && <span>Swagger</span>}
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </aside>
  );
});

export default AsidePanel;

AsidePanel.propTypes = {
  onToggle: PropTypes.func,
  collapsed: PropTypes.bool,
};
