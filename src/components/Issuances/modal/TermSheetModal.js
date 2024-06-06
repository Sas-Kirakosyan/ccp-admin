import React, { useCallback, useMemo } from 'react';

import PropTypes from 'prop-types';

import { Modal, ModalBody } from 'reactstrap';
import { format } from 'date-fns';

import { observer } from 'mobx-react';
import { DataTable } from './DataTable/DataTable';
import LoadingOverlay from '../../Common/LoadingOverlay';
import { capitalize, toSplitCamelCase } from '../../../helpers/common';

import TableRow from './TableRow';
import issuancesStore from '../../../stores/issuancesStore';
import { months } from '../../../data/const/constants';

const modalBodyHeight = {
  maxHeight: '75vh',
  overflow: 'scroll',
};

const MultipleDates = ({ month, day }) => {
  return (
    <span>
      {month}-{day},{' '}
    </span>
  );
};

const TermSheetModal = observer(({ isOpen, toggle }) => {
  const handleToggleModal = () => {
    toggle();
  };

  const termSheet = issuancesStore.termSheet;

  const createTermSheetData = useMemo(() => {
    const termSheetData = [];
    for (const key in termSheet) {
      switch (key) {
        case 'issuer':
          termSheetData.push({
            key: capitalize(toSplitCamelCase(key)),
            value: termSheet[key].name || '-',
          });
          break;
        case 'guarantors':
          termSheetData.push({
            key: capitalize(toSplitCamelCase(key)),
            value: termSheet[key].join(', ') || '-',
          });
          break;
        case 'maturityDate':
          termSheetData.push({
            key: capitalize(toSplitCamelCase(key)),
            value: format(new Date(termSheet[key]), 'MM/dd/yyyy'),
          });
          break;
        case 'tradeDate':
          termSheetData.push({
            key: capitalize(toSplitCamelCase(key)),
            value: format(new Date(termSheet[key]), 'MM/dd/yyyy'),
          });
          break;
        case 'settlementDate':
          termSheetData.push({
            key: capitalize(toSplitCamelCase(key)),
            value: format(new Date(termSheet[key]), 'MM/dd/yyyy'),
          });
          break;
        case 'benchmarkName':
          termSheetData.push({
            key: capitalize(toSplitCamelCase(key)),
            value: termSheet[key],
          });
          break;
        case 'settlementDays':
          termSheetData.push({
            key: capitalize(toSplitCamelCase(key)),
            value: termSheet[key],
          });
          break;
        case 'denominationMinimum':
          termSheetData.push({
            key: capitalize(toSplitCamelCase(key)),
            value: termSheet[key].toString(),
          });
          break;
        case 'denominationIncrement':
          termSheetData.push({
            key: capitalize(toSplitCamelCase(key)),
            value: termSheet[key].toString(),
          });
          break;
        case 'interestPaymentDates':
          termSheetData.push({
            key: capitalize(toSplitCamelCase(key)),
            value:
              (termSheet[key] &&
                Array.isArray(termSheet[key]) &&
                termSheet[key].map((el) => (
                  <MultipleDates
                    key={el.day + el.month}
                    month={months[`${el.month}`]}
                    day={el.day}
                  />
                ))) ||
              '-',
          });
          break;
        case 'interestRecordDates':
          termSheetData.push({
            key: capitalize(toSplitCamelCase(key)),
            value:
              (termSheet[key] &&
                Array.isArray(termSheet[key]) &&
                termSheet[key].map((el) => (
                  <MultipleDates
                    key={el.day + el.month}
                    month={months[`${el.month}`]}
                    day={el.day}
                  />
                ))) ||
              '-',
          });
          break;
        default:
          termSheetData.push({
            key: capitalize(toSplitCamelCase(key)),
            value: Array.isArray(termSheet[key])
              ? '-'
              : termSheet[key]?.toString() || '-',
          });
      }
    }
    return termSheetData;
  }, [termSheet]);

  const tableBodyContent = useCallback(
    () =>
      createTermSheetData.map((termSheetItem) => (
        <TableRow key={termSheetItem.key}>
          <td>
            <span className="font-weight-bold text-primary">
              {termSheetItem.key}
            </span>
          </td>
          <td className="text-right">
            <span className="font-weight-bold">{termSheetItem.value}</span>
          </td>
        </TableRow>
      )),
    [createTermSheetData],
  );

  return (
    <Modal
      size="lg"
      fade={false}
      isOpen={isOpen}
      style={{ maxWidth: '700px', width: '100%' }}
    >
      <div className="px-3 py-2 modal-header d-flex align-items-center justify-content-between">
        <h6 className="mb-0">Term Sheet</h6>
        <i
          className="fas fa-times p-2 cursor-pointer"
          onClick={handleToggleModal}
        ></i>
      </div>
      <ModalBody style={modalBodyHeight}>
        {issuancesStore.loading ? (
          <LoadingOverlay />
        ) : (
          <DataTable className="p-2" tableBodyContent={tableBodyContent} />
        )}
      </ModalBody>
    </Modal>
  );
});

export default TermSheetModal;

TermSheetModal.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
};
