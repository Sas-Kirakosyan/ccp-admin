import React from 'react';

import PropTypes from 'prop-types';

import TextEllipsis from '../Common/TextEllipsis';
import InfoPopover from '../Common/InfoPopover';
import useCopyIcon from '../Hooks/useCopyIcon';

const EntityValueCell = ({ dataIndex, entityValue }) => {
  const [copyIcon, handleCopy] = useCopyIcon();

  if (!entityValue) return '-';

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(entityValue);
    handleCopy();
  };

  return (
    <div
      className="d-flex w-100 h-100 flex-nowrap cursor-pointer"
      id={`entityValue${dataIndex}`}
    >
      <TextEllipsis width={120}>{entityValue}</TextEllipsis>

      <i
        className={`${copyIcon} cursor-pointer p-1`}
        onClick={handleCopyToClipboard}
      ></i>

      <InfoPopover
        targetId={`entityValue${dataIndex}`}
        placement="bottom"
        className="grid-popover"
        title={''}
        desc={''}
      >
        {entityValue}
      </InfoPopover>
    </div>
  );
};

export default EntityValueCell;

EntityValueCell.propTypes = {
  dataIndex: PropTypes.number,
  dataItem: PropTypes.instanceOf(Object),
};
