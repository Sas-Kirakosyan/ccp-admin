import { PermissionsCell } from './PermissionCell';
import { ActionsCell } from './ActionCell';

export const rolesColumn = [
  {
    dataField: 'actionId',
    text: 'Id',
    formatter: (row, cell) => (row ? cell.id : '-'),
    headerStyle: () => {
      return { width: '2%' };
    },
    sort: true,
    sortFunc: (a, b, order, dataField, rowA, rowB) => {
      if (order === 'asc') {
        return rowB.id - rowA.id;
      }
      return rowA.id - rowB.id;
    },
  },
  {
    dataField: 'name',
    text: 'Name',
    headerStyle: () => {
      return { width: '9%' };
    },
    sort: true,
  },
  {
    dataField: 'description',
    text: 'Description',
    formatter: (row) => (row ? row : '-'),
    headerStyle: () => {
      return { width: '10%' };
    },
  },
  {
    dataField: 'permissions',
    text: 'Permissions',
    headerStyle: () => {
      return { width: '18%' };
    },
    formatter: (row, cell) => {
      return <PermissionsCell key={cell.id} permissions={row} />;
    },
    sort: true,
  },
  {
    dataField: 'id',
    text: 'Actions',
    formatter: (id) => <ActionsCell id={id} key={id} />,
    headerStyle: () => {
      return { width: '4%' };
    },
  },
];
