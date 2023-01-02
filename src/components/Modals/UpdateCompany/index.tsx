import React, { useCallback, useRef } from 'react';
import { AiOutlineIdcard } from 'react-icons/ai';
import { FiPhone } from 'react-icons/fi';
import { MdBusiness } from 'react-icons/md';

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

import { ICompany } from '../../../interfaces/companies';
import api from '../../../services/api';
import getValidationErrors from '../../../utils/getValidationError';
import FormattedInput from '../../FormattedInput';
import Input from '../../Input';

interface IFormData {
  name?: string;
  telephone?: string;
  cnpj?: string;
  client_identifier?: string;
}

interface IUpdateCompanyModalProps {
  isOpen: boolean;
  onClose: (
    event: React.MouseEvent | React.KeyboardEvent,
    reason?: 'pressedEscape' | 'clickedOverlay',
  ) => void;
  onSave: () => void | undefined;
  company: ICompany | undefined;
}

const UpdateCompanyModal: React.FC<IUpdateCompanyModalProps> = ({
  isOpen,
  onClose,
  onSave,
  company,
}) => {
  const formRef = useRef<FormHandles>(null);
  const toast = useToast();

  const handleSubmit = useCallback(
    async (data: IFormData, event) => {
      try {
        formRef.current?.setErrors({});

        if (
          !data.name &&
          !data.telephone &&
          !data.cnpj &&
          !data.client_identifier
        ) {
          formRef.current?.setErrors({
            name: 'Pelo menos algum campo deve ser preenchido',
            telephone: 'Pelo menos algum campo deve ser preenchido',
            cnpj: 'Pelo menos algum campo deve ser preenchido',
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
          cnpj: data.cnpj
            ? Yup.string()
                .length(14, 'O Cnpj deve conter 14 dígitos.')
                .nullable()
            : Yup.string(),
          client_identifier: data.client_identifier
            ? Yup.string()
                .length(2, 'O identificador deve conter 2 dígitos.')
                .nullable()
            : Yup.string(),
        });

        await schema.validate(data, { abortEarly: false });

        await api.put(`companies/${company?.id}`, data);

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
    [onClose, onSave, toast, company],
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
          <ModalHeader>
            {`Alterar dados da concessionária ${company?.name}`}
          </ModalHeader>
          <ModalCloseButton />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <ModalBody paddingBottom={4}>
              <Flex direction="column">
                <Input
                  defaultValue={company?.name}
                  placeholder="Nome"
                  name="name"
                  icon={MdBusiness}
                />
                <FormattedInput
                  className="input"
                  id="telephone"
                  placeholder="Telefone"
                  name="telephone"
                  format="## #####-####"
                  mask="_"
                  defaultValue={company?.telephone}
                  icon={FiPhone}
                />

                <FormattedInput
                  defaultValue={company?.cnpj}
                  placeholder="CNPJ"
                  mask="_"
                  name="cnpj"
                  icon={AiOutlineIdcard}
                  format="##.###.###/####-##"
                />

                <Input
                  defaultValue={company?.client_identifier}
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

export default UpdateCompanyModal;
