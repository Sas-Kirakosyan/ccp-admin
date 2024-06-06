import PropTypes from 'prop-types';

import InfoPopover from '../Common/InfoPopover';

const PermissionsCell = ({ userEffectivePermissions, userId }) => {
  if (userEffectivePermissions?.length === 0) return '-';

  const permissionsArray = userEffectivePermissions.split(',');

  if (userEffectivePermissions?.length === 1)
    return <span className="highlight-word m-1">{permissionsArray[0]}</span>;

  return (
    <div
      className="d-flex align-items-end w-100 h-100 flex-nowrap cursor-pointer"
      id={`effectPermPop${userId}`}
    >
      <span className="highlight-word m-1">{permissionsArray[0]}</span>

      <InfoPopover
        targetId={`effectPermPop${userId}`}
        placement="bottom"
        className="grid-popover"
        title={''}
        desc={''}
      >
        {permissionsArray.map((permission, i) => {
          return (
            <span key={i} className="highlight-word m-1">
              {permission}
            </span>
          );
        })}
      </InfoPopover>

      <span className="pb-1">...</span>
    </div>
  );
};

PermissionsCell.propTypes = {
  dataItem: PropTypes.instanceOf(Object),
};

export default PermissionsCell;
