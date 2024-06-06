import React from 'react';

import moment from 'moment';
import { Button, FormGroup } from 'reactstrap';

import LaddaButton, { SM, SLIDE_RIGHT } from 'react-ladda';
import BootstrapTable from 'react-bootstrap-table-next';

import orgsStore from '../../stores/orgsStore';

const rateColumns = [
  {
    dataField: 'Moody',
    text: "Moody's",
  },
  {
    dataField: 'SpRating',
    text: 'S&P',
  },
  {
    dataField: 'FitchRating',
    text: 'Fitch',
  },
  {
    dataField: 'ratingDate',
    text: 'Date',
    sort: true,
    formatter: (cell) => moment(cell).format('L'),
  },
];

const defaultSortedBy = [
  {
    dataField: 'ratingDate',
    order: 'desc',
  },
];

const RatingHistory = ({ ratingIds, handleCancel, disabled, setRatingIds }) => {
  const handleSaveChanges = () => {
    orgsStore.setOrgRating(ratingIds);
    setRatingIds({});
  };

  return (
    <div className="position-relative mt-3">
      <BootstrapTable
        keyField="id"
        bootstrap4
        data={orgsStore.ratingDateForTable}
        columns={rateColumns}
        defaultSorted={defaultSortedBy}
      />

      <FormGroup className="d-flex align-items-center justify-content-end mt-2">
        <Button className="btn-xs mr-1" color="link" onClick={handleCancel}>
          Cancel
        </Button>
        <LaddaButton
          disabled={disabled}
          loading={false}
          onClick={handleSaveChanges}
          data-size={SM}
          data-style={SLIDE_RIGHT}
          data-spinner-size={18}
          data-spinner-color="#fff"
          data-spinner-lines={12}
          className="btn btn-primary btn-xs"
        >
          Save Changes
        </LaddaButton>
      </FormGroup>
    </div>
  );
};

export default RatingHistory;
