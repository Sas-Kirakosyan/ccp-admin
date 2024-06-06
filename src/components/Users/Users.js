import React from 'react';
import { Route, Switch } from 'react-router-dom';
import UsersList from './UsersList';
import UserOverview from './UserOverview';

const Users = () => {
  return (
    <Switch>
      <Route exact path={'/admin/users'} component={UsersList} />
      <Route exact path={'/admin/user/:id'} component={UserOverview} />
    </Switch>
  );
};

export default Users;
