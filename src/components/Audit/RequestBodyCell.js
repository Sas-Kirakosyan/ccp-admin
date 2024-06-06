import React from 'react';

import PropTypes from 'prop-types';

import TextEllipsis from '../Common/TextEllipsis';
import InfoPopover from '../Common/InfoPopover';
import useCopyIcon from '../Hooks/useCopyIcon';

const RequestBodyCell = ({ requestBody, dataIndex }) => {
  const [copyIcon, handleCopy] = useCopyIcon();

  if (!requestBody) return '-';

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(requestBody);
    handleCopy();
  };

  return (
    <div
      key={dataIndex}
      className="d-flex w-100 h-100 flex-nowrap cursor-pointer"
      id={`reqBody${dataIndex}`}
    >
      <TextEllipsis width={120}>{requestBody}</TextEllipsis>
      <i
        className={`${copyIcon} cursor-pointer p-1`}
        onClick={handleCopyToClipboard}
      ></i>

      <InfoPopover
        targetId={`reqBody${dataIndex}`}
        placement="bottom"
        className="grid-popover"
        title=""
        desc=""
      >
        {requestBody}
      </InfoPopover>
    </div>
  );
};

export default RequestBodyCell;

RequestBodyCell.propTypes = {
  dataItem: PropTypes.instanceOf(Object),
};
