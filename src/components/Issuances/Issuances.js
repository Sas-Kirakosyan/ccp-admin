import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import LaddaButton, { SLIDE_RIGHT, MD } from 'react-ladda';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import { Card, CardBody, CardHeader, Col, Row, Button } from 'reactstrap';

import textContent from 'data/const/textContent';

import { CancelOrTerminateModal } from './modal/CancelOrTerminateModal';
import { RejectIssuanceModal } from './modal/RejectIssuanceModal';
import { IssuanceStatus } from '../../data/enums/issuanceStatus';
import { useModalMethods } from '../useHooks/useModalMethods';
import issuancesStore from '../../stores/issuancesStore';
import { transformMillion } from '../../helpers/common';
import LoadingOverlay from '../Common/LoadingOverlay';
import Breadcrumbs from '../Layout/Breadcrumbs';
import ErrorModal from '../Common/ErrorModal';
import Tranche from './Tranche';
import {
  VERIFYING_ISSUANCE,
  REJECTING_ISSUANCE,
} from '../../data/const/processStatus';
import { formatDateToMonthDayYear } from 'helpers/date';

const columns = [
  {
    dataField: 'id',
    text: textContent.issuances.ID,
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: 'organization',
    text: textContent.issuances.ISSUE,
    sort: true,
    filter: textFilter(),
    sortFunc: (a, b, order, dataField, rowA, rowB) => {
      if (order === 'asc') {
        return rowA.maxVolume - rowB.maxVolume;
      }
      return rowB.maxVolume - rowA.maxVolume;
    },
    filterValue: (cell, row) => `${cell.ticker || cell.code}${row.maxVolume}`,
    formatter: (cell, row) => (
      <div>
        <span className="text-bold">{cell.ticker || cell.code}</span>
        {transformMillion(row.maxVolume)}
      </div>
    ),
  },
  {
    dataField: 'issueDate',
    text: textContent.issuances.ISSUE_DATE,
    sort: true,
    sortFunc: (a, b, order, dataField, rowA, rowB) => {
      if (order === 'asc') {
        return rowB.issueDate - rowA.issueDate;
      }
      return rowA.issueDate - rowB.issueDate;
    },
    formatter: (cell) => `${formatDateToMonthDayYear(cell)}`,
  },
  {
    dataField: 'status',
    text: textContent.issuances.STATUS,
    sort: true,
    headerStyle: () => {
      return { width: '33%' };
    },
    formatter: (cell) => <div className="text-capitalize">{cell}</div>,
  },
];

