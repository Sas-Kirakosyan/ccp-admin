import { get, put, deleteAction } from './http';

const responseType = 'blob';

export function all(data) {
  return get('admin/issuance/', data);
}

export function issuanceById(id) {
  return get(`admin/issuance/${id}`);
}

export function verify(id) {
  return put(`admin/issuance/${id}/verify`);
}

export function issuanceTermSheet(issuanceId, trancheId) {
  return get(`admin/issuance/${issuanceId}/tranche/${trancheId}/term-sheet`);
}

export function generateIssuanceReport(issuanceId) {
  return get(`admin/issuance/${issuanceId}/report`, null, responseType);
}

export function generateSettlementFile(issuanceId) {
  return get(
    `admin/issuance/${issuanceId}/settlement-counter-party`,
    null,
    responseType,
  );
}

export function cancelOrTerminateIssuance(issuanceId, data) {
  return put(`/admin/issuance/${issuanceId}/cancelorterminate`, data);
}

export function lastBidData(trancheId) {
  return get(`admin/tranche/${trancheId}/latestbids`);
}

export function deleteLastBid(bidId, reason) {
  return deleteAction(`/admin/adjust-bids/${bidId}`, reason);
}

export function adjustLastBid(bidId, data) {
  return put(`/admin/adjust-bids/${bidId}`, data);
}

export function removeBidder(bidId, data) {
  return deleteAction(`/admin/remove-bidder/${bidId}`, data);
}
