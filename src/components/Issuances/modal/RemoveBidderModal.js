import { useState } from 'react';

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

import issuancesStore from 'stores/issuancesStore';

import textContent from '../../../data/const/textContent.json';
import { showSuccess, showError } from 'services/toastService';

const reasonMaxLength = 200;

const textBoxStyles = {
  resize: 'none',
};

export const RemoveBidderModal = observer(({ toggle }) => {
  const { loading } = issuancesStore;
  const { bidId, investorOrganizationName } =
    issuancesStore.currentLastBidData || {};
  const trancheId = issuancesStore.currentTrancheId;

  const [reason, setReason] = useState('');

  const removeBidder = async () => {
    try {
      await issuancesStore.removeBidder(bidId, {
        adjustReason: reason,
      });
      showSuccess(textContent.modal.remove_bidder.REMOVE_BIDDER_SUCCESS);
      toggle();
      trancheId && issuancesStore.getLastBid(trancheId);
    } catch (e) {
      trancheId && issuancesStore.getLastBid(trancheId);
      toggle();
      showError(e?.response?.data?.message || e?.response?.data?.detail);
    }
  };

  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  function isDisable() {
    return !reason;
  }

  return (
    <Modal size="md" isOpen>
      <ModalHeader className="justify-content-center align-items-center">
        <span className="d-block text-center">{`Remove the bidder ${investorOrganizationName} `}</span>
        <span className="d-block text-center">{`from the tranche ${trancheId}`}</span>
      </ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label className="text-bold text-sm-larger" for="reason">
            {textContent.issuances.REMOVAL_BIDDER_REASON}
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
        <Button size="sm" color="secondary" onClick={toggle}>
          {textContent.keywords.CANCEL}
        </Button>
        <Button
          size="sm"
          color="primary"
          onClick={removeBidder}
          disabled={isDisable()}
        >
          {loading && <Spinner size="sm" color="light" className="mr-2" />}
          {textContent.keywords.SUBMIT}
        </Button>
      </ModalFooter>
    </Modal>
  );
});

RemoveBidderModal.propTypes = {
  issuancesStore: PropTypes.instanceOf(Object),
};
