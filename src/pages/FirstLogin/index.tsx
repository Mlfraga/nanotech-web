import React, { useRef } from 'react';
import { useEffect } from 'react';
import { FiLock } from 'react-icons/fi';
import { useHistory, useLocation } from 'react-router-dom';

import { Flex, Text } from '@chakra-ui/core';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import Button from '../../components/Button';
import Input from '../../components/Input';
import { useToast } from '../../context/toast';
import api from '../../services/api';
import getValidationsErrors from '../../utils/getValidationError';
import { ButtonsContainer, Container, Content, InputContainer } from './styles';

interface IUpdatePasswordForm {
  password: string;
  confirmPassword: string;
}

interface IStateLocation {
  comingFromLogin: boolean;
}

const FirstLogin: React.FC = () => {
  const history = useHistory();
  const location = useLocation<IStateLocation>();
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  useEffect(() => {
    if (!location?.state?.comingFromLogin) {
      history.push('/services');
    }
  }, [history, location]);

  const updatePassword = async (data: IUpdatePasswordForm) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        password: Yup.string()
          .min(8, 'A senha deve conter no mínimo 8 caracteres.')
          .required('Senha obrigatória'),
        confirmPassword: Yup.string()
          .min(8, 'A senha deve conter no mínimo 8 caracteres.')
          .required()
          .oneOf(
            [Yup.ref('password')],
            'As senhas digitadas devem ser iguais.',
          ),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      await api.patch('/users/change-password', {
        newPassword: data.confirmPassword,
      });

      history.push('services');

      addToast({ title: 'Senha redefinida com sucesso.', type: 'success' });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationsErrors(err);

        formRef.current?.setErrors(errors);
      }
    }
  };

  return (
    <Container>
      <Content
        width={{
          xs: '90%',
          sm: '90%',
          md: '70%',
          lg: '60%',
          xl: '40%',
        }}
        height="500px"
        backgroundColor="#1d1d1d"
        borderRadius={26}
        paddingY={{
          xs: 46,
          sm: 46,
          md: 46,
          lg: 46,
          xl: 46,
        }}
        paddingX={{
          xs: 4,
          sm: 8,
          md: 80,
          lg: 80,
          xl: 80,
        }}
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Flex
          marginBottom={8}
          w={20}
          h={20}
          bg="#355a9d"
          borderRadius="full"
          alignItems="center"
          justifyContent="center"
        >
          <FiLock size={32} />
        </Flex>

        <Text marginBottom={2} fontSize={14}>
          Altere sua senha!
        </Text>

        <Text marginBottom={8} color="#8e8e8e" fontSize={14}>
          Antes de começar a usar o sistema, redefina sua senha.
        </Text>

        <Form ref={formRef} onSubmit={updatePassword}>
          <InputContainer>
            <Input
              className="input"
              id="password"
              type="password"
              name="password"
              placeholder="Nova Senha"
              icon={FiLock}
            />
          </InputContainer>

          <InputContainer>
            <Input
              className="input"
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Confirmar Nova Senha"
              icon={FiLock}
            />
          </InputContainer>

          <ButtonsContainer justifyContent="space-between">
            <Button skipButton onClick={() => history.push('/services')}>
              Manter senha atual
            </Button>
            <Button type="submit">Alterar</Button>
          </ButtonsContainer>
        </Form>
      </Content>
    </Container>
  );
};

export default FirstLogin;
