import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader, ModalOverlay, Text
} from '@chakra-ui/core';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { useToast } from '../../../context/toast';
import { ICompany } from '../../../interfaces/companies';
import api from '../../../services/api';
import pixKeyTypes from '../../../static/PixKeyTypes';
import roleOptions from '../../../static/RoleOptions';
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

interface IFormData {
  name: string;
  email: string;
  telephone: string;
  username: string;
  role: string;
  company: 'SELLER' | 'MANAGER'| 'NANOTECH_REPRESENTATIVE' | 'COMMISSIONER' | 'SERVICE_PROVIDER';
  pixKeyType: 'RANDOM' | 'CPF' | 'PHONE' | 'EMAIL';
  phonePixKey: string;
  cpfPixKey: string;
  emailPixKey: string;
  randomPixKey: string;
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
  const [pixKeyType, setPixKeyType] = useState<'RANDOM' | 'CPF' | 'PHONE' | 'EMAIL'>();

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
    async (data: IFormData) => {
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
            role !== 'NANOTECH_REPRESENTATIVE' && role !== 'SERVICE_PROVIDER'
              ? Yup.string()
                  .uuid()
                  .required('Concessionária do usuário obrigatório')
              : Yup.string(),
          ...(role === 'COMMISSIONER' && {
            pixKeyType: Yup.string().required('Tipo de chave do PIX do comissionário obrigatório')
          }),
          ...(data.pixKeyType === 'PHONE' && {
            phonePixKey: Yup.string()
            .min(9, 'O telefone deve ter no mínimo 9 dígitos')
            .max(13, 'O telefone deve ter no máximo 11 dígitos').required('Tipo da chave PIX do comissionário obrigatório'),
          }),
          ...(data.pixKeyType === 'CPF' && {
            cpfPixKey: Yup.string().length(11, 'A chave PIX CPF deve ter 11 dígitos').required('Chave PIX do comissionário obrigatório'),
          }),
          ...(data.pixKeyType === 'EMAIL' && {
            emailPixKey: Yup.string().email('A chave PIX email deve ser um email válido').required('Chave PIX do comissionário obrigatório'),
          }),
          ...(data.pixKeyType === 'RANDOM' && {
            randomPixKey: Yup.string().uuid('A chave PIX email deve ser um código válido').required('Chave PIX do comissionário obrigatório'),
          }),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const pix_key = () => {
          switch(data.pixKeyType) {
            case 'CPF':
              return data.cpfPixKey;
            case 'EMAIL':
              return data.emailPixKey;
            case 'PHONE':
              return data.phonePixKey;
            case 'RANDOM':
              return data.randomPixKey;
          }
        }

        const payload = {
          name: data.name,
          username: data.username,
          role: data.role,
          email: data.email,
          telephone: data.telephone,
          pix_key_type: data.pixKeyType,
          pix_key: pix_key(),
          company: data.company,
        };

        await api.post('/users', payload);

        addToast({
          title: 'Usuário criado com sucesso.',
          description: 'Usuário já disponível para login.',
          type: 'success',
        });

        onSave();
      } catch (err) {
        console.log('err: ', err);
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

  const close = (e: React.MouseEvent | React.KeyboardEvent) => {
    setPixKeyType(undefined);
    setRole(null);

    onClose(e);
  }

  return (
    <Modal isOpen={isOpen} onClose={close}>
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
                  <Text ml={2} fontSize="18px" fontFamily="Inter">
                    Nome:
                  </Text>
                  <Text fontSize="18px" fontFamily="Inter">
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
                  <Text ml={2} fontSize="18px" fontFamily="Inter">
                    Email:
                  </Text>
                  <Text fontSize="18px" fontFamily="Inter">
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
                  <Text ml={2} fontSize="18px" fontFamily="Inter">
                    Telefone:
                  </Text>
                  <Text fontSize="18px" fontFamily="Inter">
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
                  <Text ml={2} fontSize="18px" fontFamily="Inter">
                    Login:
                  </Text>
                  <Text fontSize="18px" fontFamily="Inter">
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
                  <Text ml={2} fontSize="18px" fontFamily="Inter">
                    Cargo:
                  </Text>
                  <Text fontSize="18px" fontFamily="Inter">
                    *
                  </Text>
                </Flex>

                <Select
                  fontSize={16}
                  height="48px"
                  backgroundColor="#1c1c1c"
                  color="White"
                  name="role"
                  onChange={event => {
                    setRole(event.target.value);
                    setPixKeyType(undefined)
                  }}
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

              {role &&
                role !== 'NANOTECH_REPRESENTATIVE' &&
                role !== 'SERVICE_PROVIDER' &&  (
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
                      <Text fontSize="18px" fontFamily="Inter">
                        Concessionária:
                      </Text>
                      <Text fontSize="18px" fontFamily="Inter">
                        *
                      </Text>
                    </Flex>

                    <Select
                      fontSize={16}
                      height="48px"
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

            <Flex style={{ gap: 8 }} mt={16}>
              {role === 'COMMISSIONER' && (
                <Flex
                  w="100%"
                  direction="column"
                  maxW="calc(100% / 3)"
                  maxH="40px"
                >
                  <Flex mb={2} alignItems="center" justifyContent="space-between">
                    <Text ml={2} fontSize="18px" fontFamily="Inter">
                      Tipo Chave Pix:
                    </Text>
                    <Text fontSize="18px" fontFamily="Inter">
                      *
                    </Text>
                  </Flex>
                  <Select
                    fontSize={16}
                    height="48px"
                    backgroundColor="#1c1c1c"
                    color="White"
                    name="pixKeyType"
                    onChange={event => {
                      setPixKeyType(event.target.value as 'RANDOM' | 'CPF' | 'PHONE' | 'EMAIL')
                    }}
                    placeholder="Selecione o tipo da chave PIX"
                    containerProps={{
                      height: '52px',
                      marginBottom: '8px',
                      background: '#1c1c1c',
                    }}
                  >
                    {pixKeyTypes.map(opt => (
                      <option key={opt.id} value={opt.id}>
                        {opt.name}
                      </option>
                    ))}
                  </Select>
                </Flex>
              )}

              {pixKeyType === 'PHONE' && (
                <Flex
                  w="100%"
                  direction="column"
                  maxW="calc(100% / 3)"
                  maxH="40px"
                >
                  <Flex mb={2} alignItems="center" justifyContent="space-between">
                    <Text ml={2} fontSize="18px" fontFamily="Inter">
                      N˚ Telefone:
                    </Text>
                    <Text fontSize="18px" fontFamily="Inter">
                      *
                    </Text>
                  </Flex>

                  <FormattedInput
                    id="phonePixKey"
                    name="phonePixKey"
                    format="## #####-####"
                    mask="_"
                  />
                </Flex>
              )}

              {pixKeyType === 'CPF' && (
                <Flex
                  w="100%"
                  direction="column"
                  maxW="calc(100% / 3)"
                  maxH="40px"
                >
                  <Flex mb={2} alignItems="center" justifyContent="space-between">
                    <Text ml={2} fontSize="18px" fontFamily="Inter">
                      CPF:
                    </Text>
                    <Text fontSize="18px" fontFamily="Inter">
                      *
                    </Text>
                  </Flex>
                  <FormattedInput
                    id="cpfPixKey"
                    name="cpfPixKey"
                    format="###.###.###-##"
                    mask="_"
                  />
                </Flex>
              )}

              {pixKeyType === 'EMAIL' && (
                <Flex
                  w="100%"
                  direction="column"
                  maxW="calc(100% / 3)"
                  maxH="40px"
                >
                  <Flex mb={2} alignItems="center" justifyContent="space-between">
                    <Text ml={2} fontSize="18px" fontFamily="Inter">
                      Email:
                    </Text>
                    <Text fontSize="18px" fontFamily="Inter">
                      *
                    </Text>
                  </Flex>
                  <Input
                    disabled={loading}
                    className="input"
                    id="emailPixKey"
                    type="emailPixKey"
                    name="emailPixKey"
                  />
                </Flex>
              )}

              {pixKeyType === 'RANDOM' && (
                <Flex
                  w="100%"
                  direction="column"
                  maxW="calc(100% / 3)"
                  maxH="40px"
                >
                  <Flex mb={2} alignItems="center" justifyContent="space-between">
                    <Text ml={2} fontSize="18px" fontFamily="Inter">
                      Chave PIX Aleatória:
                    </Text>
                    <Text fontSize="18px" fontFamily="Inter">
                      *
                    </Text>
                  </Flex>
                  <Input
                    disabled={loading}
                    className="input"
                    id="randomPixKey"
                    type="randomPixKey"
                    name="randomPixKey"
                  />
                </Flex>
              )}
            </Flex>
          </ModalBody>

          <ModalFooter mt={16}>
            <Button
              variant="ghost"
              onClick={close}
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
