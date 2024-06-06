import React from 'react';
import auditStore from '../../stores/auditStore';
import AppliedFilterElement from './AppliedFilterElement';
import { addSpacAndCapitalazeFirtLetter } from '../../helpers/common';

const AppliedFilters = () => {
  const handleRemoveFilter = (type) => {
    auditStore.removeFilter(type);
  };

  const data = Object.keys(auditStore.filters).map((name) => ({
    name,
    title: addSpacAndCapitalazeFirtLetter(name),
    isShow: auditStore.appliedFilters[name] || false,
  }));

  return (
    <>
      {data.map((el) => (
        <AppliedFilterElement
          key={el.name}
          type={el.name}
          title={el.title}
          isShow={el.isShow}
          handleRemoveFilter={handleRemoveFilter}
        />
      ))}
    </>
  );
};

export default AppliedFilters;
