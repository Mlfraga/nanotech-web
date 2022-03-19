import React, { useCallback, useRef } from 'react';
import { FiDollarSign } from 'react-icons/fi';
import { useHistory, useParams } from 'react-router-dom';

import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import Breadcrumb from '../../components/Breadcrumb';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Menu from '../../components/Menu';
import { useToast } from '../../context/toast';
import api from '../../services/api';
import getValidationsErrors from '../../utils/getValidationError';
import { currencyMasker } from '../../utils/masks';
import { Container, Content, Separator, InputContainer } from './styles';

interface IFormData {
  name: string;
  company_id: string;
  price: number;
}

interface IServicesRegisterRouterParams {
  company_id: string;
}

const ServicesRegister = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();
  const { company_id } = useParams<IServicesRegisterRouterParams>();
  const { addToast } = useToast();

  const handleKeyUp = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      event.preventDefault();
      currencyMasker(event);
    },
    [],
  );

  const handleSubmit = useCallback(
    async data => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          serviceName: Yup.string().required('Nome do serviço obrigatório.'),
          serviceValue: Yup.number().required(
            'O valor do serviço é obrigatório.',
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const formData: IFormData = {
          name: data.serviceName,
          price: data.serviceValue,
          company_id,
        };

        const response = await api.post('services', formData);

        if (response.status === 200) {
          addToast({
            title: 'Cadastro realizado com sucesso.',
            type: 'success',
            description: 'O serviço foi cadastrado com sucesso.',
          });

          history.push(`/company/prices/${company_id}`);
        }
      } catch (err) {
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
    [addToast, history, company_id],
  );

  return (
    <Container>
      <Menu />
      <Breadcrumb text="Adicionar serviços" />
      <Content
        marginLeft="auto"
        marginRight="auto"
        width="100%"
        maxWidth={{
          xs: '90vw',
          sm: '90vw',
          md: '80vw',
          lg: '78vw',
          xl: '90vw',
        }}
      >
        <Separator>
          <span>Cadastro de serviços</span>
          <div />
        </Separator>

        <Form ref={formRef} onSubmit={handleSubmit}>
          <div className="inputs">
            <InputContainer style={{ maxWidth: '375px', width: '100%' }}>
              <div className="labels">
                <span>Nome do serviço:</span>
                <span>*</span>
              </div>
              <Input
                className="input"
                id="serviceName"
                type="serviceName"
                name="serviceName"
                style={{ width: '30px' }}
              />
            </InputContainer>

            <InputContainer style={{ maxWidth: '250px', width: '100%' }}>
              <div className="labels">
                <span>Valor do serviço:</span>
                <span>*</span>
              </div>
              <Input
                onKeyUp={handleKeyUp}
                className="input"
                id="serviceValue"
                type="serviceValue"
                name="serviceValue"
                style={{ width: '30px' }}
                icon={FiDollarSign}
              />
            </InputContainer>
          </div>
          <Button type="submit">Cadastrar</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default ServicesRegister;
