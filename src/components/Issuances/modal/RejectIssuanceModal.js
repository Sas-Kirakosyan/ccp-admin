import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { observer } from 'mobx-react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
  Input,
  FormGroup,
  Label,
} from 'reactstrap';

import textContent from '../../../data/const/textContent.json';
import ErrorModal from '../../Common/ErrorModal';

const reasonMaxLength = 200;

const textBoxStyles = {
  resize: 'none',
};

export const RejectIssuanceModal = observer(
  ({ closeModal, issuancesStore, id }) => {
    const [rejectLoading, setRejectLoading] = useState(false);
    const [reason, setReason] = useState('');

    const rejectIssuance = async () => {
      setRejectLoading(true);
      try {
        await issuancesStore.rejectIssuance(id, { reason });
        closeModal();
      } catch (e) {
        closeModal();
        ErrorModal(e?.response?.data?.message);
      }
    };

    const handleReasonChange = (e) => {
      setReason(e.target.value);
    };

    return (
      <Modal size="md" isOpen>
        <ModalHeader>
          <span className="text-md-larger text-bold">
            {textContent.modal.reject_issuance.TITLE}
          </span>
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label className="text-bold text-sm-larger" for="reason">
              {textContent.issuances.REJECT_REASON}
            </Label>
            <Input
              placeholder={textContent.placeholder.REASON}
              style={textBoxStyles}
              rows="3"
              type="textarea"
              autoComplete="off"
              name="reason"
              id="reason"
              maxLength={reasonMaxLength}
              value={reason}
              onChange={handleReasonChange}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={closeModal}>
            {textContent.keywords.CANCEL}
          </Button>
          <Button
            color="primary"
            onClick={rejectIssuance}
            disabled={rejectLoading || !reason}
          >
            {rejectLoading && (
              <Spinner size="sm" color="light" className="mr-2" />
            )}
            {textContent.keywords.REJECT}
          </Button>
        </ModalFooter>
      </Modal>
    );
  },
);

RejectIssuanceModal.propTypes = {
  closeModal: PropTypes.func,
  issuancesStore: PropTypes.instanceOf(Object),
  id: PropTypes.string,
};
