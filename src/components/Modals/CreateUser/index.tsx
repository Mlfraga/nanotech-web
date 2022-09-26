import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  ModalOverlay,
} from '@chakra-ui/core';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { useToast } from '../../../context/toast';
import { ICompany } from '../../../interfaces/companies';
import api from '../../../services/api';
import getValidationsErrors from '../../../utils/getValidationError';
import FormattedInput from '../../FormattedInput';
import Input from '../../Input';
import Select, { ISelectOption } from '../../Select';

interface ICreateUserModalProps {
  isOpen: boolean;
  onClose: (
    event: React.MouseEvent | React.KeyboardEvent,
    reason?: 'pressedEscape' | 'clickedOverlay',
  ) => void;
  onSave: () => void | undefined;
}

const CreateUserModal: React.FC<ICreateUserModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const [role, setRole] = useState<null | string>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [companiesOptions, setCompaniesOptions] = useState<ISelectOption[]>([]);

  const roleOptions = [
    { value: 'SELLER', label: 'Vendedor' },
    { value: 'MANAGER', label: 'Gerente' },
    { value: 'NANOTECH_REPRESENTATIVE', label: 'Representante Nanotech' },
  ];

  useEffect(() => {
    api.get('companies/').then(response => {
      const companies: ICompany[] = response.data;

      setCompaniesOptions(
        companies.map(company => ({
          value: company.id,
          label: company.name,
        })),
      );
    });
  }, []);

  const handleSubmit = useCallback(
    async data => {
      setLoading(true);

      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome do usuário obrigatório'),
          email: Yup.string().required('E-mail obrigatório'),
          telephone: Yup.string()
            .min(9, 'O telefone deve ter no mínimo 9 dígitos')
            .max(13, 'O telefone deve ter no máximo 11 dígitos'),
          username: Yup.string().required('Nome de login obrigatório'),
          role: Yup.string().required('Cargo do usuário obrigatório'),
          company:
            role !== 'NANOTECH_REPRESENTATIVE'
              ? Yup.string()
                  .uuid()
                  .required('Concessionária do usuário obrigatório')
              : Yup.string(),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/users', data);

        addToast({
          title: 'Usuário criado com sucesso.',
          description: 'Usuário já disponível para login.',
          type: 'success',
        });

        onSave();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationsErrors(err);

          formRef.current?.setErrors(errors);
        } else {
          addToast({
            title: 'Não foi possível realizar o cadastro.',
            description:
              'Esse usuário já foi criado ou ocorreu um erro, tente novamente.',
            type: 'error',
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [role, addToast, onSave],
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent backgroundColor="#383838" maxWidth="70%" borderRadius="md">
        <ModalHeader>Criar novo usuário</ModalHeader>
        <ModalCloseButton />

        <Form ref={formRef} onSubmit={handleSubmit}>
          <ModalBody paddingBottom={4}>
            <Flex style={{ gap: 8 }}>
              <Flex
                w="100%"
                direction="column"
                maxW="calc(100% / 3)"
                maxH="40px"
              >
                <Flex mb={2} alignItems="center" justifyContent="space-between">
                  <Text ml={2} fontSize="18px" fontFamily="Roboto">
                    Nome:
                  </Text>
                  <Text fontSize="18px" fontFamily="Roboto">
                    *
                  </Text>
                </Flex>

                <Input
                  style={{ fontSize: '16px' }}
                  disabled={loading}
                  className="input"
                  id="name"
                  type="name"
                  name="name"
                />
              </Flex>

              <Flex
                w="100%"
                direction="column"
                maxW="calc(100% / 3)"
                maxH="40px"
              >
                <Flex mb={2} alignItems="center" justifyContent="space-between">
                  <Text ml={2} fontSize="18px" fontFamily="Roboto">
                    Email:
                  </Text>
                  <Text fontSize="18px" fontFamily="Roboto">
                    *
                  </Text>
                </Flex>

                <Input
                  style={{ fontSize: '16px' }}
                  disabled={loading}
                  className="input"
                  id="email"
                  type="email"
                  name="email"
                />
              </Flex>

              <Flex
                w="100%"
                direction="column"
                maxW="calc(100% / 3)"
                maxH="40px"
              >
                <Flex mb={2} alignItems="center" justifyContent="space-between">
                  <Text ml={2} fontSize="18px" fontFamily="Roboto">
                    Telefone:
                  </Text>
                  <Text fontSize="18px" fontFamily="Roboto">
                    *
                  </Text>
                </Flex>

                <FormattedInput
                  style={{ fontSize: '16px' }}
                  disabled={loading}
                  className="input"
                  id="telephone"
                  name="telephone"
                  format="## #####-####"
                  mask="_"
                />
              </Flex>
            </Flex>

            <Flex style={{ gap: 8 }} mt={16}>
              <Flex
                w="100%"
                direction="column"
                maxW="calc(100% / 3)"
                maxH="40px"
              >
                <Flex mb={2} alignItems="center" justifyContent="space-between">
                  <Text ml={2} fontSize="18px" fontFamily="Roboto">
                    Login:
                  </Text>
                  <Text fontSize="18px" fontFamily="Roboto">
                    *
                  </Text>
                </Flex>

                <Input
                  style={{ fontSize: '16px' }}
                  disabled={loading}
                  className="input"
                  id="name"
                  name="username"
                />
              </Flex>

              <Flex
                w="100%"
                direction="column"
                maxW="calc(100% / 3)"
                maxH="40px"
              >
                <Flex mb={2} alignItems="center" justifyContent="space-between">
                  <Text ml={2} fontSize="18px" fontFamily="Roboto">
                    Cargo:
                  </Text>
                  <Text fontSize="18px" fontFamily="Roboto">
                    *
                  </Text>
                </Flex>

                <Select
                  fontSize={16}
                  height="50px"
                  backgroundColor="#1c1c1c"
                  color="White"
                  name="role"
                  onChange={event => setRole(event.target.value)}
                  placeholder="Selecione o cargo do usuário"
                  containerProps={{
                    height: '52px',
                    background: '#1c1c1c',
                  }}
                >
                  {roleOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </Flex>

              {role && role !== 'NANOTECH_REPRESENTATIVE' && (
                <Flex
                  w="100%"
                  direction="column"
                  maxW="calc(100% / 3)"
                  maxH="40px"
                >
                  <Flex
                    mb={2}
                    pl={2}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Text fontSize="18px" fontFamily="Roboto">
                      Concessionária:
                    </Text>
                    <Text fontSize="18px" fontFamily="Roboto">
                      *
                    </Text>
                  </Flex>

                  <Select
                    fontSize={16}
                    height="50px"
                    backgroundColor="#1c1c1c"
                    color="White"
                    name="company"
                    placeholder="Concessionária"
                    containerProps={{
                      height: '52px',
                      background: '#1c1c1c',
                    }}
                  >
                    {companiesOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Select>
                </Flex>
              )}
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

export default CreateUserModal;
