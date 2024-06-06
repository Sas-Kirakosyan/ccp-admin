import React from 'react';

import PropTypes from 'prop-types';

import Header from './Header';
import { ToastContainer } from 'react-toastify';
import { useAuth0 } from '@auth0/auth0-react';
import AsidePanel from './AsidePanel';
import { observer } from 'mobx-react';
import uiStore from '../../stores/uiStore';
import OrgModal from '../Orgs/OrgModal';
import UserModal from '../Users/UserModal';
import PermissionModal from '../Permissions/PermissionModal';
import TermSheetModal from '../Issuances/modal/TermSheetModal';
import RoleModal from '../Roles/RoleModal';
import SecurityModal from '../Orgs/SecurityModal';
import applicationStore from '../../stores/applicationStore';
import { AdjustBidModal } from 'components/Issuances/modal/AdjustBidModal';
import { LastBidTableModal } from 'components/Issuances/modal/LastBidTableModal';
import { RemoveBidderModal } from 'components/Issuances/modal/RemoveBidderModal';
import { RemoveBidderTableModal } from 'components/Issuances/modal/RemoveBidderTableModal';

const Base = observer(({ children }) => {
  const { isAuthenticated } = useAuth0();

  return (
    <div className={'main-wrapper' + (!isAuthenticated ? ' pt-0' : '')}>
      {isAuthenticated && !applicationStore.loading && <Header />}

      <div className="content-wrapper">
        <AsidePanel
          collapsed={uiStore.asideNavCollapsed}
          onToggle={uiStore.toggleAsideNav}
        />
        {children}
      </div>

      <ToastContainer />
      {uiStore.modals.org && (
        <OrgModal
          toggle={() => uiStore.toggleModal('org')}
          isOpen={uiStore.modals.org}
        />
      )}
      <UserModal
        toggle={() => uiStore.toggleModal('user')}
        isOpen={uiStore.modals.user}
      />
      <RoleModal
        toggle={() => uiStore.toggleModal('role')}
        isOpen={uiStore.modals.role}
      />
      <PermissionModal
        toggle={() => uiStore.toggleModal('permission')}
        isOpen={uiStore.modals.permission}
      />
      <TermSheetModal
        toggle={() => uiStore.toggleModal('termsheet')}
        isOpen={uiStore.modals.termsheet}
      />
      {uiStore.modals.security && (
        <SecurityModal
          toggle={() => uiStore.toggleModal('security')}
          isOpen={uiStore.modals.security}
        />
      )}
      {uiStore.modals.adjustBid && (
        <AdjustBidModal
          toggle={() => uiStore.toggleModal('adjustBid')}
          isOpen={uiStore.modals.adjustBid}
        />
      )}
      {uiStore.modals.lastBidTable && (
        <LastBidTableModal
          toggle={() => uiStore.toggleModal('lastBidTable')}
          isOpen={uiStore.modals.lastBidTable}
        />
      )}
      {uiStore.modals.removeBidderModal && (
        <RemoveBidderModal
          toggle={() => uiStore.toggleModal('removeBidderModal')}
          isOpen={uiStore.modals.removeBidderModal}
        />
      )}
      {uiStore.modals.removeBidderTable && (
        <RemoveBidderTableModal
          toggle={() => uiStore.toggleModal('removeBidderTable')}
          isOpen={uiStore.modals.removeBidderTable}
        />
      )}
    </div>
  );
});

export default Base;

Base.propTypes = {
  children: PropTypes.node,
};
