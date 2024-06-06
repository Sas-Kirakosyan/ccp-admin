import React from 'react';
import PropTypes from 'prop-types';

import {
  FormFeedback,
  FormGroup,
  Input,
  Modal,
  ModalBody,
  Button,
} from 'reactstrap';
import ReactSelectComponent from '../Common/ReactSelectComponent';
import LaddaButton, { SM, SLIDE_RIGHT } from 'react-ladda';
import ErrorModal from '../Common/ErrorModal';

import { observer } from 'mobx-react';

import rolesStore from '../../stores/rolesStore';
import permissionsStore from '../../stores/permissionsStore';

const RoleModal = observer(({ isOpen, toggle }) => {
  const handleSubmitData = async () => {
    let response;

    if (rolesStore.currentRole.id) {
      response = await rolesStore
        .updateRole()
        .catch((e) => ErrorModal(e?.response?.message));
    } else {
      response = await rolesStore
        .addNewRole()
        .catch((e) => ErrorModal(e?.response?.message));
    }

    if (response === 'ok') {
      toggle();
      await rolesStore
        .getAllRoles()
        .catch((e) => ErrorModal(e?.response?.message));
    }
  };

  const handleToggleModal = () => {
    rolesStore.resetRoleFields();
    toggle();
  };

  const handleChange = (e) => {
    rolesStore.inputChange(e.target.name, e.target.value);
  };

  const handleRolePermissions = (s) => {
    rolesStore.setRolePermissions(s);
  };

  return (
    <Modal fade={false} isOpen={isOpen}>
      <div className="px-3 py-2 modal-header d-flex align-items-center justify-content-between">
        <h6 className="mb-0">Role Details</h6>
        <i
          className="fas fa-times p-2 cursor-pointer"
          onClick={handleToggleModal}
        ></i>
      </div>

      <ModalBody>
        <FormGroup>
          <label className="text-sm mb-0">
            Name<sup className="text-danger">*</sup>
          </label>
          <Input
            onChange={handleChange}
            value={rolesStore.currentRole.name}
            name="name"
            invalid={!!rolesStore.errors.name}
            type="text"
          />
          <FormFeedback>{rolesStore.errors.name}</FormFeedback>
        </FormGroup>

        <FormGroup>
          <label className="text-sm mb-0">
            Description<sup className="text-danger">*</sup>
          </label>
          <Input
            onChange={handleChange}
            value={rolesStore.currentRole.description}
            name="description"
            invalid={!!rolesStore.errors.description}
            type="text"
          />
          <FormFeedback>{rolesStore.errors.description}</FormFeedback>
        </FormGroup>

        <FormGroup
          className={rolesStore.errors.permissions ? ' is-invalid' : ''}
        >
          <label className="text-sm mb-0">
            Permissions<sup className="text-danger">*</sup>
          </label>
          <ReactSelectComponent
            placeholder="Select"
            isMulti={true}
            value={rolesStore.currentRole.permissions || null}
            onChange={handleRolePermissions}
            options={permissionsStore.permissionsOptions || null}
          />
          <FormFeedback>{rolesStore.errors.permissions}</FormFeedback>
        </FormGroup>

        <FormGroup className="d-flex align-items-center justify-content-end mb-0">
          <Button
            size="xs"
            color="link"
            className="mr-1"
            onClick={handleToggleModal}
          >
            Cancel
          </Button>
          <LaddaButton
            loading={rolesStore.loading}
            onClick={handleSubmitData}
            data-size={SM}
            data-style={SLIDE_RIGHT}
            data-spinner-size={18}
            data-spinner-color="#fff"
            data-spinner-lines={12}
            className="btn btn-xs btn-primary"
          >
            {rolesStore.currentRole.id ? 'Save Changes' : 'Add Role'}
          </LaddaButton>
        </FormGroup>
      </ModalBody>
    </Modal>
  );
});

export default RoleModal;

RoleModal.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
};
