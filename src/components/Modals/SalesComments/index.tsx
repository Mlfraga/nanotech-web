import React from 'react';

import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/core';

interface ISalesCommentsModalProps {
  isOpen: boolean;
  onClose: (
    event: React.MouseEvent | React.KeyboardEvent,
    reason?: 'pressedEscape' | 'clickedOverlay',
  ) => void;
  techinicalComments?: string;
  comments?: string;
}

const SalesCommentsModal: React.FC<ISalesCommentsModalProps> = ({
  isOpen,
  onClose,
  techinicalComments,
  comments,
}) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent
      paddingBottom={8}
      backgroundColor="#383838"
      maxWidth="70%"
      borderRadius="md"
    >
      <ModalHeader>Observações da venda</ModalHeader>
      <ModalCloseButton />

      <ModalBody display="flex" paddingBottom={4}>
        <Flex w="50%" direction="column">
          <Text fontWeight="semibold">Observações da vendedora:</Text>
          <Text mt={4}>{comments || 'Nenhuma observação'}</Text>
        </Flex>
        <Flex w="50%" direction="column">
          <Text fontWeight="semibold">Observações técnicas</Text>
          <Text mt={4}>{techinicalComments || 'Nenhuma observação'}</Text>
        </Flex>
      </ModalBody>
    </ModalContent>
  </Modal>
);

export default SalesCommentsModal;
