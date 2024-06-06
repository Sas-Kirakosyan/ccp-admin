export const ONE_MILLION = 1_000_000;

export const MIN_CREDIT_LIMIT = 1;
export const GRID_PARAMS = {
  minGridWidth: 1250,
  ajustPadding: 4,
  columnMin: 4,
  coeficentGridWidth: 13,
};

export const bpsValuesRange = {
  MIN: 1,
  MAX: 1000,
};

export const bidValuesRange = {
  MIN: 1,
  MAX: ONE_MILLION,
};

export const percentValuesRange = {
  MIN: 1,
  MAX: 100,
};

export const denomValuesRange = {
  MIN: 0,
  MAX: 1000000000000,
};

export const SEARCH_BY_ORGS = [
  { label: 'Name', name: 'name' },
  { label: 'Ticker', name: 'ticker' },
  { label: 'Type', name: 'type' },
];

export const COUPON_TYPE = [
  { label: 'Fixed', name: 'fixed' },
  { label: 'Floating', name: 'floating' },
];

export const FIRST_COLUMN_FILTER = [
  'Request Id',
  'Request IP',
  'User Id',
  'Event',
];

export const SECOND_COLUMN_FILTER = [
  'Entity Name',
  'Entity Id',
  'Entity Value',
  'Source',
];

export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const addressTypes = ['address_1', 'street', 'city', 'country', 'zip'];

export const dayCountConventionOptions = [
  {
    id: 'convention-1',
    value: 'US 30/360',
    label: 'US 30/360',
  },
  {
    id: 'convention-2',
    value: 'Actual/360',
    label: 'Actual/360',
  },
  {
    id: 'convention-3',
    value: 'Actual/365',
    label: 'Actual/365',
  },
  {
    id: 'convention-4',
    value: 'Actual/Actual',
    label: 'Actual/Actual',
  },
];

export const rankingOptions = [
  {
    id: 'ranking-1',
    value: 'Secured',
    label: 'Secured',
  },
  {
    id: 'ranking-2',
    value: 'Senior Secured',
    label: 'Senior Secured',
  },
  {
    id: 'ranking-3',
    value: 'Unsecured Senior',
    label: 'Unsecured Senior',
  },
  {
    id: 'ranking-4',
    value: 'Junior, Subordinated',
    label: 'Junior, Subordinated',
  },
  {
    id: 'ranking-5',
    value: 'Guaranteed',
    label: 'Guaranteed',
  },
  {
    id: 'ranking-6',
    value: 'Convertible',
    label: 'Convertible',
  },
];

export const formatOptions = [
  {
    id: 'format-1',
    value: 'SEC Registered',
    label: 'SEC Registered',
  },
  {
    id: 'format-2',
    value: 'Rule 144A',
    label: 'Rule 144A',
  },
  {
    id: 'format-3',
    value: 'Rule 144A with Registration Rights',
    label: 'Rule 144A with Registration Rights',
  },
  {
    id: 'format-4',
    value: 'Rule 144A/Reg S',
    label: 'Rule 144A/Reg S',
  },
  {
    id: 'format-5',
    value: 'Rule 144A/Reg S with Registration Right',
    label: 'Rule 144A/Reg S with Registration Right',
  },
  {
    id: 'format-6',
    value: 'Reg S',
    label: 'Reg S',
  },
];

export const monthsOptions = [
  {
    label: 'January',
    value: 'January',
  },
  {
    label: 'February',
    value: 'February',
  },
  {
    label: 'March',
    value: 'March',
  },
  {
    label: 'April',
    value: 'April',
  },
  {
    label: 'May',
    value: 'May',
  },
  {
    label: 'June',
    value: 'June',
  },
  {
    label: 'July',
    value: 'July',
  },
  {
    label: 'August',
    value: 'August',
  },
  {
    label: 'September',
    value: 'September',
  },
  {
    label: 'October',
    value: 'October',
  },
  {
    label: 'November',
    value: 'November',
  },
  {
    label: 'December',
    value: 'December',
  },
];

export const initialMultipleDates = [
  {
    month: null,
    day: null,
  },
  {
    month: null,
    day: null,
  },
];
