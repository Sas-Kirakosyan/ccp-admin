import React, { useEffect } from 'react';
import history from '../../history';
import Breadcrumbs from '../Layout/Breadcrumbs';
import { Card, CardBody, CardHeader, Button } from 'reactstrap';
import paginationFactory from 'react-bootstrap-table2-paginator';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory from 'react-bootstrap-table2-filter';

import LoadingOverlay from '../Common/LoadingOverlay';

import { orgsColumn } from './OrgsColumn';

import { observer } from 'mobx-react';
import uiStore from '../../stores/uiStore';
import orgsStore from '../../stores/orgsStore';
import applicationStore from '../../stores/applicationStore';
import ErrorModal from '../Common/ErrorModal';

import { loadGoogleMapApiScript } from '../../helpers/common';

const OrgsList = observer(() => {
  useEffect(() => {
    loadGoogleMapApiScript();
    (async () => {
      try {
        await Promise.all([orgsStore.getAllOrgs(), orgsStore.getOrgTypes()]);
      } catch (e) {
        ErrorModal(e?.response?.message);
      }
    })();
  }, []);

  const handleToggleModal = () => {
    orgsStore.resetOrgFields();
    uiStore.toggleModal('org');
  };

  const pagination = paginationFactory({
    page: 1,
    sizePerPage: 10,
    showTotal: true,
    hideSizePerPage: true,
  });

  const handleOnRowSelect = ({ code }) => {
    orgsStore.resetSearchInputField();
    history.push(`/admin/orgs/${code}`);
  };

  const selectRow = {
    mode: 'radio',
    hideSelectColumn: true,
    clickToSelect: true,
    classes: 'selection-row',
    onSelect: handleOnRowSelect,
  };

  return (
    <div className="p-3 position-relative w-100 h-100">
      <Breadcrumbs
        className="mb-3"
        items={[
          { name: 'Home', href: '/admin' },
          { name: 'Organizations', href: '/admin/orgs' },
        ]}
      />

      <div className="w-100 d-flex align-items-center justify-content-between mb-3">
        {applicationStore.permissions.organization?.create && (
          <Button color="primary" size="sm" onClick={handleToggleModal}>
            Add New Organization
          </Button>
        )}
      </div>
      <Card>
        <CardHeader className="bg-white d-flex justify-content-between align-items-center">
          {orgsStore.orgsLength} Organizations
        </CardHeader>
        <CardBody className="position-relative">
          {orgsStore.loading && <LoadingOverlay />}
          <BootstrapTable
            wrapperClasses="table-scroll max-height-440"
            keyField="code"
            bootstrap4
            data={orgsStore.orgsData || []}
            columns={orgsColumn}
            pagination={pagination}
            size="lg"
            selectRow={selectRow}
            className="table-hover"
            rowClasses="custom-table-style"
            filterPosition="top"
            filter={filterFactory()}
            hover
          />
        </CardBody>
      </Card>
    </div>
  );
});

export default OrgsList;
