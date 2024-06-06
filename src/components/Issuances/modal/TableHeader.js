import React from 'react';

import { PropTypes } from 'prop-types';

export default function TableHeader({ children }) {
  return <th>{children}</th>;
}

TableHeader.propTypes = {
  children: PropTypes.node,
};
