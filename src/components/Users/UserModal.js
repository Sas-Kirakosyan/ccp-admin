import React from 'react';
import {
  FormFeedback,
  FormGroup,
  Input,
  Modal,
  ModalBody,
  Button,
} from 'reactstrap';
import LaddaButton, { SLIDE_RIGHT, SM } from 'react-ladda';
import ReactSelectComponent from '../Common/ReactSelectComponent';

import { observer } from 'mobx-react';
import usersStore from '../../stores/usersStore';
import referenceStore from '../../stores/referenceStore';
import orgsStore from '../../stores/orgsStore';
import rolesStore from '../../stores/rolesStore';

const UserModal = observer((props) => {
  const { isOpen, toggle } = props;

  const handleSubmitData = async () => {
    let response;

    if (usersStore.currentUser.id) {
      response = await usersStore.updateUser();
    } else {
      response = await usersStore.addNewUser();
    }

    if (response === 'ok') {
      toggle();
      await usersStore.getAllUsers();
    }
  };

  const handleToggleModal = () => {
    usersStore.resetUserFields();
    toggle();
  };

  const handleChange = (e) => {
    usersStore.inputChange(e.target.name, e.target.value);
  };

  const handleUserAuthApps = (a) => {
    usersStore.setUserAuthApps(a);
  };

  const handleUserRoles = (r) => {
    usersStore.setUserRoles(r);
  };

  const handleUserOrg = (o) => {
    usersStore.setUserOrg(o);
  };

  const selectOrgOptions = orgsStore.allOrgs
    ?.map((org, i) => ({
      key: i,
      label: `${org.name}, ${org.code}`,
      value: org.code,
      ...org,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const selectRoleOptions = rolesStore.roles
    ?.map((role) => ({
      label: role.name,
      value: +role.id,
      ...role,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const selectAccessOptions = referenceStore.apps
    ?.map((app, i) => ({ key: i, label: app.name, value: app.code, ...app }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <Modal fade={false} isOpen={isOpen}>
      <div className="px-3 py-2 modal-header d-flex align-items-center justify-content-between">
        <h6 className="mb-0">User Details</h6>
        <i
          className="fas fa-times p-2 cursor-pointer"
          onClick={handleToggleModal}
        />
      </div>
      <ModalBody>
        <FormGroup>
          <label className="text-sm mb-0">
            Full Name<sup className="text-danger">*</sup>
          </label>
          <Input
            onChange={handleChange}
            value={usersStore.currentUser.fullName}
            name="fullName"
            invalid={!!usersStore.errors.fullName}
            type="text"
          />
          <FormFeedback>{usersStore.errors.fullName}</FormFeedback>
        </FormGroup>
        <FormGroup>
          <label className="text-sm mb-0">
            E-mail<sup className="text-danger">*</sup>
          </label>
          <Input
            onChange={handleChange}
            value={usersStore.currentUser.email}
            name="email"
            type="email"
            invalid={!!usersStore.errors.email}
            autoComplete="off"
          />
          <FormFeedback>{usersStore.errors.email}</FormFeedback>
        </FormGroup>
        <FormGroup
          className={usersStore.errors.organization ? ' is-invalid' : ''}
        >
          <label className="text-sm mb-0">
            Organization<sup className="text-danger">*</sup>
          </label>
          <ReactSelectComponent
            placeholder="Select"
            value={usersStore.currentUser.organization}
            onChange={handleUserOrg}
            options={selectOrgOptions}
          />
          <FormFeedback>{usersStore.errors.organization}</FormFeedback>
        </FormGroup>
        <FormGroup
          className={
            usersStore.errors.authorizedApplications ? ' is-invalid' : ''
          }
        >
          <label className="text-sm mb-0">
            Authorized Applications<sup className="text-danger">*</sup>
          </label>
          <ReactSelectComponent
            placeholder="Select"
            isMulti={true}
            value={usersStore.currentUser.authorizedApplications || null}
            onChange={handleUserAuthApps}
            options={selectAccessOptions}
          />
          <FormFeedback>
            {usersStore.errors.authorizedApplications}
          </FormFeedback>
        </FormGroup>

        <FormGroup className={usersStore.errors.roles ? ' is-invalid' : ''}>
          <label className="text-sm mb-0">
            Roles<sup className="text-danger">*</sup>
          </label>
          <ReactSelectComponent
            placeholder="Select"
            isMulti={true}
            value={usersStore.currentUser.roles || null}
            onChange={handleUserRoles}
            options={selectRoleOptions}
          />
          <FormFeedback>{usersStore.errors.roles}</FormFeedback>
        </FormGroup>

        <FormGroup className="d-flex align-items-center justify-content-end mb-0">
          <Button
            className="btn-xs mr-1"
            color="link"
            onClick={handleToggleModal}
          >
            Cancel
          </Button>
          <LaddaButton
            loading={usersStore.loading}
            onClick={handleSubmitData}
            data-size={SM}
            data-style={SLIDE_RIGHT}
            data-spinner-size={18}
            data-spinner-color="#fff"
            data-spinner-lines={12}
            className="btn btn-primary btn-xs"
          >
            {usersStore.currentUser.id ? 'Save Changes' : 'Add User'}
          </LaddaButton>
        </FormGroup>
      </ModalBody>
    </Modal>
  );
});

export default UserModal;
