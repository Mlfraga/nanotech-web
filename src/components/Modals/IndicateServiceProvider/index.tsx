import React, { useCallback, useRef, useState, useEffect } from 'react';

import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  Flex,
  Button,
  Text,
} from '@chakra-ui/core';
import { TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import { useToast } from '../../../context/toast';
import { IServiceProvider } from '../../../interfaces/service_provider';
import api from '../../../services/api';
import DatePicker from '../../DatePicker';
import Textarea from '../../Textarea';
import { Content, CustomChip } from './styles';

interface IUpdateCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  saleId: string | null;
  serviceProviders: IServiceProvider[];
  selectedProviderServiceSales: IServiceProviderInfo;
}

interface IFormData {
  techinical_comments: string;
  date_to_be_done: Date;
}

interface IServiceProviderInfo {
  serviceProviders: IServiceProvider[];
  techinical_comments: string;
  date_to_be_done?: Date;
}

const IndicateServiceProviderModal: React.FC<IUpdateCompanyModalProps> = ({
  isOpen,
  onClose,
  saleId,
  onSave,
  serviceProviders,
  selectedProviderServiceSales,
}) => {
  const { addToast } = useToast();
  const formRef = useRef<FormHandles>(null);

  const [loading, setLoading] = useState(false);
  const [initialDateToBeDone, setInitialDateToBeDone] = useState<
    Date | undefined
  >();
  const [selectedProviders, setSelectedProviders] = useState<
    {
      name: string;
      id: string;
    }[]
  >([]);

  useEffect(() => {
    if (selectedProviderServiceSales) {
      setSelectedProviders(selectedProviderServiceSales.serviceProviders);
      setInitialDateToBeDone(selectedProviderServiceSales.date_to_be_done);

      const techinicalCommentsFieldRef = formRef.current?.getFieldRef(
        'techinical_comments',
      );

      if (selectedProviderServiceSales.techinical_comments) {
        techinicalCommentsFieldRef.value =
          selectedProviderServiceSales.techinical_comments;
      }
    }
  }, [selectedProviderServiceSales, formRef]);

  const handleLinkSalesToProviders = useCallback(
    (data: IFormData) => {
      const payload = {
        ...data,
        sale_ids: [saleId],
        sale_service_provider_profile_ids: selectedProviders.map(
          provider => provider.id,
        ),
      };
      setLoading(true);
      api
        .post('/service-sale-providers', payload)
        .then(() => {
          addToast({
            type: 'success',
            title: 'Responsáveis pelo serviço indicados com sucesso!',
            description:
              'Os responsáveis pelo serviço foram indicados com sucesso!',
          });
          onSave();
        })
        .catch(() => {
          addToast({
            type: 'error',
            title: 'Erro ao indicar responsáveis técnicos',
            description:
              'Ocorreu um erro ao indicar responsáveis técnicos para as vendas',
          });
        })
        .finally(() => setLoading(false));
    },
    [saleId, onSave, selectedProviders, addToast],
  );

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          backgroundColor="#383838"
          maxWidth={900}
          borderRadius="md"
          zIndex={1300}
        >
          <ModalHeader>Atribuir vendas aos responsáveis técnicos</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Content>
              <Form
                style={{ display: 'flex', flex: 1, flexDirection: 'column' }}
                ref={formRef}
                onSubmit={handleLinkSalesToProviders}
              >
                <Flex mb={6} direction="column">
                  <Text fontWeight="semibold" fontSize={16} mb={2}>
                    Observações Técnicas:{' '}
                  </Text>
                  <Textarea name="techinical_comments" />
                </Flex>

                <Flex w="100%" direction="row" style={{ gap: '8px' }}>
                  <Flex w="50%" direction="column">
                    <Text fontWeight="semibold" fontSize={16} mb={2}>
                      Responsáveis:{' '}
                    </Text>
                    <Autocomplete
                      options={serviceProviders.map(profile => ({
                        name: profile.name,
                        id: profile.id,
                      }))}
                      getOptionSelected={(option, value) =>
                        option.id === value.id
                      }
                      getOptionLabel={option => option.name}
                      autoComplete={false}
                      style={{
                        background: '#282828',
                        color: '#fff',
                        borderRadius: 8,
                        minHeight: '40px',
                        margin: '0px',
                        border: '1px solid #585858',
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
                            key={option.id}
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
                            label={option.name}
                          />
                        ))
                      }
                    />
                  </Flex>
                  <Flex w="50%" direction="column">
                    <Text fontWeight="semibold" fontSize={16} mb={2}>
                      Data a ser realizado:{' '}
                    </Text>
                    <DatePicker
                      name="date_to_be_done"
                      initialDate={initialDateToBeDone}
                      containerProps={{
                        width: '100%',
                        height: 10,
                      }}
                    />
                  </Flex>
                </Flex>

                <Flex
                  mt={16}
                  flex={1}
                  justifyContent="flex-end"
                  alignItems="flex-end"
                  style={{ gap: '12px' }}
                >
                  <Button
                    isDisabled={loading}
                    onClick={() => onClose()}
                    variant="outline"
                    _hover={{ background: 'transparent' }}
                  >
                    Cancel
                  </Button>
                  <Button
                    isDisabled={loading}
                    type="submit"
                    backgroundColor="#355a9d"
                    _hover={{
                      backgroundColor: '#5580b9',
                    }}
                  >
                    Salvar
                  </Button>
                </Flex>
              </Form>
            </Content>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default IndicateServiceProviderModal;
