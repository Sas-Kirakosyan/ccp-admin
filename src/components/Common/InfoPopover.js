import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

import { Popover, PopoverBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import useClickOutside from '../Hooks/useClickOutside';

const InfoPopover = ({
  children,
  title,
  desc,
  text,
  linkText,
  linkTo,
  placement,
  targetId,
  offset,
  className,
}) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const toggle = () => setPopoverOpen(!popoverOpen);

  const popoverRef = useRef();
  const linkRef = useRef();
  const targetElement = document.getElementById(targetId);

  useClickOutside(popoverRef, (e) => {
    if (e?.target !== targetElement) {
      setPopoverOpen(false);
    }
  });

  return (
    <div className="d-inline-block info-popover">
      <div className="popover-wrapper" ref={popoverRef}>
        <Popover
          className={className}
          placement={placement}
          fade={false}
          offset={offset}
          isOpen={popoverOpen}
          target={targetId}
          toggle={toggle}
        >
          <PopoverBody>
            {title && (
              <div className="text-sm-larger text-muted text-bold mb-2">
                {title}
              </div>
            )}
            {desc && (
              <div className="mb-2 text-sm-larger text-dark">{desc}</div>
            )}
            {text && <div className="mb-2 text-sm text-muted">{text}</div>}
            {linkText && linkTo && (
              <Link ref={linkRef} to={linkTo} className="btn btn-primary">
                {linkText}
              </Link>
            )}
            {children}
          </PopoverBody>
        </Popover>
      </div>
    </div>
  );
};

export default InfoPopover;

InfoPopover.propTypes = {
  title: PropTypes.string,
  desc: PropTypes.string,
  text: PropTypes.string,
  linkText: PropTypes.string,
  linkTo: PropTypes.string,
  placement: PropTypes.string,
  targetId: PropTypes.string,
  offset: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};
