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

import { IUnit } from '../../../interfaces/unit';
import api from '../../../services/api';
import getValidationErrors from '../../../utils/getValidationError';
import FormattedInput from '../../FormattedInput';
import Input from '../../Input';

interface IFormData {
  name?: string;
  telephone?: string;
  role?: string;
  client_identifier?: string;
}

interface IUpdateUnitDataModalProps {
  isOpen: boolean;
  onClose: (
    event: React.MouseEvent | React.KeyboardEvent,
    reason?: 'pressedEscape' | 'clickedOverlay',
  ) => void;
  onSave: () => void | undefined;
  unit: IUnit | undefined;
}

const UpdateUnitDataModal: React.FC<IUpdateUnitDataModalProps> = ({
  isOpen,
  onClose,
  onSave,
  unit,
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
            client_identifier: 'Pelo menos algum campo deve ser preenchido',
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
          client_identifier: data.client_identifier
            ? Yup.string()
                .length(2, 'O identificador deve conter 2 dígitos.')
                .nullable()
            : Yup.string(),
        });

        await schema.validate(data, { abortEarly: false });

        let submitData = {};

        if (data.name) {
          submitData = { ...submitData, name: data.name };
        }

        if (data.telephone) {
          submitData = { ...submitData, telephone: data.telephone };
        }

        if (data.client_identifier) {
          submitData = {
            ...submitData,
            client_identifier: data.client_identifier,
          };
        }

        await api.put(`units/${unit?.id}`, submitData);

        toast({
          status: 'success',
          title: 'Dados da unidade alterados com sucesso',
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
          title: 'Erro ao atualizar os dados da unidade',
          description:
            'Ocorreu um erro ao atualizar os dados da unidade, tente novamente.',
          position: 'top',
          duration: 5000,
        });
      }
    },
    [unit, onClose, onSave, toast],
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
          <ModalHeader>{`Alterar dados da unidade ${unit?.name}`}</ModalHeader>
          <ModalCloseButton />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <ModalBody paddingBottom={4}>
              <Flex direction="column">
                <Input
                  defaultValue={unit?.name}
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
                  defaultValue={unit?.telephone}
                  icon={FiPhone}
                />

                <Input
                  defaultValue={unit?.client_identifier}
                  placeholder="Identificador"
                  name="client_identifier"
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

export default UpdateUnitDataModal;
