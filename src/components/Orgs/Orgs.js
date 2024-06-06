import React from 'react';
import { Route, Switch } from 'react-router-dom';
import OrgsList from './OrgsList';
import OrgOverview from './OrgOverview';

const Orgs = () => {
  return (
    <Switch>
      <Route exact path={'/admin/orgs'} component={OrgsList} />
      <Route exact path={'/admin/orgs/:code'} component={OrgOverview} />
    </Switch>
  );
};

export default Orgs;
