import PropTypes from 'prop-types';

import { observer } from 'mobx-react';
import { Modal, ModalBody, ModalFooter, Spinner, Button } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';

import uiStore from 'stores/uiStore';

import LoadingOverlay from '../../Common/LoadingOverlay';

import textContent from 'data/const/textContent.json';

import issuancesStore from 'stores/issuancesStore';
import { removeBidderColumns } from './RemoveBidderColumn';
import ErrorModal from '../../Common/ErrorModal';

const modalStyle = {
  maxWidth: '1050px',
  width: '100%',
};

export const RemoveBidderTableModal = observer(({ toggle }) => {
  const { lastBidLoading } = issuancesStore;

  const handlePopupRemoveBidder = () => {
    uiStore.toggleModal('removeBidderModal');
  };

  const refreshLastBid = () => {
    try {
      if (issuancesStore.currentTrancheIdParam) {
        issuancesStore.getLastBid(issuancesStore.currentTrancheIdParam);
      }
    } catch (e) {
      ErrorModal(e?.response?.message);
    }
  };

  const handleOnRowSelect = ({ bidId }) => {
    issuancesStore.currentLastBidData = bidId;
    handlePopupRemoveBidder();
  };

  const selectRow = {
    mode: 'radio',
    clickToSelect: true,
    classes: 'selection-row',
    onSelect: handleOnRowSelect,
  };

  return (
    <Modal size="lg" isOpen style={modalStyle}>
      <div className="px-3 py-2 modal-header d-flex align-items-center justify-content-end">
        <i className="fas fa-times p-2 cursor-pointer" onClick={toggle} />
      </div>
      <ModalBody>
        {lastBidLoading ? (
          <LoadingOverlay />
        ) : (
          <BootstrapTable
            keyField="bidId"
            bootstrap4
            data={issuancesStore.lastBidData || []}
            columns={removeBidderColumns}
            selectRow={selectRow}
            size="lg"
          />
        )}
      </ModalBody>
      <ModalFooter>
        <Button
          size="sm"
          color="primary"
          onClick={refreshLastBid}
          disabled={lastBidLoading}
        >
          {lastBidLoading && (
            <Spinner size="sm" color="light" className="mr-2" />
          )}
          {textContent.keywords.REFRESH}
        </Button>
        <Button size="sm" color="secondary" onClick={toggle}>
          {textContent.keywords.CANCEL}
        </Button>
      </ModalFooter>
    </Modal>
  );
});

RemoveBidderTableModal.propTypes = {
  issuancesStore: PropTypes.instanceOf(Object),
};
