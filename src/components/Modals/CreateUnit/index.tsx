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
import { IFormattedCompany } from '../../../interfaces/companies';
import api from '../../../services/api';
import getValidationsErrors from '../../../utils/getValidationError';
import FormattedInput from '../../FormattedInput';
import Input from '../../Input';

interface IFormData {
  name?: string;
  telephone?: string;
  role?: string;
  client_identifier?: string;
}

interface ICreateUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void | undefined;
  company: IFormattedCompany | undefined;
}

const CreateUnitModal: React.FC<ICreateUnitModalProps> = ({
  isOpen,
  onClose,
  onSave,
  company,
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
          name: Yup.string().required('Nome da unidade obrigatório'),
          client_identifier: Yup.string()
            .required('Identificador da unidade obrigatório')
            .length(2, 'Identificador da concessionária deve ter 2 dígitos.'),
          telephone: Yup.string()
            .required('Telefone da unidade obrigatório')
            .min(9, 'O telefone deve ter no mínimo 9 dígitos')
            .max(11, 'O telefone deve ter no máximo 11 dígitos'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const requestDataSubmit = {
          name: data.name,
          telephone: data.telephone,
          companyId: company?.id,
          client_identifier: data?.client_identifier,
        };

        await api.post('units', requestDataSubmit);

        addToast({
          title: 'Sucesso',
          description: `Unidade adicionada a concessionária ${company?.name}, com sucesso`,
          type: 'success',
        });

        setLoading(false);

        onClose();
        onSave();

        reset();
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
            'Essa unidade já foi criada ou ocorreu um erro, tente novamente.',
          type: 'error',
        });
      }
    },
    [company, onClose, onSave, addToast],
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
          <ModalHeader>{`Adicionar nova unidade à ${company?.name}`}</ModalHeader>
          <ModalCloseButton />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <ModalBody paddingBottom={4}>
              <Flex direction="column">
                <Input placeholder="Nome" name="name" />

                <FormattedInput
                  className="input"
                  id="telephone"
                  placeholder="Contato"
                  name="telephone"
                  format="## #####-####"
                  mask="_"
                  icon={FiPhone}
                />

                <Input placeholder="Identificador" name="client_identifier" />
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

export default CreateUnitModal;
