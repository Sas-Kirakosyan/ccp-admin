import { get, put, post, deleteAction } from './http';

export function all() {
  return get('admin/organization');
}

export function org(code) {
  return get(`admin/organization/${code}`);
}

export function add(org) {
  return post('admin/organization', org);
}

export function types() {
  return get('admin/code');
}

export function update(code, data) {
  return put(`admin/organization/${code}`, data);
}

export function rating(code, data) {
  return post(`admin/organization/${code}/ratings`, data);
}

export function investorCategories() {
  return get('admin/investor-category');
}

export function existingSecurities(code) {
  return get(`/admin/organization/${code}/existing-security-details`);
}

export function allCountries() {
  return get(`/countries`);
}

export function updateExistingSecurity(id, data) {
  return put(`admin/existing-security-details/${id}`, data);
}

export function addExistingSecurity(data) {
  return post(`admin/existing-security-details`, data);
}

export function deleteExistingSecurity(id) {
  return deleteAction(`admin/existing-security-details/${id}`);
}