const Issuances = observer(() => {
  const [showRejectModal, hideRejectModal, isRejectModalVisible] =
    useModalMethods();
  const [showCancelModal, hideCancelModal, isCancelModalVisible] =
    useModalMethods();

  useEffect(() => {
    try {
      issuancesStore.getAllIssuances();
    } catch (e) {
      ErrorModal(e?.response?.message);
    }
  }, []);

  const handleOnRowSelect = (row) => {
    const id = row?.id;

    issuancesStore
      .getIssuance(id)
      .catch((e) => ErrorModal(e?.response?.message));
  };

  const verifyHandler = () => {
    try {
      issuancesStore.verifyIssuance(issuancesStore.currentIssuance?.id);
    } catch (e) {
      ErrorModal(e?.response?.data?.message);
    }
  };

  const selectRow = {
    mode: 'radio',
    clickToSelect: true,
    classes: 'selection-row',
    onSelect: handleOnRowSelect,
  };

  const defaultSorted = [
    {
      dataField: 'name',
      order: 'desc',
    },
  ];

  const pagination = paginationFactory({
    page: 1,
    sizePerPage: 10,
    showTotal: true,
    hideSizePerPage: true,
  });

  const downloadReport = () => {
    issuancesStore.getIssuanceReport(issuancesStore.currentIssuance?.id);
  };

  const downloadSettlement = () => {
    issuancesStore.getSettlementFile(issuancesStore.currentIssuance?.id);
  };

  function allowDownloadSettlement(status = '') {
    return status === IssuanceStatus.PRICING_COMPLETE ? true : false;
  }

  return (
    <div className="p-3 position-relative w-100 h-100">
      <Breadcrumbs
        className="mb-3"
        items={[
          { name: 'Home', href: '/admin' },
          { name: 'Issuances', href: '/admin/Issuances' },
        ]}
      />
      {isRejectModalVisible && (
        <RejectIssuanceModal
          closeModal={hideRejectModal}
          id={issuancesStore.currentIssuance?.id}
          issuancesStore={issuancesStore}
        />
      )}
      {isCancelModalVisible && (
        <CancelOrTerminateModal closeModal={hideCancelModal} />
      )}

      <Row className="w-100">
        <Col lg={6}>
          <Card className="mb-3">
            <CardHeader className="bg-white d-flex justify-content-between align-items-center">
              {issuancesStore.issuancesLength} Issuances
            </CardHeader>

            <CardBody className="position-relative">
              {(issuancesStore.loading ||
                issuancesStore.status === VERIFYING_ISSUANCE) && (
                <LoadingOverlay />
              )}

              <BootstrapTable
                keyField="id"
                bootstrap4
                selectRow={selectRow}
                defaultSorted={defaultSorted}
                data={issuancesStore.issuances}
                filter={filterFactory()}
                pagination={pagination}
                filterPosition="top"
                columns={columns}
              />
            </CardBody>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="mb-3">
            {issuancesStore.currentIssuance && (
              <CardHeader className="bg-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    {issuancesStore.currentIssuance?.organization.ticker ||
                      issuancesStore.currentIssuance?.organization.code}{' '}
                    {transformMillion(
                      issuancesStore.currentIssuance?.maxVolume,
                    )}
                  </div>
                  {issuancesStore.currentIssuance?.status ===
                    IssuanceStatus.REVIEWED && (
                    <div>
                      <LaddaButton
                        loading={issuancesStore.status === REJECTING_ISSUANCE}
                        onClick={showRejectModal}
                        data-size={MD}
                        data-style={SLIDE_RIGHT}
                        data-spinner-size={18}
                        data-spinner-color="#fff"
                        data-spinner-lines={12}
                        className="btn btn-sm btn-primary mr-3"
                      >
                        Reject
                      </LaddaButton>
                      <LaddaButton
                        loading={issuancesStore.status === VERIFYING_ISSUANCE}
                        onClick={verifyHandler}
                        data-size={MD}
                        data-style={SLIDE_RIGHT}
                        data-spinner-size={18}
                        data-spinner-color="#fff"
                        data-spinner-lines={12}
                        className="btn btn-sm btn-primary"
                      >
                        {textContent.issuances.VERIFY}
                      </LaddaButton>
                    </div>
                  )}
                  {issuancesStore.isCancelVisible && (
                    <Button color="primary" size="sm" onClick={showCancelModal}>
                      {textContent.issuances.CANCEL_ISSUE}
                    </Button>
                  )}
                  {allowDownloadSettlement(
                    issuancesStore?.currentIssuance?.status,
                  ) && (
                    <Button
                      color="primary"
                      size="sm"
                      onClick={downloadSettlement}
                    >
                      {textContent.issuances.DOWNLOAD_SETTLEMENT}
                    </Button>
                  )}
                  <Button color="primary" size="sm" onClick={downloadReport}>
                    {textContent.issuances.DOWNLOAD_REPORT}
                  </Button>
                </div>
              </CardHeader>
            )}

            <div className="px-3 mt-2">
              {issuancesStore.currentIssuance &&
                `${issuancesStore.tranchesLength} Tranche${
                  issuancesStore.tranchesLength > 1 ? 's' : ''
                }`}
            </div>

            <CardBody className="position-relative px-2 pb-2 pt-0 d-flex flex-row justify-content-start align-items-start flex-wrap">
              {(issuancesStore.loading ||
                issuancesStore.status === VERIFYING_ISSUANCE) && (
                <LoadingOverlay />
              )}

              {issuancesStore.currentIssuance ? (
                issuancesStore.currentIssuance.tranches?.map((tranche) => (
                  <Tranche
                    key={tranche.id}
                    className="iss-tranche"
                    tranche={tranche}
                  />
                ))
              ) : (
                <div className="d-flex align-items-start justify-content-center w-100 h-100 pt-5">
                  <h4 className="mb-5 text-weight-500 text-md">
                    {textContent.issuances.NO_ISSUANCE_SELECTED}
                  </h4>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
});

export default Issuances;
