import React, { useEffect } from 'react';
import Breadcrumbs from '../Layout/Breadcrumbs';
import { Card, CardBody, CardHeader, Button } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';

import uiStore from '../../stores/uiStore';
import LoadingOverlay from '../Common/LoadingOverlay';

import rolesStore from '../../stores/rolesStore';
import { observer } from 'mobx-react';
import applicationStore from '../../stores/applicationStore';

import ErrorModal from '../Common/ErrorModal';

import { rolesColumn } from './rolesColumn';

const RolesList = observer(() => {
  useEffect(() => {
    (async () => {
      try {
        await rolesStore.getAllRoles();
      } catch (e) {
        ErrorModal(e?.response?.message);
      }
    })();
  }, []);

  return (
    <div className="p-3 position-relative w-100 h-100">
      <Breadcrumbs
        className="mb-3"
        items={[
          { name: 'Home', href: '/admin' },
          { name: 'Roles', href: '/admin/roles' },
        ]}
      />

      <div className="w-100 d-flex align-items-center justify-content-between mb-3">
        <div></div>

        {applicationStore.permissions.role?.create && (
          <Button
            size="sm"
            color="primary"
            onClick={() => uiStore.toggleModal('role')}
          >
            Add New Role
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="bg-white d-flex justify-content-between align-items-center">
          {rolesStore.rolesLength} Roles
        </CardHeader>
        <CardBody className="position-relative">
          {rolesStore.loading && <LoadingOverlay />}

          <BootstrapTable
            wrapperClasses="table-scroll max-height-480"
            keyField="id"
            bootstrap4
            data={rolesStore.rolesData || []}
            columns={rolesColumn}
            size="lg"
            className="table-hover"
            rowClasses="custom-table-style"
            hover
          />
        </CardBody>
      </Card>
    </div>
  );
});

export default RolesList;
