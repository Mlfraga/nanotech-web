import React, { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';

import {
  Button, Checkbox, CheckboxGroup, Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay, Text
} from '@chakra-ui/core';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { useToast } from '../../../context/toast';
import { IFetchedUser } from '../../../pages/Users';
import api from '../../../services/api';
import Select from '../../Select';

interface IFormData {
  commissioner_id: string;
}

interface ISetSaleReferralProps {
  isOpen: boolean;
  onClose: (
    event: React.MouseEvent | React.KeyboardEvent,
    reason?: 'pressedEscape' | 'clickedOverlay',
  ) => void;
  selectedServices: {value: string; label: string}[];
  handleSubmitByReferral: (commissionerData: IReferralData) => Promise<void>;
  companyId: string;
}

export interface IReferralData {
  id: string;
  referredServices: string[];
}

const SetSaleReferral: React.FC<ISetSaleReferralProps> = ({
  isOpen,
  onClose,
  selectedServices,
  handleSubmitByReferral,
  companyId,
}) => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const [referredServices, setReferredServices] = useState<string[]>([]);
  const [commissionerOptions, setCommissionerOptions] = useState<{value: string; label: string}[]>([]);

  useEffect(() => {
    const fetchCommissioners = async() => {
      const {data: commissioners} = await api.get<IFetchedUser[]>('/users', {params: {role: 'COMMISSIONER', company_id: companyId}});

      const formattedOptions = commissioners.map(commissioner => ({
        value: commissioner.profile.id,
        label: commissioner.profile.name,
      }));

      setCommissionerOptions(formattedOptions);
    }

    fetchCommissioners();
  }, [companyId])

  const handleSubmit = async(data: IFormData) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        commissioner_id: Yup.string().uuid('Comissionário inválido').required('Por favor selecione o comissionário.'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      if (referredServices.length <= 0) {
        addToast({ title: 'Nenhum serviço selecionado.', type: 'error' });

        return;
      }

      handleSubmitByReferral({
        id: data.commissioner_id,
        referredServices,
      });

      onClose({} as React.MouseEvent | React.KeyboardEvent);
    }catch(exception){
      addToast({ title: 'Ocorreu um erro!', type: 'error' });
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          backgroundColor="#383838"
          maxWidth={900}
          borderRadius="md"
        >
          <ModalHeader>{`Adicionar comissionários a venda`}</ModalHeader>
          <ModalCloseButton />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <ModalBody paddingBottom={4}>
              <Flex flex={1} direction="column" style={{ gap: '26px' }}>
                <Flex direction="column">
                  <Text fontSize={18} fontWeight="semibold">
                    Selecione abaixo os serviços indicados pelo comissionário:
                  </Text>

                  <CheckboxGroup onChange={(selectedServices) => setReferredServices(selectedServices as string[])} mt={8}>
                    {selectedServices.map(service => (
                      <Checkbox value={service.value}>
                        {service.label}
                      </Checkbox>
                    ))}
                  </CheckboxGroup>
                </Flex>
                <Flex flex={1} direction="column">
                  <Text fontSize={18} mb={4} fontWeight="semibold">Selecione o comissionário:</Text>

                  <Select
                    placeholder="Comissionário"
                    height={8}
                    backgroundColor="#424242"
                    color="White"
                    name="commissioner_id"
                    containerProps={{
                      height: 10,
                      border: '2px solid',
                      borderColor: '#585858',
                      backgroundColor: '#424242',
                      width: '100%'
                    }}
                  >
                    {commissionerOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </Flex>
              </Flex>
            </ModalBody>

            <ModalFooter>
              <Button
                variant="ghost"
                onClick={onClose}
                _hover={{ background: '#323232' }}
                marginRight={4}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                backgroundColor="#355a9d"
                _hover={{
                  backgroundColor: '#5580b9',
                }}
              >
                Salvar
              </Button>
            </ModalFooter>
          </Form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SetSaleReferral;
