import React, { useRef, useState } from 'react';

import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  Flex,
  Textarea,
} from '@chakra-ui/core';
import { TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import { IServiceProvider } from '../../../interfaces/service_provider';
import DatePicker from '../../DatePicker';
import { Content, CustomChip } from './styles';

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
  // sales,
  serviceProviders,
}) => {
  const formRef = useRef<FormHandles>(null);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  console.log(
    serviceProviders.map(profile => ({
      id: profile.id,
      name: profile.name,
    })),
  );
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          backgroundColor="#383838"
          maxWidth={900}
          borderRadius="md"
        >
          <ModalHeader>Atribuir vendas aos responsáveis técnicos</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Content>
              <Form
                style={{ display: 'flex', flex: 1, flexDirection: 'column' }}
                ref={formRef}
                onSubmit={() => console.log('opdo')}
              >
                <Flex w="100%" direction="row" style={{ gap: '8px' }}>
                  <Flex w="50%" direction="column">
                    <Autocomplete
                      options={serviceProviders.map(profile => profile.name)}
                      autoComplete={false}
                      style={{
                        background: '#282828',
                        color: '#fff',
                        borderRadius: 8,
                        minHeight: '40px',
                        margin: '0px',
                      }}
                      renderInput={params => (
                        <TextField
                          {...params}
                          fullWidth
                          style={{ border: 0, minHeight: '40px' }}
                        />
                      )}
                      multiple
                      value={selectedProviders}
                      onChange={(_i, values) => {
                        setSelectedProviders(values);
                      }}
                      renderTags={selectedValues =>
                        selectedValues.map(option => (
                          <CustomChip
                            key={option}
                            style={{
                              color: '#fff',
                              borderColor: '#585858',
                              margin: '6px',
                            }}
                            onDelete={() => {
                              setSelectedProviders(
                                selectedProviders.filter(v => v !== option),
                              );
                            }}
                            onClick={() => {
                              setSelectedProviders(
                                selectedProviders.filter(v => v !== option),
                              );
                            }}
                            variant="outlined"
                            label={option}
                          />
                        ))
                      }
                    />
                  </Flex>
                  <Flex w="50%" direction="column">
                    <DatePicker
                      name="dateToBeDone"
                      placeholderText="Data a realizar"
                      containerProps={{
                        width: '100%',
                        height: 10,
                      }}
                    />
                  </Flex>
                </Flex>

                <Textarea name="comments" style={{ marginTop: '12px' }} />
              </Form>
            </Content>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default IndicateServiceProviderModal;
