import { deleteAction, get, put } from './http';
const { REACT_APP_APPLICATION_CODE: appCode } = process.env;

export function ping() {
  return get('/ping');
}

export function init() {
  return get(`init/${appCode}`);
}

export function reject(id, data) {
  return put(`admin/issuance/${id}/reject`, data);
}

export function all() {
  return get('admin/application');
}

export function deleteApplication() {
  return deleteAction('admin/application');
}

export function update() {
  return put('admin/application');
}

export function consent(id, code) {
  return put(`application/${code}/document/${id}/consent`);
}
