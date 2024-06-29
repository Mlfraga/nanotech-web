import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FiDollarSign } from 'react-icons/fi';

import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/core';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { useToast } from '../../../context/toast';
import api from '../../../services/api';
import getValidationsErrors from '../../../utils/getValidationError';
import { currencyMasker } from '../../../utils/masks';
import Input from '../../Input';
import Select from '../../Select';
import { IServiceGroup } from '../../../interfaces/service_group';

interface IFormData {
  serviceGroup: string;
  price: number;
  commission_amount: number;
}

interface ICreateServicePriceModalProps {
  isOpen: boolean;
  company: {
    id: string;
    name: string;
  };
  onClose: () => void;
  onSave: () => void | undefined;
}

const CreateServicePriceModal: React.FC<ICreateServicePriceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  company,
}) => {
  const hasAlreadyExecuted = useRef<boolean>(false);
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const [loading, setLoading] = useState<boolean>(false);
  const [serviceGroups, setServiceGroups] = useState<IServiceGroup[]>([]);

  useEffect(() => {
    const fethServiceGroups = async () => {
      const serviceGroups = await api.get<IServiceGroup[]>('/service-groups', {
        params: {
          enabled: true,
        },
      });

      setServiceGroups(serviceGroups.data);
    };

    if (!hasAlreadyExecuted.current) {
      fethServiceGroups();

      hasAlreadyExecuted.current = true;
    }
  }, []);

  const handleKeyUp = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      event.preventDefault();
      currencyMasker(event);
    },
    [],
  );

  const handleSubmit = useCallback(
    async (data: IFormData) => {
      setLoading(true);

      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          serviceGroup: Yup.string().required('Serviço obrigatório.'),
          price: Yup.number().required('O valor do serviço é obrigatório.'),
          commission_amount: Yup.number(),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const formData = {
          service_group_id: data.serviceGroup,
          price: data.price,
          commission_amount: data.commission_amount,
          company_id: company.id,
        };

        const response = await api.post('services', formData);

        if (response.status === 200) {
          addToast({
            title: 'Cadastro realizado com sucesso.',
            type: 'success',
            description: 'O serviço foi cadastrado com sucesso.',
          });

          onClose();
          onSave();
          setLoading(false);
        }
      } catch (err) {
        setLoading(false);

        if (err instanceof Yup.ValidationError) {
          const errors = getValidationsErrors(err);

          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          title: 'Não foi possível realizar o caadastro.',
          description:
            'Esse serviço já foi criado ou ocorreu um erro, tente novamente.',
          type: 'error',
        });
      }
    },
    [onClose, onSave, addToast, company.id],
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
          <ModalHeader>{`Disponibilizar categoria de serviço a ${company.name}`}</ModalHeader>
          <ModalCloseButton />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <ModalBody paddingBottom={4}>
              <Flex direction="column">
                <Select
                  fontSize={16}
                  height="48px"
                  backgroundColor="#1c1c1c"
                  color="White"
                  name="serviceGroup"
                  placeholder="Escolha o serviço a ser disponibilizado"
                  containerProps={{
                    height: '52px',
                    marginBottom: '8px',
                    background: '#1c1c1c',
                  }}
                >
                  {serviceGroups.map(opt => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
                </Select>

                <Input
                  placeholder="Preço Nanotech"
                  onKeyUp={handleKeyUp}
                  name="price"
                  icon={FiDollarSign}
                />

                <Input
                  placeholder="Valor da Comissāo"
                  onKeyUp={handleKeyUp}
                  name="commission_amount"
                  icon={FiDollarSign}
                />
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
                isLoading={loading}
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

export default CreateServicePriceModal;
