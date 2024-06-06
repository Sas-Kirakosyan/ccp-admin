import React, { useState } from 'react';
import ReactSelectComponent from '../Common/ReactSelectComponent';
import auditStore from '../../stores/auditStore';
import orgsStore from '../../stores/orgsStore';
import DatePicker from 'react-datepicker';
import { Card, FormFeedback, Input, Button } from 'reactstrap';
import { observer } from 'mobx-react';
import { Collapse, Row, Col } from 'reactstrap';
import AppliedFilters from './AppliedFilters';

import {
  FIRST_COLUMN_FILTER,
  SECOND_COLUMN_FILTER,
} from '../../data/const/constants';

const Filters = observer(() => {
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilterPanel = () => setShowFilters(!showFilters);

  const calendarFromRef = React.createRef();
  const calendarToRef = React.createRef();
  const [calendarFromIsOpen, setCalendarFromIsOpen] = useState(false);
  const [calendarToIsOpen, setCalendarToIsOpen] = useState(false);

  const handleToggleCalendar = (type) => {
    if (type === 'from') {
      calendarFromRef.current.setOpen(!calendarFromIsOpen);
      setCalendarFromIsOpen(!calendarFromIsOpen);
    } else {
      calendarToRef.current.setOpen(!calendarToIsOpen);
      setCalendarToIsOpen(!calendarToIsOpen);
    }
  };

  const handleApplyFilters = async () => {
    const result = await auditStore.applyFilters();
    if (!result?.errors) toggleFilterPanel();
  };

  const handleResetFilters = () => {
    toggleFilterPanel();
    auditStore.resetAllFilters();
  };

  const handleChange = (e) => {
    auditStore.setFilter(e.target.name, e.target.value);
  };

  function createName(str) {
    return str.replace(/ /, '').toLocaleLowerCase();
  }

  return (
    <div>
      <div className="d-flex mb-2 flex-wrap">
        <div
          className="filter-toggle text-sm text-secondary mr-2 my-1"
          onClick={toggleFilterPanel}
        >
          <i className="fas fa-filter"></i>
          {showFilters ? 'Hide Filters' : 'Filter'}
        </div>

        <AppliedFilters />
      </div>

      <Collapse isOpen={showFilters}>
        <Card className="mb-3 p-3 d-flex flex-column align-items-start">
          <div className="w-100">
            <Row>
              <Col lg={3}>
                {FIRST_COLUMN_FILTER.map((el) => (
                  <div className="mb-2" key={el}>
                    <label className="text-xs mb-0">{el}</label>
                    <Input
                      placeholder=""
                      name={createName(el)}
                      onChange={handleChange}
                      value={auditStore.filters[`${createName(el)}`] || ''}
                    />
                  </div>
                ))}
              </Col>
              <Col lg={3}>
                {SECOND_COLUMN_FILTER.map((el) => (
                  <div className="mb-2" key={el}>
                    <label className="text-xs mb-0">{el}</label>
                    <Input
                      placeholder=""
                      name={createName(el)}
                      onChange={handleChange}
                      value={auditStore.filters[`${createName(el)}`] || ''}
                    />
                  </div>
                ))}
              </Col>
              <Col lg={4}>
                <div className="mb-2">
                  <label className="mb-0 text-sm">Organization:</label>
                  <ReactSelectComponent
                    placeholder="Select"
                    className="width-md height-md mr-3"
                    value={auditStore.filters.organization}
                    onChange={(s) => auditStore.setOrg(s)}
                    options={orgsStore.orgs?.map((org, i) => {
                      return {
                        key: i,
                        label: org.name,
                        value: org.code,
                        ...org,
                      };
                    })}
                  />
                </div>

                <div className="d-flex mb-2 align-items-center">
                  <div className="mr-3 audit-filter-datepicker">
                    <label className="mb-0 text-sm">Date From:</label>
                    <div
                      className={`w-auto datepicker-wrapper height-md ${
                        auditStore.errors?.dateRange ? 'is-invalid' : ''
                      }`}
                    >
                      <DatePicker
                        ref={calendarFromRef}
                        pastDates={true}
                        className="form-control width-md"
                        selected={auditStore.filters.dateFrom}
                        showTimeSelect={true}
                        timeFormat="p"
                        timeIntervals={5}
                        dateFormat="yyyy/MM/dd, HH:mm:ss a"
                        onChange={(date) =>
                          auditStore.setDate(date, 'dateFrom')
                        }
                      />
                      <i
                        className="fas fa-calendar-alt"
                        onClick={() => handleToggleCalendar('from')}
                      />
                    </div>
                  </div>
                  <div className="audit-filter-datepicker">
                    <label className="mb-0 text-sm">Date To:</label>
                    <div
                      className={`w-auto datepicker-wrapper height-md ${
                        auditStore.errors?.dateRange ? 'is-invalid' : ''
                      }`}
                    >
                      <DatePicker
                        ref={calendarToRef}
                        className="form-control width-md"
                        selected={auditStore.filters.dateTo}
                        minDate={auditStore.filters.dateFrom}
                        showTimeSelect={true}
                        timeFormat="p"
                        timeIntervals={5}
                        dateFormat="yyyy/MM/dd H:mm:s a"
                        onChange={(date) => auditStore.setDate(date, 'dateTo')}
                      />
                      <i
                        className="fas fa-calendar-alt"
                        onClick={() => handleToggleCalendar('to')}
                      />
                    </div>
                  </div>
                </div>

                {auditStore.errors?.dateRange && (
                  <FormFeedback className="d-flex">
                    {auditStore.errors?.dateRange}
                  </FormFeedback>
                )}
              </Col>
            </Row>

            <div className="filter-actions d-flex align-items-center justify-content-end">
              <Button onClick={handleResetFilters} size="xs" color="link">
                <i className="fas fa-redo mr-1"></i>
                Reset All Filters
              </Button>
              <Button
                className="ml-2"
                onClick={handleApplyFilters}
                size="xs"
                color="primary"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </Card>
      </Collapse>
    </div>
  );
});

export default Filters;
