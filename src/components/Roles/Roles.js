import React from 'react';

import { Route, Switch } from 'react-router-dom';
import RolesList from './RolesList';

const Roles = () => {
  return (
    <Switch>
      <Route exact path={'/admin/roles'} component={RolesList} />
    </Switch>
  );
};

export default Roles;
