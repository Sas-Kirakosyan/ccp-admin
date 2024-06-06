import React from 'react';

import { PropTypes } from 'prop-types';

export default function TableRow({ children }) {
  return <tr>{children}</tr>;
}

TableRow.propTypes = {
  children: PropTypes.node,
};
