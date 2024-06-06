import React, { useEffect, useState } from 'react';
import { Input, CardHeader, CardBody, Card, Button } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';

import LoadingOverlay from '../Common/LoadingOverlay';

import { observer } from 'mobx-react';
import usersStore from '../../stores/usersStore';
import orgsStore from '../../stores/orgsStore';

import uiStore from '../../stores/uiStore';
import Breadcrumbs from '../Layout/Breadcrumbs';
import history from '../../history';
import referenceStore from '../../stores/referenceStore';
import applicationStore from '../../stores/applicationStore';
import rolesStore from '../../stores/rolesStore';
import ErrorModal from '../Common/ErrorModal';
import { Paginate } from 'components/Common/Paginate';

import { usersColumn } from './usersColumn';

const UsersList = observer(() => {
  const itemsPerPage = usersStore.users.take;
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        return await Promise.all([
          referenceStore.getApps(),
          usersStore.getAllUsers(),
          rolesStore.getAllRoles(),
          orgsStore.getAllOrgs(),
        ]);
      } catch (e) {
        ErrorModal(e?.response?.message);
      }
    }
    fetchData();
  }, []);

  const handleAddNewUser = () => {
    usersStore.resetUserFields();
    uiStore.toggleModal('user');
  };

  const handleSearch = (e) => {
    usersStore.search(e.target.value);
    handlePageClick(0);
  };

  const handleOnRowSelect = ({ id, isSyncRequired }) => {
    if (!isSyncRequired) {
      usersStore.resetSearchInputField();
      history.push(`/admin/user/${id}`);
    }
  };

  const handleSync = () => {
    try {
      usersStore.syncUsers();
    } catch (e) {
      ErrorModal(e?.response?.message);
    }
  };

  const handlePageClick = (selected) => {
    setSelected(selected);
    usersStore.pageChange(itemsPerPage, selected * itemsPerPage);
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
          { name: 'Users', href: '/admin/users' },
        ]}
      />

      <div className="w-100 d-flex align-items-center justify-content-between mb-3">
        <div
          className="search-input-wrapper"
          style={{ maxWidth: '280px', width: '100%' }}
        >
          <Input
            placeholder="Search"
            onChange={handleSearch}
            value={usersStore.searchInputVal}
          />
        </div>

        {applicationStore.permissions.user?.create && (
          <Button className="btn-sm" onClick={handleAddNewUser} color="primary">
            Add New User
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="bg-white d-flex justify-content-between align-items-center">
          {usersStore.usersLength} Users / {usersStore.notSyncedUsers} not
          synced
          {applicationStore.permissions.user?.modify && (
            <Button color="link" onClick={handleSync}>
              <i className="fas fa-sync-alt mr-1"></i>
              Sync Users
            </Button>
          )}
        </CardHeader>

        <CardBody className="position-relative table-scroll">
          {(usersStore.loading ||
            usersStore.sendingInvite ||
            referenceStore.loading) && <LoadingOverlay />}
          <BootstrapTable
            wrapperClasses="table-scroll max-height-400"
            keyField="id"
            bootstrap4
            data={usersStore.users.items || []}
            columns={usersColumn}
            size="lg"
            selectRow={selectRow}
            className="table-hover"
            rowClasses="custom-table-style"
            filterPosition="top"
            hover
          />
          <Paginate
            selected={selected}
            previousLabel="<"
            nextLabel=" > "
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={
              Math.ceil(usersStore.users.total / usersStore.users.take) || 0
            }
            className="react-paginate"
            pageClassName="li-button"
            itemsPerPage={usersStore.users.take}
            handlePageClick={handlePageClick}
          />
        </CardBody>
      </Card>
    </div>
  );
});

export default UsersList;
