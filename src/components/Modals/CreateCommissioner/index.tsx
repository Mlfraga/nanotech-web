import React, { useCallback, useRef, useState } from 'react';
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
  ModalOverlay
} from '@chakra-ui/core';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { useToast } from '../../../context/toast';
import api from '../../../services/api';
import getValidationsErrors from '../../../utils/getValidationError';
import FormattedInput from '../../FormattedInput';
import Input from '../../Input';

interface ICreateCommissionerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void | undefined;
  company_id: string;
}

interface IFormData {
  name: string;
  telephone: string;
}

const CreateCommissionerModal: React.FC<ICreateCommissionerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  company_id,
}) => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(
    async (data: IFormData, { reset }) => {
      setLoading(true);

      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required(
            'Nome do comissionário obrigatório',
          ),
          telephone: Yup.string()
            .required('Telefone do comissionário obrigatório')
            .min(9, 'O telefone deve ter no mínimo 9 dígitos')
            .max(11, 'O telefone deve ter no máximo 11 dígitos'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const response = await api.post('commissioners', {
          name: data.name,
          telephone: data.telephone,
          company_id,
        });

        if (response.status === 200) {
          addToast({
            title: 'Cadastro realizado com sucesso.',
            type: 'success',
          });

          setLoading(false);
          onClose();
          onSave();
          reset();
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
          description: 'Tente novamente mais tarde.',
          type: 'error',
        });
      }
    },
    [addToast, onSave, onClose],
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent backgroundColor="#383838" maxWidth="70%" borderRadius="md">
        <ModalHeader>Criar novo comissionário</ModalHeader>
        <ModalCloseButton />

        <Form ref={formRef} onSubmit={handleSubmit}>
          <ModalBody paddingBottom={4}>
            <Flex direction="column">
              <Input placeholder="Nome" name="name" />

              <FormattedInput
                className="commissionerInput"
                id="telephone"
                placeholder="Telefone"
                name="telephone"
                format="## #####-####"
                mask="_"
                icon={FiPhone}
              />
            </Flex>
          </ModalBody>

          <ModalFooter mt={16}>
            <Button
              variant="ghost"
              onClick={onClose}
              _hover={{ background: '#323232' }}
              marginRight={4}
            >
              Cancelar
            </Button>

            <Button
              isLoading={loading}
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
  );
};

export default CreateCommissionerModal;
