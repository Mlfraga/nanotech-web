import React, { useCallback, useRef } from 'react';
import { FiPhone } from 'react-icons/fi';

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

import { IUser } from '../../../interfaces/users';
import api from '../../../services/api';
import getValidationErrors from '../../../utils/getValidationError';
import FormattedInput from '../../FormattedInput';
import Input from '../../Input';

interface IFormData {
  name?: string;
  telephone?: string;
  role?: string;
}

interface IUpdateUserDataModalProps {
  isOpen: boolean;
  onClose: (
    event: React.MouseEvent | React.KeyboardEvent,
    reason?: 'pressedEscape' | 'clickedOverlay',
  ) => void;
  onSave: () => void | undefined;
  user: IUser | undefined;
}

const UpdateUserDataModal: React.FC<IUpdateUserDataModalProps> = ({
  isOpen,
  onClose,
  onSave,
  user,
}) => {
  const formRef = useRef<FormHandles>(null);
  const toast = useToast();

  const handleSubmit = useCallback(
    async (data: IFormData, event) => {
      try {
        formRef.current?.setErrors({});

        if (!data.name && !data.telephone && !data.role) {
          formRef.current?.setErrors({
            name: 'Pelo menos algum campo deve ser preenchido',
            telephone: 'Pelo menos algum campo deve ser preenchido',
            role: 'Pelo menos algum campo deve ser preenchido',
          });

          return;
        }

        const schema = Yup.object().shape({
          name: Yup.string(),
          telephone: data.telephone
            ? Yup.string()
                .max(
                  13,
                  'O número de telefone deve conter no máximo 11 dígitos.',
                )
                .min(8, 'O número de telefone deve conter no mínimo 8 dígitos.')
            : Yup.string(),
          role: Yup.string(),
        });

        await schema.validate(data, { abortEarly: false });

        let submitData = {};

        if (data.name) {
          submitData = { ...submitData, name: data.name };
        }

        if (data.telephone) {
          submitData = { ...submitData, telephone: data.telephone };
        }

        if (data.role) {
          submitData = { ...submitData, role: data.role };
        }

        await api.put(`users/${user?.user?.id}`, submitData);

        toast({
          status: 'success',
          title: 'Dados da concessionária alterados com sucesso',
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
          title: 'Erro ao atualizar os dados da concessionária',
          description:
            'Ocorreu um erro ao atualizar os dados da concessionária, tente novamente.',
          position: 'top',
          duration: 5000,
        });
      }
    },
    [user, onClose, onSave, toast],
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
          <ModalHeader>{`Alterar dados de ${user?.name}`}</ModalHeader>
          <ModalCloseButton />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <ModalBody paddingBottom={4}>
              <Flex direction="column">
                <Input
                  defaultValue={user?.name}
                  placeholder="Nome"
                  name="name"
                />

                <FormattedInput
                  className="input"
                  id="telephone"
                  placeholder="Contato"
                  name="telephone"
                  format="## #####-####"
                  mask="_"
                  defaultValue={user?.user?.telephone}
                  icon={FiPhone}
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

export default UpdateUserDataModal;
