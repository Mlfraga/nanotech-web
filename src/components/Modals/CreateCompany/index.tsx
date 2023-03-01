import React, { useCallback, useRef, useState } from 'react';
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
  ModalOverlay
} from '@chakra-ui/core';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { useToast } from '../../../context/toast';
import api from '../../../services/api';
import CpfCnpjUtils from '../../../utils/CpfCnpjUtils';
import getValidationsErrors from '../../../utils/getValidationError';
import FormattedInput from '../../FormattedInput';
import Input from '../../Input';

interface ICreateCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void | undefined;
}

interface IFormData {
  companyName: string;
  companyTelephone: string;
  companyCnpj: string;
  companyClientIdentifier: string;
}

const CreateCompanyModal: React.FC<ICreateCompanyModalProps> = ({
  isOpen,
  onClose,
  onSave,
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
          companyName: Yup.string().required(
            'Nome da concessionária obrigatório',
          ),
          companyTelephone: Yup.string()
            .required('Telefone da concessionária obrigatório')
            .min(9, 'O telefone deve ter no mínimo 9 dígitos')
            .max(11, 'O telefone deve ter no máximo 11 dígitos'),
          companyCnpj: Yup.string()
            .required('Cnpj da concessionária obrigatório')
            .length(14, 'O CNPJ deve ter 14 dígitos.'),
          companyClientIdentifier: Yup.string()
            .required('Identificador da concessionária obrigatório')
            .length(2, 'Identificador da concessionária deve ter 2 dígitos.'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const isCnpjValid = CpfCnpjUtils.isCnpjValid(data.companyCnpj);

        if (isCnpjValid !== true) {
          formRef.current?.setErrors({ companyCnpj: 'Cnpj inválido.' });
          return;
        }

        const response = await api.post('companies', {
          name: data.companyName,
          telephone: data.companyTelephone,
          cnpj: data.companyCnpj,
          client_identifier: data.companyClientIdentifier,
        });

        if (response.status === 200) {
          addToast({
            title: 'Cadastro realizado com sucesso.',
            type: 'success',
            description:
              'Agora você já pode registrar unidades, vendedores e gerentes a essa concessionária.',
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
          description:
            'Essa concessionária já foi criada ou ocorreu um erro, tente novamente.',
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
        <ModalHeader>Criar nova concessionária</ModalHeader>
        <ModalCloseButton />

        <Form ref={formRef} onSubmit={handleSubmit}>
          <ModalBody paddingBottom={4}>
            <Flex direction="column">
              <Input placeholder="Nome" name="companyName" icon={MdBusiness} />

              <FormattedInput
                className="companyInput"
                id="telephone"
                placeholder="Telefone"
                name="companyTelephone"
                format="## #####-####"
                mask="_"
                icon={FiPhone}
              />

              <FormattedInput
                placeholder="CNPJ"
                mask="_"
                name="companyCnpj"
                icon={AiOutlineIdcard}
                format="##.###.###/####-##"
              />

              <Input
                placeholder="Identificador"
                name="companyClientIdentifier"
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

export default CreateCompanyModal;
