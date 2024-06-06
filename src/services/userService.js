import { get, put, post, deleteAction } from './http';

export function all(data) {
  return get('admin/users', data);
}

export function add(user) {
  return post('admin/user', user);
}

export function getUserById(id) {
  return get(`admin/user/${id}`);
}

export function deleteUser(id) {
  return deleteAction(`admin/user/${id}`);
}

export function update(id, data) {
  return put(`admin/user/${id}`, data);
}

export function verify(id) {
  return post(`admin/user/${id}/verify`);
}

export function sync() {
  return post('admin/user/sync');
}
