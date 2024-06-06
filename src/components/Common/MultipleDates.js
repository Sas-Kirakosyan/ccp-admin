import PropTypes from 'prop-types';
import { range } from 'range';
import { getDaysInMonth, setMonth } from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';
import orgsStore from '../../stores/orgsStore';

import { CustomSelect } from './CustomSelect';

const monthOptions = [
  {
    id: 'January',
    label: 'January',
    value: 0,
  },
  {
    id: 'February',
    label: 'February',
    value: 1,
  },
  {
    id: 'March',
    label: 'March',
    value: 2,
  },
  {
    id: 'April',
    label: 'April',
    value: 3,
  },
  {
    id: 'May',
    label: 'May',
    value: 4,
  },
  {
    id: 'June',
    label: 'June',
    value: 5,
  },
  {
    id: 'July',
    label: 'July',
    value: 6,
  },
  {
    id: 'August',
    label: 'August',
    value: 7,
  },
  {
    id: 'September',
    label: 'September',
    value: 8,
  },
  {
    id: 'October',
    label: 'October',
    value: 9,
  },
  {
    id: 'November',
    label: 'November',
    value: 10,
  },
  {
    id: 'December',
    label: 'December',
    value: 11,
  },
];

const selectStyles = {
  width: '115px',
};

// TODO make more flexible (FE: allow to get dynamically more than 2 dates)
export const MultipleDates = ({
  isDisabled,
  onChange,
  firstDate,
  secondDate,
  type,
}) => {
  const [firstMonth, setFirstMonth] = useState(firstDate?.month);
  const [secondMonth, setSecondMonth] = useState(secondDate?.month);

  const [firstMonthDay, setFirstMonthDay] = useState(firstDate?.day);
  const [secondMonthDay, setSecondMonthDay] = useState(secondDate?.day);

  const handleMonthChange = (name, { value }) => {
    orgsStore.handleMultipleMonth(type, name, value);
    if (name === 'firstMonth') {
      setFirstMonth(value);
    } else {
      setSecondMonth(value);
    }
  };

  const handleDayChange = (name, { value }) => {
    orgsStore.handleMultipleDay(type, name, value);
    if (name === 'firstMonthDays') {
      setFirstMonthDay(value);
    } else {
      setSecondMonthDay(value);
    }
  };

  const firstPeriodDaysOptions = useMemo(() => {
    if (firstMonth === null) {
      return [];
    }
    return range(getDaysInMonth(setMonth(new Date(), firstMonth))).map(
      (day) => ({ id: day, value: day + 1, label: `${day + 1}` }),
    );
  }, [firstMonth]);

  const secondPeriodDaysOptions = useMemo(() => {
    if (secondMonth === null) {
      return [];
    }
    return range(getDaysInMonth(setMonth(new Date(), secondMonth))).map(
      (day) => ({ id: day, value: day + 1, label: `${day + 1}` }),
    );
  }, [secondMonth]);

  useEffect(() => {
    onChange({ name: type, ind: 0, month: firstMonth, day: firstMonthDay });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstMonth, firstMonthDay]);

  useEffect(() => {
    onChange({ name: type, ind: 1, month: secondMonth, day: secondMonthDay });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondMonth, secondMonthDay]);

  return (
    <div className="d-flex flex-column justify-content-between">
      <div className="d-flex align-items-center justify-content-between">
        <CustomSelect
          key={1}
          disabled={isDisabled}
          value={firstMonth}
          wrapperStyles={selectStyles}
          placeholder="Month"
          wrapperClassName="mr-2"
          name="firstMonth"
          options={monthOptions}
          onChange={handleMonthChange}
        />
        <CustomSelect
          key={2}
          className="width-sm"
          isDisabled={isDisabled}
          wrapperStyles={selectStyles}
          value={firstMonthDay}
          placeholder="Days"
          name="firstMonthDays"
          options={firstPeriodDaysOptions}
          onChange={handleDayChange}
        />
      </div>
      <div className="d-flex align-items-center justify-content-between mt-2">
        <CustomSelect
          key={3}
          className="width-sm"
          isDisabled={isDisabled}
          wrapperStyles={selectStyles}
          value={secondMonth}
          placeholder="Month"
          name="secondMonth"
          options={monthOptions}
          onChange={handleMonthChange}
        />
        <CustomSelect
          key={4}
          className="width-sm"
          isDisabled={isDisabled}
          wrapperStyles={selectStyles}
          value={secondMonthDay}
          placeholder="Days"
          name="secondMonthDays"
          options={secondPeriodDaysOptions}
          onChange={handleDayChange}
        />
      </div>
    </div>
  );
};

MultipleDates.defaultProps = {
  onChange: () => {},
};
MultipleDates.propTypes = {
  type: PropTypes.string,
  isDisabled: PropTypes.bool,
  onChange: PropTypes.func,
};
