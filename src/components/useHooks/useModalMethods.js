// @flow

import { useState } from 'react';

export function useModalMethods() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  return [showModal, hideModal, isModalVisible];
}
