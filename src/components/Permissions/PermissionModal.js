import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { FormFeedback, FormGroup, Input, Modal, ModalBody } from 'reactstrap';
import LaddaButton, { SM, SLIDE_RIGHT } from 'react-ladda';

import { Button } from 'reactstrap';

import { observer } from 'mobx-react';

import permissionsStore from '../../stores/permissionsStore';
import Checkbox from '../Common/Checkbox';
import ErrorModal from '../Common/ErrorModal';

const PermissionModal = observer(({ isOpen, toggle }) => {
  const handleSubmitData = async () => {
    let response;
    if (permissionsStore.currentPermission.id) {
      response = await permissionsStore
        .updatePermission()
        .catch((e) => ErrorModal(e?.response?.message));
    } else {
      response = await permissionsStore
        .addNewPermission()
        .catch((e) => ErrorModal(e?.response?.message));
    }
    if (response === 'ok') {
      toggle();
      await permissionsStore
        .getAllPermissions()
        .catch((e) => ErrorModal(e?.response?.message));
    }
  };

  const handleToggleModal = () => {
    permissionsStore.resetPermissionFields();
    toggle();
  };

  useEffect(() => {
    if (!permissionsStore.permissions) {
      permissionsStore
        .getAllPermissions()
        .catch((e) => ErrorModal(e?.response?.message));
    }
  }, []);

  const handleChange = (e) => {
    permissionsStore.inputChange(e.target.name, e.target.value);
  };

  const handleIsAdvenced = () => {
    permissionsStore.setIsAdvanced();
  };

  return (
    <Modal fade={false} isOpen={isOpen}>
      <div className="px-3 py-2 modal-header d-flex align-items-center justify-content-between">
        <h6 className="mb-0">Permission Details</h6>
        <i
          className="fas fa-times p-2 cursor-pointer"
          onClick={handleToggleModal}
        ></i>
      </div>
      <ModalBody>
        <FormGroup>
          <label className="text-sm mb-0">
            Resource<sup className="text-danger">*</sup>
          </label>
          <Input
            onChange={handleChange}
            value={permissionsStore.currentPermission.resource}
            name="resource"
            invalid={!!permissionsStore.errors.resource}
            type="text"
          />
          <FormFeedback>{permissionsStore.errors.resource}</FormFeedback>
        </FormGroup>

        <FormGroup>
          <label className="text-sm mb-0">
            Action<sup className="text-danger">*</sup>
          </label>
          <Input
            onChange={handleChange}
            value={permissionsStore.currentPermission.action}
            name="action"
            invalid={!!permissionsStore.errors.action}
            type="text"
          />
          <FormFeedback>{permissionsStore.errors.action}</FormFeedback>
        </FormGroup>

        <FormGroup className="mb-4">
          <label className="text-sm mb-0">
            Description<sup className="text-danger">*</sup>
          </label>
          <Input
            onChange={handleChange}
            value={permissionsStore.currentPermission.description}
            name="description"
            invalid={!!permissionsStore.errors.description}
            type="text"
          />
          <FormFeedback>{permissionsStore.errors.description}</FormFeedback>
        </FormGroup>

        <FormGroup
          className={permissionsStore.errors.permissions ? ' is-invalid' : ''}
        >
          <Checkbox
            id="issueTypeCheckbox"
            label="Is Advanced"
            className="text-dark text-sm"
            checked={permissionsStore.currentPermission.isAdvanced}
            handleCheck={handleIsAdvenced}
          />
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
            loading={permissionsStore.loading}
            onClick={handleSubmitData}
            data-size={SM}
            data-style={SLIDE_RIGHT}
            data-spinner-size={18}
            data-spinner-color="#fff"
            data-spinner-lines={12}
            className="btn btn-xs btn-primary"
          >
            {permissionsStore.currentPermission.id
              ? 'Save Changes'
              : 'Add Permission'}
          </LaddaButton>
        </FormGroup>
      </ModalBody>
    </Modal>
  );
});

export default PermissionModal;

PermissionModal.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
};
