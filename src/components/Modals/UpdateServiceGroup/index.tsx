import React, { useCallback, useRef } from 'react';

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
import getValidationErrors from '../../../utils/getValidationError';
import { currencyMasker } from '../../../utils/masks';
import Input from '../../Input';
import { IServiceGroup } from '../../../interfaces/service_group';
import Textarea from '../../Textarea';

interface IFormData {
  name: string;
  description: string;
}

interface IUpdateServiceGroupModalProps {
  isOpen: boolean;
  onClose: (
    event: React.MouseEvent | React.KeyboardEvent,
    reason?: 'pressedEscape' | 'clickedOverlay',
  ) => void;
  onSave: () => void | undefined;
  serviceGroup: IServiceGroup;
}

const UpdateServiceGroupModal: React.FC<IUpdateServiceGroupModalProps> = ({
  isOpen,
  onClose,
  onSave,
  serviceGroup,
}) => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: IFormData, event) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: !data.name
            ? Yup.string().required('Nome obrigatório')
            : Yup.string(),
          description: !data.name
            ? Yup.string().required('Descriçāo obrigatório')
            : Yup.string(),
        });

        await schema.validate(data, { abortEarly: false });

        await api.put(`service-groups/${serviceGroup.id}`, {
          ...(data.name && { name: data.name }),
          ...(data.description && { description: data.description }),
        });

        addToast({
          type: 'success',
          title: 'Serviço alterado com sucesso',
        });

        onClose(event);

        onSave();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro ao atualizar o serviço',
          description:
            'Ocorreu um erro ao atualizar dados do serviço, tente novamente.',
        });
      }
    },
    [serviceGroup, onClose, onSave, addToast],
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
              <Flex direction="column" style={{ gap: '1rem' }}>
                <Input
                  placeholder="Nome"
                  name="name"
                  defaultValue={serviceGroup.name}
                />

                <Textarea
                  placeholder="Descriçāo"
                  name="description"
                  defaultValue={serviceGroup.description}
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

export default UpdateServiceGroupModal;
