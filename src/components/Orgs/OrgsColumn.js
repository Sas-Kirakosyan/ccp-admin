import { textFilter } from 'react-bootstrap-table2-filter';
import { format } from 'date-fns';
import { transformMillion } from '../../helpers/common';

import uiStore from '../../stores/uiStore';
import orgsStore from '../../stores/orgsStore';

const handleEditOrg = async (e, code) => {
  e.stopPropagation();
  const response = await orgsStore.getOrg(code);
  if (response === 'ok') {
    orgsStore.setIsEditing();
    uiStore.toggleModal('org');
  }
};

export const orgsColumn = [
  {
    dataField: 'ticker',
    text: 'Ticker',
    formatter: (row) => (row ? row : '-'),
    headerStyle: () => {
      return { width: '7%' };
    },
    sort: true,
    filter: textFilter(),
  },

  {
    dataField: 'name',
    text: 'Name',
    headerStyle: () => {
      return { width: '11%' };
    },
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: 'type',
    text: 'Type',
    headerStyle: () => {
      return { width: '6%' };
    },
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: 'investorCategory',
    text: 'Investor Category',
    formatter: (row) => (row ? row : '-'),
    headerStyle: () => {
      return { width: '10%' };
    },
  },
  {
    dataField: 'sector',
    text: 'Sector',
    formatter: (row) => {
      const { name } = row || {};
      return name || '-';
    },
    headerStyle: () => {
      return { width: '11%' };
    },
  },
  {
    dataField: 'industry',
    text: 'Industry',
    formatter: (row) => {
      const { name } = row || {};
      return name || '';
    },
    headerStyle: () => {
      return { width: '11%' };
    },
  },
  {
    dataField: 'buyingPower',
    text: 'Buying Power',
    formatter: (row) => (row ? transformMillion(row) : '-'),
    headerStyle: () => {
      return { width: '8%' };
    },
  },
  {
    dataField: 'creditLimitVolume',
    text: 'Credit Limit',
    formatter: (row) => (row ? transformMillion(row) : '-'),
    headerStyle: () => {
      return { width: '8%' };
    },
  },
  {
    dataField: 'creditLimitLastUpdatedDate',
    text: 'Update Date',
    sort: true,
    formatter: (row) => (row ? format(new Date(row), 'MM/dd/yyyy') : '-'),
    headerStyle: () => {
      return { width: '11%' };
    },
  },
  {
    dataField: 'code',
    text: 'Actions',
    formatter: (code) => {
      return (
        <span
          className="p-1 cursor-pointer"
          onClick={(e) => handleEditOrg(e, code)}
        >
          <i className="far fa-edit text-primary"></i>
        </span>
      );
    },
    headerStyle: () => {
      return { width: '6%' };
    },
  },
];
