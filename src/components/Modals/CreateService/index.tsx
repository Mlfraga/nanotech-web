import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FiDollarSign, FiTool } from 'react-icons/fi';

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
import { ICompany } from '../../../interfaces/companies';

interface IFormData {
  companies: string[];
  name: string;
  description: string;
  default_nanotech_price?: number;
}

interface ICreateServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void | undefined;
}

const CreateServiceModal: React.FC<ICreateServiceModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const hasAlreadyExecuted = useRef<boolean>(false);
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const [loading, setLoading] = useState<boolean>(false);
  const [companyOptions, setCompanyOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    const fethCompanies = async () => {
      const { data: newCompaniesOptions } = await api.get<ICompany[]>(
        '/companies',
      );

      setCompanyOptions(
        newCompaniesOptions.map(company => ({
          value: company.id,
          label: company.name,
        })),
      );
    };

    if (!hasAlreadyExecuted.current) {
      fethCompanies();

      hasAlreadyExecuted.current = true;
    }
  }, []);

  const formatCurrencyValue = useCallback(
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

        // const response = await api.post('services', formData);

        // if (response.status === 200) {
        //   addToast({
        //     title: 'Cadastro realizado com sucesso.',
        //     type: 'success',
        //     description: 'O serviço foi cadastrado com sucesso.',
        //   });

        //   onClose();
        //   onSave();
        //   setLoading(false);
        // }
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
    [onClose, onSave, addToast],
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
          <ModalHeader>{`Criar categoria de serviço`}</ModalHeader>
          <ModalCloseButton />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <ModalBody paddingBottom={4}>
              <Flex direction="column">
                <Input
                  placeholder="Nome do serviço"
                  name="name"
                  icon={FiTool}
                />

                <Select
                  name="serviceGroup"
                  placeholder="Escolha o serviço a ser disponibilizado"
                  multiple
                >
                  {companyOptions.map(company => (
                    <option key={company.value} value={company.value}>
                      {company.label}
                    </option>
                  ))}
                </Select>

                <Input
                  placeholder="Preço Nanotech"
                  onKeyUp={formatCurrencyValue}
                  name="price"
                  icon={FiDollarSign}
                />

                <Input
                  placeholder="Valor da Comissāo"
                  onKeyUp={formatCurrencyValue}
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

export default CreateServiceModal;
