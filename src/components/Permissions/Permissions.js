import React from 'react';

import { Route, Switch } from 'react-router-dom';
import PermissionsList from './PermissionsList';

const Permissions = () => {
  return (
    <Switch>
      <Route exact path={'/admin/permissions'} component={PermissionsList} />
    </Switch>
  );
};

export default Permissions;
