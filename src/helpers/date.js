import { format } from 'date-fns-tz';

const minutes = 60;
const milliseconds = 1000;

export function formatDateToString(date = '') {
  if (typeof date === 'object' && date !== null) {
    return format(date, 'yyyy-MM-dd');
  }
  return date;
}

export function formatDateToMonthDayYear(str = '') {
  const [month, day, year] = str.split('-');
  return format(new Date(month, day - 1, year), 'MM/dd/yyyy');
}

//convert ("2017-12-12") string to date format and set time 00:00
export function stringToDateFormat(str) {
  if (!str) return null;
  const d = new Date(str);
  return new Date(d.valueOf() + d.getTimezoneOffset() * minutes * milliseconds);
}
