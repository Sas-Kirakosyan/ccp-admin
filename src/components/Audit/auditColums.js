import RequestBodyCell from './RequestBodyCell';
import PermissionsCell from './PermissionCell';
import EntityValueCell from './EntityValueCell';
import moment from 'moment';

export const auditColumn = [
  {
    dataField: 'userId',
    text: 'User Id',
    headerStyle: () => {
      return { width: '6%' };
    },
  },

  {
    dataField: 'requestId',
    text: 'Request Id',
    headerStyle: () => {
      return { width: '10%' };
    },
  },
  {
    dataField: 'requestBody',
    text: 'Request Body',
    headerStyle: () => {
      return { width: '12%' };
    },
    formatter: (cell, row, dataIndex) => {
      return <RequestBodyCell dataIndex={dataIndex} requestBody={cell} />;
    },
  },
  {
    dataField: 'userEffectivePermissions',
    text: 'Permissions',
    formatter: (cell, row) => {
      return (
        <PermissionsCell userId={row.userId} userEffectivePermissions={cell} />
      );
    },
    headerStyle: () => {
      return { width: '11%' };
    },
  },
  {
    dataField: 'orgCode',
    text: 'Org. Code',
    headerStyle: () => {
      return { width: '8%' };
    },
  },
  {
    dataField: 'createdOn',
    text: 'Org. Code',
    headerStyle: () => {
      return { width: '13%' };
    },
    formatter: (row) =>
      row ? moment(row).format('YYYY-MM-DD H:mm:ss a') : '-',
  },
  {
    dataField: 'event',
    text: 'Event',
    headerStyle: () => {
      return { width: '7%' };
    },
  },
  {
    dataField: 'entityName',
    text: 'Entity Name',
    headerStyle: () => {
      return { width: '9%' };
    },
  },
  {
    dataField: 'entityId',
    text: 'Entity Id',
    headerStyle: () => {
      return { width: '11%' };
    },
  },
  {
    dataField: 'entityValue',
    text: 'Entity Value',
    headerStyle: () => {
      return { width: '13%' };
    },
    formatter: (cell, row, dataIndex) => {
      return <EntityValueCell dataIndex={dataIndex} entityValue={cell} />;
    },
  },
  {
    dataField: 'source',
    text: 'Source',
    headerStyle: () => {
      return { width: '6%' };
    },
  },
];
