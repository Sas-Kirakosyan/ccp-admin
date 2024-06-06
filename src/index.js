import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import uiStore from './stores/uiStore';
import commonStore from './stores/commonStore';
import referenceStore from './stores/referenceStore';
import usersStore from './stores/usersStore';
import orgsStore from './stores/orgsStore';
import rolesStore from './stores/rolesStore';
import permissionsStore from './stores/permissionsStore';
import auditStore from './stores/auditStore';
import applicationStore from './stores/applicationStore';
import issuancesStore from './stores/issuancesStore';

import { configure } from 'mobx';
import { Provider } from 'mobx-react';

import 'flag-icon-css/css/flag-icon.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

configure({
  enforceActions: 'never',
});

const stores = {
  uiStore,
  commonStore,
  referenceStore,
  usersStore,
  orgsStore,
  rolesStore,
  permissionsStore,
  auditStore,
  applicationStore,
  issuancesStore,
};

window.stores = stores;

ReactDOM.render(
  <Provider {...stores}>
    <App />
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
