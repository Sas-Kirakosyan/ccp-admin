import React from 'react';
import PropTypes from 'prop-types';
import Space from '../Common/Space';
import auditStore from '../../stores/auditStore';

export function createValue(type) {
  switch (type) {
    case 'organization':
      return auditStore.filters?.[type]?.code || '';
    case 'dateFrom':
    case 'dateTo':
      return new Date(auditStore.filters[type])?.toLocaleString();
    default:
      return auditStore.filters[type] || '';
  }
}

function AppliedFilterElement({
  isShow,
  title,
  handleRemoveFilter = () => {},
  type,
}) {
  if (!isShow) {
    return <></>;
  }

  function removeFilter() {
    handleRemoveFilter(type);
  }

  return (
    <div
      data-testid="apply_filter"
      className="text-sm text-secondary px-2 p-1 border bg-white m-1 d-flex align-items-center"
    >
      <b>{title}:</b>
      <Space width={2} />
      <span>{createValue(type)}</span>
      <i
        className="far fa-times-circle ml-1 cursor-pointer"
        onClick={removeFilter}
      ></i>
    </div>
  );
}

export default AppliedFilterElement;

AppliedFilterElement.propTypes = {
  isShow: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  handleRemoveFilter: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};
