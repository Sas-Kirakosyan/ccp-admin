import React from 'react';

import PropTypes from 'prop-types';

const TextEllipsis = ({ width, children }) => {
  const styles = {
    width: `${width}px`,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  return <div style={styles}>{children}</div>;
};

export default TextEllipsis;

TextEllipsis.propTypes = {
  width: PropTypes.number,
  children: PropTypes.node,
};
