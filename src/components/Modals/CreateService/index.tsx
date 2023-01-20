import React, { useCallback, useRef, useState } from 'react';
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
  ModalOverlay
} from '@chakra-ui/core';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { useToast } from '../../../context/toast';
import api from '../../../services/api';
import getValidationsErrors from '../../../utils/getValidationError';
import { currencyMasker } from '../../../utils/masks';
import Input from '../../Input';

interface IFormData {
  name: string;
  price: number;
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
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const [loading, setLoading] = useState<boolean>(false);

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
          name: Yup.string().required('Nome do serviço obrigatório.'),
          price: Yup.number().required('O valor do serviço é obrigatório.'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const formData = {
          name: data.name,
          price: data.price,
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
          <ModalHeader>{`Adicionar serviço a concessionária ${company.name}`}</ModalHeader>
          <ModalCloseButton />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <ModalBody paddingBottom={4}>
              <Flex direction="column">
                <Input placeholder="Nome" name="name" />

                <Input
                  placeholder="Preço Nanotech"
                  onKeyUp={handleKeyUp}
                  name="price"
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
