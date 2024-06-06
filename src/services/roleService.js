import { get, put, post, deleteAction } from './http';

export function all() {
  return get('admin/role');
}

export function add(role) {
  return post('admin/role', role);
}

export function role(id) {
  return get(`admin/role/${id}`);
}

export function deleteRol(id) {
  return deleteAction(`admin/role/${id}`);
}

export function update(id, data) {
  return put(`admin/role/${id}`, data);
}
