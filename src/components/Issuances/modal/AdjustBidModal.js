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

import classNames from 'classnames';

import issuancesStore from 'stores/issuancesStore';

import textContent from '../../../data/const/textContent.json';
import IntegerInput from 'components/Common/IntegerInput';
import { bidValuesRange, bpsValuesRange } from 'data/const/constants';
import { showSuccess, showError } from 'services/toastService';

const reasonMaxLength = 200;

const textBoxStyles = {
  resize: 'none',
};

export const AdjustBidModal = observer(({ toggle }) => {
  const { loading } = issuancesStore;
  const { currentBidPrice, currentBidVolume, bidId } =
    issuancesStore.currentLastBidData || {};
  const trancheId = issuancesStore.currentTrancheId;

  const [reason, setReason] = useState('');
  const [isAdjust, setIsAdjust] = useState(true);
  const [newBidValues, setNewBidValues] = useState({
    priceBps: 0,
    volume: 0,
  });

  const adjustLastBid = async () => {
    try {
      if (isAdjust) {
        await issuancesStore.adjustLastBid(bidId, {
          adjustReason: reason,
          ...newBidValues,
        });
        showSuccess(textContent.modal.adjust_bid.ADJUST_BID_SUCCESS);
        toggle();
        trancheId && issuancesStore.getLastBid(trancheId);
      } else {
        await issuancesStore.deleteLastBid(bidId, {
          adjustReason: reason,
        });
        showSuccess(textContent.modal.adjust_bid.REMOVE_BID_SUCCESS);
        toggle();
        trancheId && issuancesStore.getLastBid(trancheId);
      }
    } catch (e) {
      trancheId && issuancesStore.getLastBid(trancheId);
      toggle();
      showError(e?.response?.data?.message || e?.response?.data?.detail);
    }
  };

  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  const handleIntegerChange = (name, value) => {
    setNewBidValues({
      ...newBidValues,
      [name]: value,
    });
  };

  const handleAdjustBid = () => {
    setIsAdjust(!isAdjust);
  };

  function isDisable() {
    if (isAdjust) {
      return (
        !reason || loading || Object.values(newBidValues).some((el) => !el)
      );
    }
    return !reason;
  }

  return (
    <Modal size="md" isOpen>
      <ModalHeader>
        <Button
          outline={!isAdjust}
          className="mr-2"
          color="primary"
          type="button"
          onClick={handleAdjustBid}
        >
          {textContent.issuances.ADJUST_BID}
        </Button>
        <Button outline={isAdjust} color="primary" onClick={handleAdjustBid}>
          {textContent.issuances.REMOVE_BID}
        </Button>
      </ModalHeader>
      <ModalBody>
        <FormGroup className="mb-3 d-flex justify-content-between">
          <div className="text-bold text-sm-larger mt-3 w-25">Bid Volume</div>
          <div className="mb-1 w-25">
            <label className="text-sm mb-0">Current</label>
            <IntegerInput
              disabled
              className={classNames({
                'is-invalid': !!'',
              })}
              value={currentBidVolume}
            />
          </div>
          {isAdjust && (
            <div className="mb-1 w-25">
              <label className="text-sm mb-0">New</label>
              <IntegerInput
                className={classNames({
                  'is-invalid': !!'',
                })}
                name="volume"
                value={newBidValues.volume}
                onChange={handleIntegerChange}
                min={bidValuesRange.MIN}
              />
            </div>
          )}
        </FormGroup>
        <FormGroup className="mb-3 d-flex justify-content-between">
          <div className="text-bold text-sm-larger w-25">Bid BPS</div>
          <div className="mb-3 w-25">
            <IntegerInput
              disabled
              className={classNames({
                'is-invalid': !!'',
              })}
              value={currentBidPrice}
              max={bpsValuesRange.MIN}
            />
          </div>
          {isAdjust && (
            <div className="mb-3 w-25">
              <IntegerInput
                className={classNames({
                  'is-invalid': !!'',
                })}
                name="priceBps"
                value={newBidValues.priceBps}
                onChange={handleIntegerChange}
                min={bpsValuesRange.MIN}
                max={bpsValuesRange.MAX}
              />
            </div>
          )}
        </FormGroup>

        <FormGroup>
          <Label className="text-bold text-sm-larger" for="reason">
            {textContent.issuances.ADJUSTMENT_REASON}
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
          onClick={adjustLastBid}
          disabled={isDisable()}
        >
          {loading && <Spinner size="sm" color="light" className="mr-2" />}
          {textContent.keywords.SAVE}
        </Button>
      </ModalFooter>
    </Modal>
  );
});

AdjustBidModal.propTypes = {
  issuancesStore: PropTypes.instanceOf(Object),
  id: PropTypes.string,
};
