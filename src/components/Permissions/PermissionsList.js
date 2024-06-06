import React, { useEffect } from 'react';

import BootstrapTable from 'react-bootstrap-table-next';

import permissionsStore from '../../stores/permissionsStore';
import uiStore from '../../stores/uiStore';
import Breadcrumbs from '../Layout/Breadcrumbs';
import { Card, CardBody, CardHeader, Button } from 'reactstrap';
import LoadingOverlay from '../Common/LoadingOverlay';

import { observer } from 'mobx-react';
import applicationStore from '../../stores/applicationStore';
import { permissionsColumn } from './permissionColumn';

import ErrorModal from '../Common/ErrorModal';

const PermissionsList = observer(() => {
  useEffect(() => {
    (async () => {
      try {
        permissionsStore.getAllPermissions();
      } catch (e) {
        ErrorModal(e?.response?.message);
      }
    })();
  }, []);

  const handleToggleModal = () => {
    uiStore.toggleModal('permission');
  };

  return (
    <div className="p-3 position-relative w-100 h-100">
      <Breadcrumbs
        className="mb-3"
        items={[
          { name: 'Home', href: '/admin' },
          { name: 'Permissions', href: '/admin/permissions' },
        ]}
      />
      <div className="w-100 d-flex align-items-center justify-content-end mb-3">
        {applicationStore.permissions.permission?.create && (
          <Button color="primary" size="sm" onClick={handleToggleModal}>
            Add New Permission
          </Button>
        )}
      </div>
      <Card>
        <CardHeader className="bg-white d-flex justify-content-between align-items-center">
          {permissionsStore.orgsLength} Permissions
        </CardHeader>
        <CardBody className="position-relative">
          {permissionsStore.loading && <LoadingOverlay />}

          <BootstrapTable
            wrapperClasses="table-scroll max-height-440"
            keyField="id"
            bootstrap4
            data={permissionsStore.permissionData || []}
            columns={permissionsColumn}
            size="lg"
            className="table-hover"
            rowClasses="custom-table-style"
            filterPosition="top"
            hover
          />
        </CardBody>
      </Card>
    </div>
  );
});

export default PermissionsList;
