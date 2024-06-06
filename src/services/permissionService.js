import { get, put, post, deleteAction } from './http';

export function all() {
  return get('admin/permission');
}

export function permission(id) {
  return get(`admin/permission/${id}`);
}

export function add(permission) {
  return post('admin/permission', permission);
}

export function deletePerm(id) {
  return deleteAction(`admin/permission/${id}`);
}

export function update(id, data) {
  return put(`admin/permission/${id}`, data);
}
