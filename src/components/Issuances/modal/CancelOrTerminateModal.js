import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  FormGroup,
  Spinner,
  Label,
} from 'reactstrap';
import React, { useState } from 'react';

import ErrorModal from 'components/Common/ErrorModal';
import issuancesStore from 'stores/issuancesStore';
import { transformMillion } from 'helpers/common';
import textContent from 'data/const/textContent';

export const CancelOrTerminateModal = ({ closeModal }) => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reason, setReason] = useState('');

  const issuanceName = `${
    issuancesStore.currentIssuance?.organization.ticker ||
    issuancesStore.currentIssuance?.organization.code
  } ${transformMillion(issuancesStore.currentIssuance?.maxVolume)}`;

  const handleConfirm = () => {
    if (!reason) {
      return;
    }
    setIsConfirmed(true);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await issuancesStore.cancelOrTerminate({ reason });
      closeModal();
    } catch (error) {
      ErrorModal('Unable to cancel or reject issuance');
    }
  };

  const handleChangeReason = ({ target: { value } }) => {
    setReason(value);
  };

  return (
    <Modal isOpen>
      <ModalHeader>
        <span className="text-md-larger text-bold">
          {textContent.modal.cancel_terminate_issuance.TITLE}
        </span>
      </ModalHeader>
      <ModalBody>
        {isConfirmed ? (
          <p>
            {textContent.modal.cancel_terminate_issuance.SUBMIT_TITLE}:{' '}
            {issuanceName}
            <br />
            {textContent.modal.cancel_terminate_issuance.SUBMIT_DESCRIPTION}
            <br />
            {reason}
          </p>
        ) : (
          <FormGroup>
            <Label>
              {textContent.modal.cancel_terminate_issuance.DESCRIPTION_LABEL}
            </Label>
            <Input
              type="textarea"
              rows="4"
              onChange={handleChangeReason}
              value={reason}
            />
          </FormGroup>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" size="sm" onClick={closeModal}>
          {textContent.keywords.CANCEL}
        </Button>
        {isConfirmed ? (
          <Button
            color="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading && <Spinner size="sm" color="light" className="mr-2" />}
            {textContent.keywords.SUBMIT}
          </Button>
        ) : (
          <Button color="primary" size="sm" onClick={handleConfirm}>
            {textContent.modal.cancel_terminate_issuance.CONFIRM_AND_SUBMIT}
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
};
