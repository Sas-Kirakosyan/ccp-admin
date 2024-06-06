import ConfirmDeleteModal from '../Common/ConfirmDeleteModal';
import uiStore from '../../stores/uiStore';
import usersStore from '../../stores/usersStore';
import ErrorModal from '../Common/ErrorModal';
import referenceStore from '../../stores/referenceStore';
import applicationStore from '../../stores/applicationStore';

const AccessCell = ({ authorizedApplications }) => {
  let apps = [];
  if (authorizedApplications?.length > 0 && referenceStore.apps?.length > 0) {
    apps = referenceStore.apps
      .filter((app) => authorizedApplications.includes(app.externalId))
      .map((app) => ({
        key: app.externalId,
        label: app.name,
        value: app.code,
        ...app,
      }));
  }
  if (apps.length > 0) {
    return (
      <div className="d-flex flex-wrap w-100 h-100">
        {apps.map((app) => {
          return (
            <span key={app.key} className="highlight-word m-1">
              {app.name}
            </span>
          );
        })}
      </div>
    );
  } else {
    return <></>;
  }
};

const ActionsCell = ({ id, emailVerified }) => {
  const handleEditUser = async () => {
    try {
      const response = await usersStore.getUser(id);
      if (response === 'ok') {
        uiStore.toggleModal('user');
      }
    } catch (e) {
      ErrorModal(e?.response?.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const result = await ConfirmDeleteModal(
        'Are you sure you want to delete this user?',
      );
      if (result.isConfirmed) {
        usersStore.deleteUser(id);
      }
    } catch (e) {
      ErrorModal(e?.response?.message);
    }
  };

  const handleSendInvide = () => {
    usersStore.sendInvite(id);
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-between">
        {emailVerified && <i className="far fa-check-circle text-success"></i>}

        {!emailVerified && applicationStore.permissions.user?.verify && (
          <button
            className="btn btn-xs grid-action ml-1"
            onClick={handleSendInvide}
          >
            <i className="far fa-envelope"></i>Invite
          </button>
        )}
        <div className="p-1 cursor-pointer" onClick={handleEditUser}>
          <i className="far fa-edit text-primary"></i>
        </div>
        <div className="p-1 cursor-pointer" onClick={handleDeleteUser}>
          <i className="fas fa-trash-alt text-danger"></i>
        </div>
      </div>
    </>
  );
};

export const usersColumn = [
  {
    dataField: 'id',
    text: 'Id',
    headerStyle: () => {
      return { width: '5%' };
    },
    sort: true,
  },

  {
    dataField: 'fullName',
    text: 'Name',
    headerStyle: () => {
      return { width: '9%' };
    },
    sort: true,
  },
  {
    dataField: 'email',
    text: 'E-mail',
    headerStyle: () => {
      return { width: '10%' };
    },
    sort: true,
  },
  {
    dataField: 'organization.name',
    text: 'Organization',
    formatter: (row) => (row ? row : '-'),
    headerStyle: () => {
      return { width: '10%' };
    },
  },
  {
    dataField: 'roles',
    text: 'Roles',
    formatter: (row) => {
      return row.map((role) => {
        return (
          <div key={role.id} className="d-flex flex-wrap w-100 h-100">
            <span className="highlight-word m-1">{role.name}</span>
          </div>
        );
      });
    },
    headerStyle: () => {
      return { width: '13%' };
    },
  },
  {
    dataField: 'authorizedApplications',
    text: 'Authorized Applications',
    formatter: (authorizedApplications) => (
      <AccessCell authorizedApplications={authorizedApplications} />
    ),
    headerStyle: () => {
      return { width: '12%' };
    },
  },
  {
    dataField: 'isSyncRequired',
    text: 'Synced',
    headerStyle: () => {
      return { width: '5%' };
    },
  },

  {
    dataField: 'emailVerified',
    text: 'Actions',
    formatter: (cell, row) => {
      const { id } = row;
      return <ActionsCell key={id} id={id} emailVerified={cell} />;
    },
    headerStyle: () => {
      return { width: '7%' };
    },
  },
];
