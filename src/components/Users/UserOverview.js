import React, { useEffect, useState } from 'react';
import {
  TabContent,
  TabPane,
  NavItem,
  NavLink,
  Nav,
  Row,
  Col,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';
import LoadingOverlay from '../Common/LoadingOverlay';
import Breadcrumbs from '../Layout/Breadcrumbs';
import usersStore from '../../stores/usersStore';
import ReactSelectComponent from '../Common/ReactSelectComponent';
import rolesStore from '../../stores/rolesStore';
import LaddaButton, { SLIDE_RIGHT, SM } from 'react-ladda';
import applicationStore from '../../stores/applicationStore';

const UserOverview = observer(() => {
  const params = useParams();
  const [activeTab, setActiveTab] = useState('1');

  const toggleTab = (tab) => setActiveTab(tab);

  useEffect(() => {
    usersStore.getUser(params.id);
    //eslint-disable-next-line
  }, []);

  return (
    <div className="position-relative p-3 h-100 w-100">
      {usersStore.loading && <LoadingOverlay extraClass={'bg-white'} />}

      <Breadcrumbs
        className="mb-3"
        items={[
          { name: 'Home', href: '/admin' },
          { name: 'Users', href: '/admin/users' },
          {
            name: usersStore.currentUser.fullName,
            href: `/admin/users/${usersStore.currentUser.id}`,
          },
        ]}
      />

      <div className="mb-4 d-flex align-items-start">
        <div>
          <h4 className="text-dark mb-1">{usersStore.currentUser.fullName}</h4>
          <h5 className="text-md">
            {usersStore.currentUser.organization?.name}
          </h5>
        </div>

        {!usersStore.currentUser.emailVerified && (
          <LaddaButton
            loading={usersStore.sendingInvite}
            onClick={() => usersStore.sendInvite(params.id)}
            data-size={SM}
            data-style={SLIDE_RIGHT}
            data-spinner-size={18}
            data-spinner-color="#fff"
            data-spinner-lines={12}
            style={{ zIndex: '0' }}
            className="btn btn-primary btn-xs ml-3 mt-1 text-nowrap"
          >
            Send Invite
          </LaddaButton>
        )}
      </div>

      <div className="mt-2">
        <div className="d-flex align-items-center justify-content-start">
          <Nav tabs>
            <NavItem className="cursor-pointer">
              <NavLink
                className={activeTab === '1' ? ' active' : ''}
                onClick={() => toggleTab('1')}
              >
                Identity
              </NavLink>
            </NavItem>

            <NavItem className="cursor-pointer">
              <NavLink
                className={activeTab === '2' ? ' active' : ''}
                onClick={() => toggleTab('2')}
              >
                Manage Roles
              </NavLink>
            </NavItem>
          </Nav>
        </div>

        <TabContent activeTab={activeTab}>
          <TabPane tabId="1" className="bg-white py-4 px-3 border border-top-0">
            <div className="mb-3">
              <label className="mb-1 text-muted">User Name:</label>
              <h5 className="text-md mb-0">
                {usersStore.currentUser.fullName}
              </h5>
            </div>
            <div className="mb-3">
              <label className="mb-1 text-muted">Organization:</label>
              <Link
                to={`/admin/orgs/${usersStore.currentUser.organization?.code}`}
              >
                <h5 className="text-md mb-0">
                  {usersStore.currentUser.organization?.name}
                </h5>
              </Link>
            </div>
            <div>
              <label className="mb-1 text-muted">E-mail:</label>
              <h5 className="text-md mb-0">
                {usersStore.currentUser.email}
                {usersStore.currentUser.emailVerified && (
                  <i className="far fa-check-circle text-success ml-1"></i>
                )}
              </h5>
            </div>
          </TabPane>

          <TabPane
            tabId="2"
            className="bg-white py-4 px-3 border border-top-0 position-relative"
          >
            {usersStore.updatingRoles && <LoadingOverlay />}

            {applicationStore.permissions.user?.modify && (
              <Row>
                <Col lg={2}>
                  <div className="d-flex flex-column align-items-start mb-4">
                    <label className="mb-1 text-muted">Roles:</label>
                    <ReactSelectComponent
                      placeholder="Select"
                      isMulti={true}
                      className="w-100"
                      value={usersStore.currentUser.roles || null}
                      onChange={(r) => usersStore.setUserRoles(r)}
                      options={rolesStore.roles?.map((role) => ({
                        label: role.name,
                        value: +role.id,
                        ...role,
                      }))}
                    />
                    <LaddaButton
                      loading={usersStore.updatingRoles}
                      onClick={(s) => usersStore.updateUserRoles(s)}
                      data-size={SM}
                      data-style={SLIDE_RIGHT}
                      data-spinner-size={18}
                      data-spinner-color="#fff"
                      data-spinner-lines={12}
                      style={{ zIndex: '0' }}
                      className="btn btn-primary btn-xs mt-3 text-nowrap"
                    >
                      Apply Changes
                    </LaddaButton>
                  </div>
                </Col>
              </Row>
            )}

            <Row>
              <Col lg={5}>
                <div className="d-flex flex-column">
                  <label className="mb-1 text-muted">Permissions:</label>
                  <div className="d-flex flex-wrap w-100">
                    {usersStore.currentUser.effectivePermissions?.map(
                      (perm) => {
                        return (
                          <span
                            key={perm.id}
                            className="highlight-word m-1"
                          >{`${perm.action}/${perm.resource}`}</span>
                        );
                      },
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </div>
    </div>
  );
});

export default UserOverview;
