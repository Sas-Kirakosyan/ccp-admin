import PropTypes from 'prop-types';

import permissionsStore from '../../stores/permissionsStore';
import ErrorModal from '../Common/ErrorModal';
import uiStore from '../../stores/uiStore';
import ConfirmDeleteModal from '../Common/ConfirmDeleteModal';

const ActionsCell = ({ id }) => {
  const handleDeletePerm = async () => {
    try {
      const result = await ConfirmDeleteModal(
        'Are you sure you want to delete this permission?',
      );
      if (result.isConfirmed) {
        permissionsStore.deletePermission(id);
      }
    } catch (e) {
      ErrorModal(e?.response?.message);
    }
  };

  const handleEditPermission = async () => {
    try {
      const response = await permissionsStore.getPermission(id);
      if (response === 'ok') {
        permissionsStore.setIsEditing();
        uiStore.toggleModal('permission');
      }
    } catch (e) {
      ErrorModal(e?.response?.message);
    }
  };

  return (
    <div className="d-flex justify-content-around">
      <div className="p-1 cursor-pointer" onClick={handleEditPermission}>
        <i className="far fa-edit text-primary"></i>
      </div>
      <div className="p-1 cursor-pointer" onClick={handleDeletePerm}>
        <i className="fas fa-trash-alt text-danger"></i>
      </div>
    </div>
  );
};

ActionsCell.propTypes = {
  dataItem: PropTypes.instanceOf(Object),
};

export const StatusCell = ({ isAdvanced }) => {
  if (isAdvanced) {
    return (
      <div className="d-flex justify-content-center">
        <i className="far fa-check-circle text-success"></i>
      </div>
    );
  } else {
    return <></>;
  }
};

StatusCell.propTypes = {
  dataItem: PropTypes.instanceOf(Object),
};

export const permissionsColumn = [
  {
    dataField: 'resource',
    text: 'Resource',
    formatter: (row) => (row ? row : '-'),
    headerStyle: () => {
      return { width: '7%' };
    },
    sort: true,
  },
  {
    dataField: 'action',
    text: 'Action',
    headerStyle: () => {
      return { width: '10%' };
    },
    sort: true,
  },
  {
    dataField: 'description',
    text: 'Description',
    headerStyle: () => {
      return { width: '24%' };
    },
    sort: true,
  },
  {
    dataField: 'isAdvanced',
    text: 'Is Advanced',
    formatter: (cell) => <StatusCell isAdvanced={cell} />,
    headerStyle: () => {
      return { width: '7%' };
    },
  },
  {
    dataField: 'id',
    text: 'Actions',
    formatter: (cell) => {
      return <ActionsCell key={cell} id={cell} />;
    },
    headerStyle: () => {
      return { width: '7%' };
    },
  },
];
