import { get } from './http';

export function all(data) {
  return get('admin/audit/', data);
}
