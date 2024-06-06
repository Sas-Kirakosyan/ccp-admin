import PropTypes from 'prop-types';

import ConfirmDeleteModal from '../Common/ConfirmDeleteModal';
import ErrorModal from '../Common/ErrorModal';
import rolesStore from '../../stores/rolesStore';
import uiStore from '../../stores/uiStore';

export const ActionsCell = ({ id }) => {
  const handleDeleteRole = async () => {
    try {
      const result = await ConfirmDeleteModal(
        'Are you sure you want to delete this role?',
      );
      if (result.isConfirmed) {
        rolesStore.deleteRole(id);
      }
    } catch (e) {
      ErrorModal(e?.response?.message);
    }
  };

  const handleEditRole = async () => {
    const response = await rolesStore
      .getRole(id)
      .catch((e) => ErrorModal(e?.response?.message));
    if (response === 'ok') {
      rolesStore.setIsEditing();
      uiStore.toggleModal('role');
    }
  };

  return (
    <div className="d-flex justify-content-around">
      <div className="p-1 cursor-pointer" onClick={handleEditRole}>
        <i className="far fa-edit text-primary"></i>
      </div>
      <div className="p-1 cursor-pointer" onClick={handleDeleteRole}>
        <i className="fas fa-trash-alt text-danger"></i>
      </div>
    </div>
  );
};

ActionsCell.propTypes = {
  dataItem: PropTypes.instanceOf(Object),
};
