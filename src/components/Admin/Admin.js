import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { observer } from 'mobx-react';

import applicationStore from '../../stores/applicationStore';
import LoadingOverlay from '../Common/LoadingOverlay';

const Audit = lazy(() => import('../Audit/Audit'));
const Issuances = lazy(() => import('../Issuances/Issuances'));
const NotFound = lazy(() => import('../Layout/404'));
const Orgs = lazy(() => import('../Orgs/Orgs'));
const Users = lazy(() => import('../Users/Users'));
const Roles = lazy(() => import('../Roles/Roles'));
const Jobs = lazy(() => import('../Jobs/Jobs'));
const Swagger = lazy(() => import('../Swagger/Swagger'));
const Permissions = lazy(() => import('../Permissions/Permissions'));

const isShowSwagger = process.env.NODE_ENV === 'production';

const Admin = observer(() => {
  return (
    <div className="admin-section">
      <Suspense fallback={<LoadingOverlay extraClass="position-relative" />}>
        <Switch>
          <Route exact path={'/admin'} />

          {applicationStore.permissions.audit?.view && (
            <Route exact path={'/admin/audit'} component={Audit} />
          )}

          {applicationStore.permissions.issuance?.view && (
            <Route exact path={'/admin/issuances'} component={Issuances} />
          )}

          {applicationStore.permissions.user?.view && (
            <Route
              exact
              path={['/admin/users', '/admin/user/:id']}
              component={Users}
            />
          )}

          {applicationStore.permissions.organization?.view && (
            <Route
              exact
              path={['/admin/orgs', '/admin/orgs/:code']}
              component={Orgs}
            />
          )}

          {applicationStore.permissions.role?.view && (
            <Route exact path={['/admin/roles']} component={Roles} />
          )}

          {applicationStore.permissions.permission?.view && (
            <Route
              exact
              path={['/admin/permissions']}
              component={Permissions}
            />
          )}

          {applicationStore.permissions.job?.view && (
            <Route exact path={'/admin/jobs'} component={Jobs} />
          )}

          {applicationStore.permissions.swagger?.view && isShowSwagger && (
            <Route exact path={'/admin/swagger'} component={Swagger} />
          )}

          <Route render={() => <NotFound />} />
        </Switch>
      </Suspense>
    </div>
  );
});

export default Admin;
