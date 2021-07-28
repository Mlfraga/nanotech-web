import React, { useCallback, useRef } from 'react';
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
  useToast,
} from '@chakra-ui/core';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import api from '../../../services/api';
import getValidationErrors from '../../../utils/getValidationError';
import { currencyMasker } from '../../../utils/masks';
import Input from '../../Input';

interface IFormData {
  name: string;
  price: number;
}

interface IUpdateServicePriceModalProps {
  isOpen: boolean;
  onClose: (
    event: React.MouseEvent | React.KeyboardEvent,
    reason?: 'pressedEscape' | 'clickedOverlay',
  ) => void;
  onSave: () => void | undefined;
  id?: string;
}

const UpdateServicePriceModal: React.FC<IUpdateServicePriceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  id,
}) => {
  const formRef = useRef<FormHandles>(null);
  const toast = useToast();

  const handleKeyUp = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      event.preventDefault();
      currencyMasker(event);
    },
    [],
  );

  const handleSubmit = useCallback(
    async (data: IFormData, event) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: !data.price
            ? Yup.string().required('Nome obrigatório')
            : Yup.string(),
          price: !data.name
            ? Yup.number().required('Preço obrigatório')
            : Yup.string(),
        });

        await schema.validate(data, { abortEarly: false });

        if (!data.price) {
          await api.put(`services/${id}`, { name: data.name });
        }

        if (!data.name) {
          await api.put(`services/${id}`, { price: data.price });
        }

        if (data.name && data.price) {
          await api.put(`services/${id}`, data);
        }

        toast({
          status: 'success',
          title: 'Serviço alterado com sucesso',
          position: 'top',
          duration: 3000,
        });

        onClose(event);

        onSave();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        toast({
          status: 'error',
          title: 'Erro ao atualizar o serviço',
          description:
            'Ocorreu um erro ao atualizar dados do serviço, tente novamente.',
          position: 'top',
          duration: 5000,
        });
      }
    },
    [id, onClose, onSave, toast],
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
          <ModalHeader>Alterar dados do serviço</ModalHeader>
          <ModalCloseButton />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <ModalBody paddingBottom={4}>
              <Flex direction="column">
                <Input placeholder="Nome" name="name" />

                <Input
                  placeholder="Novo valor"
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

export default UpdateServicePriceModal;
