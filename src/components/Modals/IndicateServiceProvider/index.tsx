import React from 'react';

import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalHeader,
} from '@chakra-ui/core';

interface IUpdateCompanyModalProps {
  isOpen: boolean;
  onClose: (
    event: React.MouseEvent | React.KeyboardEvent,
    reason?: 'pressedEscape' | 'clickedOverlay',
  ) => void;
  sales: string[];
}

const UpdateCompanyModal: React.FC<IUpdateCompanyModalProps> = ({
  isOpen,
  onClose,
  sales,
}) => {
  console.log(sales);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          backgroundColor="#383838"
          maxWidth={900}
          borderRadius="md"
        >
          <ModalHeader>Atribuir técnico ou responsável técnico</ModalHeader>
          <ModalCloseButton />
        </ModalContent>
      </Modal>
    </>
  );
};
export default UpdateCompanyModal;
