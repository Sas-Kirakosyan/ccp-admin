import React, { useState, Fragment, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  Button,
} from 'reactstrap';
import ToggleFullscreen from '../Common/ToggleFullscreen';
import { useAuth0 } from '@auth0/auth0-react';
import applicationStore from '../../stores/applicationStore';
import useClickOutside from '../Hooks/useClickOutside';

const Header = () => {
  const location = useLocation();

  const userSettingsRef = useRef();

  const { isAuthenticated, logout } = useAuth0();
  const [isOpen, setIsOpen] = useState(false);

  const [userDropdownVisible, setUserDropDownVisible] = useState(false);

  const toggleUserDropdown = () => {
    setUserDropDownVisible(!userDropdownVisible);
  };

  const toggle = () => setIsOpen(!isOpen);

  useClickOutside(userSettingsRef, () => {
    if (userDropdownVisible) {
      setUserDropDownVisible(false);
    }
  });

  return (
    <header className="base-header">
      <Navbar expand="md">
        <NavbarBrand href={!isAuthenticated ? '/' : '/admin'}>
          <img
            className="logo-header"
            src={process.env.PUBLIC_URL + '/img/ccp-logo-header.png'}
            alt="CapConnect"
          />
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto align-items-center" navbar>
            {isAuthenticated ? (
              <Fragment>
                <NavItem className="text-light mr-4">
                  <ToggleFullscreen />
                </NavItem>

                <NavItem className="text-light">
                  <div
                    className="position-relative d-flex flex-column"
                    onClick={() => toggleUserDropdown()}
                  >
                    <div className="d-flex align-items-center">
                      <div className="d-flex flex-column align-items-center justify-content-center">
                        <div className="disable-select">
                          {applicationStore.user?.fullName}
                        </div>
                        <div className="disable-select">
                          {applicationStore.user?.organization.name}
                        </div>
                      </div>

                      {userDropdownVisible ? (
                        <i className="fas fa-caret-up ml-3"></i>
                      ) : (
                        <i className="fas fa-caret-down ml-3"></i>
                      )}
                    </div>

                    <div
                      ref={userSettingsRef}
                      className={
                        'header-user-dropdown border text-dark' +
                        (userDropdownVisible ? ' show' : '')
                      }
                    >
                      <div className="d-flex flex-column">
                        <div className="d-flex border-bottom py-1 text-sm">
                          <i className="fas fa-id-badge text-md text-secondary pt-1"></i>
                          <div className="d-flex flex-column ml-2">
                            <span>{applicationStore.user?.fullName}</span>
                            <span>{applicationStore.user?.email}</span>
                          </div>
                        </div>

                        <div className="d-flex py-1 text-sm">
                          <i className="fas fa-building text-md text-secondary pt-1"></i>
                          <div className="d-flex flex-column ml-2">
                            <span>
                              {applicationStore.user?.organization.name}
                            </span>
                            <span>
                              {applicationStore.user?.organization.shortName}
                            </span>
                          </div>
                        </div>

                        <Button
                          className="align-self-end mt-1"
                          onClick={logout}
                          size="xs"
                          color="primary"
                        >
                          <i className="fas fa-sign-out-alt"></i>
                          <span className="ml-2 text-bold">Logout</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </NavItem>
              </Fragment>
            ) : (
              <Fragment>
                {location.pathname === '/' && (
                  <Fragment>
                    <NavItem>
                      <Link className="ml-md-3" to="/sign-in">
                        Sign In
                      </Link>
                    </NavItem>
                  </Fragment>
                )}
              </Fragment>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    </header>
  );
};

export default Header;
