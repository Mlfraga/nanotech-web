import React from 'react';

import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalBody,
} from '@chakra-ui/core';

import { TitleBox, Box, TextBox } from './styles';

interface IFormattedSale {
  id: string;
  client_id: string;
}
interface IUpdateCompanyModalProps {
  isOpen: boolean;
  onClose: (
    event: React.MouseEvent | React.KeyboardEvent,
    reason?: 'pressedEscape' | 'clickedOverlay',
  ) => void;
  sales: IFormattedSale[];
}
const UpdateCompanyModal: React.FC<IUpdateCompanyModalProps> = ({
  isOpen,
  onClose,
  sales,
}) => {
  const quantitySales: number = sales.length;
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
          <ModalBody>
            <Box>
              {quantitySales <= 1 ? (
                <TitleBox>Venda selecionada</TitleBox>
              ) : (
                <TitleBox>Vendas selecionadas</TitleBox>
              )}

              <TextBox>
                {sales.map(sale => (
                  <>
                    {quantitySales <= 1 ? (
                      <span>{sale.client_id}</span>
                    ) : (
                      <>
                        <span>-</span>
                        <span>{sale.client_id}</span>
                      </>
                    )}
                  </>
                ))}
              </TextBox>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateCompanyModal;
