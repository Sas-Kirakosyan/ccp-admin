// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';
import classNames from 'classnames';

import styles from './data-table.module.scss';

export const DataTable = ({
  tableHeadContent,
  tableBodyContent,
  tableFootContent,
  tableColGroup,
  className,
}) => (
  <div className={classNames(styles.tableWrapper, className)}>
    <Table className="m-0">
      {tableColGroup()}
      <thead className={styles.tableHead}>{tableHeadContent()}</thead>
      <tbody className={styles.tableBody}>{tableBodyContent()}</tbody>
      <tfoot className={styles.tableFoot}>{tableFootContent()}</tfoot>
    </Table>
  </div>
);

DataTable.defaultProps = {
  tableHeadContent: () => null,
  tableFootContent: () => null,
  tableColGroup: () => null,
};

DataTable.propTypes = {
  tableHeadContent: PropTypes.func,
  tableBodyContent: PropTypes.func.isRequired,
  tableFootContent: PropTypes.func,
  className: PropTypes.string,
};
