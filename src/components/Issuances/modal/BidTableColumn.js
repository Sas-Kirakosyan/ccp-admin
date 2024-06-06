import { format } from 'date-fns';

import { formatInteger } from 'helpers/common';

export const lastBidColumns = [
  {
    dataField: 'tradeDate',
    text: 'Trade Date',
    headerStyle: () => {
      return { width: '9%' };
    },
  },

  {
    dataField: 'issuanceId',
    text: 'Issuance Id',
    headerStyle: () => {
      return { width: '11%' };
    },
  },
  {
    dataField: 'trancheId',
    text: 'Tranche Id',
    headerStyle: () => {
      return { width: '11%' };
    },
  },
  {
    dataField: 'investorOrganizationName',
    text: 'Investor Organization',
    headerStyle: () => {
      return { width: '16%' };
    },
  },
  {
    dataField: 'investorCreatedByUserId',
    text: 'User Id',
    headerStyle: () => {
      return { width: '6%' };
    },
  },
  {
    dataField: 'timeofBid',
    text: 'Time of Bid',
    headerStyle: () => {
      return { width: '12%' };
    },
    formatter: (cell) => format(new Date(cell), 'MM/dd/yyyy H:mm'),
  },
  {
    dataField: 'currentRound',
    text: 'Round',
    headerStyle: () => {
      return { width: '7%' };
    },
  },

  {
    dataField: 'currentBidVolume',
    text: 'Bid Amount ($)',
    headerStyle: () => {
      return { width: '13%' };
    },
    formatter: (cell) => formatInteger(cell),
  },

  {
    dataField: 'currentBidPrice',
    text: 'Bid Spread (bps)',
    headerStyle: () => {
      return { width: '12%' };
    },
    formatter: (cell) => formatInteger(cell),
  },
];
