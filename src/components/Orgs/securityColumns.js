import ConfirmDeleteModal from '../Common/ConfirmDeleteModal';
import ErrorModal from '../Common/ErrorModal';
import uiStore from '../../stores/uiStore';
import orgsStore from '../../stores/orgsStore';
import { formatDateToMonthDayYear } from 'helpers/date';

const ActionsCell = ({ cell }) => {
  const handleDeleteSecurity = async () => {
    try {
      const result = await ConfirmDeleteModal(
        'Are you sure you want to delete this existing security?',
      );
      if (result.isConfirmed) {
        orgsStore.deleteSecurity(cell);
      }
    } catch (e) {
      ErrorModal(e?.response?.message);
    }
  };

  const handleEditSecurity = () => {
    orgsStore.setCurrentSecurity(cell);
    uiStore.toggleModal('security');
  };

  return (
    <div className="d-flex justify-content-left">
      <div className="p-1 mr-3 cursor-pointer" onClick={handleEditSecurity}>
        <i className="far fa-edit text-primary"></i>
      </div>
      <div className="p-1 ml-3 cursor-pointer" onClick={handleDeleteSecurity}>
        <i className="fas fa-trash-alt text-danger"></i>
      </div>
    </div>
  );
};

export const securityColumns = [
  {
    dataField: 'cusip',
    text: 'CUSIP',
  },
  {
    dataField: 'coupon',
    text: 'Coupon',
  },
  {
    dataField: 'maturityDate',
    text: 'Maturity',
    formatter: (cell) => `${formatDateToMonthDayYear(cell)}`,
  },
  {
    dataField: 'principalAmount',
    text: 'Aggregate Principal Amount',
    headerStyle: () => {
      return { width: '27%' };
    },
  },
  {
    dataField: 'id',
    text: 'Actions',
    formatter: (cell) => <ActionsCell cell={cell} />,
  },
];
