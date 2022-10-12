import React from 'react';

import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalBody,
} from '@chakra-ui/core';
import { Chip } from '@material-ui/core';

import { IServiceProvider } from '../../../interfaces/service_provider';
import { Title, Box, Text, ChipBox, ChipContainer } from './styles';

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
  serviceProviders: IServiceProvider[];
}
const IndicateServiceProviderModal: React.FC<IUpdateCompanyModalProps> = ({
  isOpen,
  onClose,
  sales,
  serviceProviders,
}) => (
  <>
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent backgroundColor="#383838" maxWidth={900} borderRadius="md">
        <ModalHeader>Atribuir técnico ou responsável técnico</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <Title>Venda selecionada</Title>
            {sales.map(sale => (
              <Text key={sale.id}>
                <span>{sale.client_id}</span>
              </Text>
            ))}
          </Box>

          <Title>Selecionar técnico(s)</Title>
          <ChipContainer>
            {serviceProviders.map(provider => (
              <>
                <ChipBox>
                  <Chip
                    key={provider.id}
                    label={provider.name}
                    // onClick={handleClick}
                    // onDelete={}
                  />
                </ChipBox>
              </>
            ))}
          </ChipContainer>
        </ModalBody>
      </ModalContent>
    </Modal>
  </>
);

export default IndicateServiceProviderModal;
