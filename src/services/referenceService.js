import { get } from './http';

export function getIndustry() {
  return get('reference/industry');
}

export function getRating() {
  return get('reference/rating');
}

export function getSectors() {
  return get('reference/sector');
}
