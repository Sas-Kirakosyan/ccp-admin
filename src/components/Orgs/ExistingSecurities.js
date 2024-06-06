import React from 'react';

import { Button, FormGroup } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';

import { securityColumns } from './securityColumns';
import orgsStore from '../../stores/orgsStore';
import uiStore from '../../stores/uiStore';

const ExistingSecurities = () => {
  if (!orgsStore.existingSecurities) {
    return <></>;
  }

  const handleOpenModal = () => {
    uiStore.toggleModal('security');
    orgsStore.setInitialSecurity();
  };

  return (
    <div className="position-relative mt-3">
      <FormGroup className="d-flex align-items-center justify-content-end mt-2">
        <Button size="sm" color="primary" onClick={handleOpenModal}>
          Add New
        </Button>
      </FormGroup>
      <BootstrapTable
        keyField="id"
        bootstrap4
        data={orgsStore.existingSecurities}
        columns={securityColumns}
      />
    </div>
  );
};

export default ExistingSecurities;
