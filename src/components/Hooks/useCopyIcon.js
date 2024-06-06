import { useState, useEffect, useRef } from 'react';

const iconChangeTimeout = 1000;

const useCopyIcon = () => {
  const [copyIcon, setCopyIcon] = useState('far fa-copy');
  const intervalId = useRef(null);

  useEffect(() => {
    return () => {
      if (intervalId.current) {
        clearTimeout(intervalId.current);
      }
    };
  }, []);

  const handleIconTimeout = () => {
    if (intervalId.current) {
      clearTimeout(intervalId.current);
    }
    intervalId.current = setTimeout(() => {
      setCopyIcon('far fa-copy');
    }, iconChangeTimeout);
  };

  const handleCopy = () => {
    setCopyIcon('fa fa-check');
    handleIconTimeout();
  };

  return [copyIcon, handleCopy];
};

export default useCopyIcon;
