import { ONE_MILLION } from '../data/const/constants';
import { GRID_PARAMS, addressTypes } from '../data/const/constants';
import { getYear } from 'date-fns';

export function transformMillion(value) {
  const toLocale = (value / ONE_MILLION).toLocaleString(navigator.language, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return `$ ${toLocale} mil`;
}

export function formatInteger(value) {
  const toLocale = value.toLocaleString(navigator.language, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return `${toLocale}`;
}

export function toMillion(value) {
  return value * ONE_MILLION;
}

export function integerToMillion(value) {
  const toLocale = (value / ONE_MILLION).toLocaleString(navigator.language, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return toLocale === '0' ? '' : toLocale;
}

export function countFromWindowHeigth(wHeigth) {
  return (wHeigth - 230) / 1.17;
}

export const setMinWidth = (minWidth, ref, minCellWidth) => {
  if (!ref.current) {
    return;
  }
  const offsetWidth = ref?.current?.element.getBoundingClientRect().width;
  const width = minCellWidth
    ? minWidth
    : minWidth +
      (offsetWidth - GRID_PARAMS.minGridWidth) / GRID_PARAMS.coeficentGridWidth;
  return width < GRID_PARAMS.columnMin
    ? width
    : width - GRID_PARAMS.ajustPadding;
};

export function addSpacAndCapitalazeFirtLetter(string) {
  return (
    string.charAt(0).toUpperCase() +
    string
      .slice(1)
      .replace(/([A-Z])/g, ' $1')
      .trim()
  );
}

export function capitalize(value) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

export function toSplitCamelCase(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1 $2');
}

export function groupBy(data = [], property = '') {
  return data.reduce((acc, value) => {
    if (!acc[value[property]]) {
      acc[value[property]] = [];
    }
    acc[value[property]].push(value);
    return acc;
  }, {});
}

export function isMatchDateAndDay(date = '', multiDate = []) {
  const [, month, day] = date.split('-');
  return multiDate.some(
    (el) => el.month === parseInt(month) - 1 && el.day === parseInt(day),
  );
}

export function createSecurity(coupon = '', date = new Date(), type = 'fixed') {
  if (type === 'fixed') {
    return `${coupon}% Notes Due ${getYear(new Date(date))}`;
  }
  if (type === 'floating') {
    return `Floating Rate Notes Due ${getYear(new Date(date))}`;
  }
  return '';
}

export function loadGoogleMapApiScript() {
  const script = document.createElement('script');
  script.src =
    'https://maps.googleapis.com/maps/api/js?key=AIzaSyCZ-eSd54aGPxfcvVWiiCd84O1NRc5zV4k&libraries=places';
  script.async = true;
  document.body.appendChild(script);
}

export function validateEmail(email = '') {
  const emailRex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (emailRex.test(email)) {
    return true;
  } else {
    return false;
  }
}

export function validateDTC(str) {
  if (str.length === 0) {
    return true;
  }
  const dtcRegex = /^[0-9A-Z]+$/;
  return dtcRegex.test(str);
}

export function validateAddress(address = {}) {
  if (address === null) {
    return false;
  }
  return !addressTypes.every((el) => address?.hasOwnProperty(el));
}

export function addCommaIfExist(data) {
  return data ? `${data}, ` : '';
}
