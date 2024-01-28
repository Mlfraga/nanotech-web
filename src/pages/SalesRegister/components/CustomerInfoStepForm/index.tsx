import React from 'react';
import {
  ButtonsContainer,
  CustomerInfosContainer,
  InputContainer,
  InputsContainer,
  Label,
} from './styles';
import Input from '../../../../components/Input';
import { documentMask } from '../../../../utils/masks';
import Button from '../../../../components/Button';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import getValidationsErrors from '../../../../utils/getValidationError';
import { Step } from '../..';

const CustomerInfoStepForm: React.FC<{
  formRef: React.RefObject<FormHandles>;
  document: string;
  hide: boolean;
  setDocument: React.Dispatch<React.SetStateAction<string>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<Step>>;
  setValidatedForms: React.Dispatch<
    React.SetStateAction<{ [K in Step]: boolean }>
  >;
}> = ({
  formRef,
  document,
  hide,
  setDocument,
  setCurrentStep,
  setValidatedForms,
}) => {
  const [isFormValid, setIsFormValid] = React.useState(false);

  const validateForm = () => {
    if (!formRef.current) {
      setIsFormValid(false);
    }

    const {
      name,
      cpf,
      car,
      carModel,
      carPlate,
      carColor,
    } = formRef.current?.getData() as {
      car: string;
      availabilityDate: string;
      carColor: string;
      carModel: string;
      carPlate: string;
      cpf: string;
      deliveryDate: string;
      name: string;
      osNumber: string;
      searchServices: string;
      sourceCar: string;
      unitId: string;
    };

    const schema = Yup.object().shape({
      car: Yup.string().required('Carro obrigatório'),
      carColor: Yup.string().required('Cor do carro obrigatório'),
      carModel: Yup.string().required('Modelo do carro obrigatório'),
      carPlate: Yup.string()
        .required('Chassi do carro obrigatório')
        .length(7, 'O Chassi deve ter 7 dígitos'),
      cpf: Yup.string()
        .required('Cpf obrigatório')
        .matches(
          /^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}-?[0-9]{2}|[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}-?[0-9]{2})$/,
          'O documento deve ter 11 ou 14 dígitos.',
        ),
      name: Yup.string().required('Nome obrigatório'),
    });

    try {
      formRef.current?.setErrors({});
      schema.validateSync(
        {
          name,
          cpf,
          car,
          carModel,
          carPlate,
          carColor,
        },
        {
          abortEarly: false,
        },
      );

      setIsFormValid(true);

      setValidatedForms(prevState => ({
        ...prevState,
        customer_data: true,
      }));
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationsErrors(err);

        formRef.current?.setErrors(errors);
      }

      setValidatedForms(prevState => ({
        ...prevState,
        customer_data: false,
      }));
      setIsFormValid(false);
    }
  };

  const handleNextStep = () => {
    setCurrentStep('service_info');
  };

  return (
    <CustomerInfosContainer style={{ display: hide ? 'none' : 'flex' }}>
      <InputsContainer>
        <InputContainer>
          <Label>Nome:</Label>
          <Input
            className="input"
            id="name"
            type="name"
            name="name"
            onKeyUp={validateForm}
            style={{ width: '30px' }}
          />
        </InputContainer>
        <InputContainer>
          <Label>CPF:</Label>
          <Input
            className="input"
            id="cpf"
            type="cpf"
            name="cpf"
            maxLength={14}
            onKeyUp={validateForm}
            style={{ width: '30px' }}
            onChange={e => setDocument(e.target.value)}
            value={documentMask(document)}
          />
        </InputContainer>
        <InputContainer>
          <Label>Marca do Carro:</Label>
          <Input
            className="input"
            id="car"
            type="car"
            name="car"
            onKeyUp={validateForm}
            style={{ width: '30px' }}
          />
        </InputContainer>
        <InputContainer>
          <Label>Modelo do Carro:</Label>
          <Input
            className="input"
            id="carModel"
            type="carModel"
            name="carModel"
            onKeyUp={validateForm}
            style={{ width: '30px' }}
          />
        </InputContainer>
        <InputContainer>
          <Label>Chassi:</Label>

          <Input
            maxLength={7}
            className="input"
            id="carPlate"
            type="carPlate"
            name="carPlate"
            onKeyUp={validateForm}
            style={{ width: '30px' }}
          />
        </InputContainer>
        <InputContainer>
          <Label>Cor do carro:</Label>

          <Input
            className="input"
            id="carColor"
            type="carColor"
            name="carColor"
            onKeyUp={validateForm}
            style={{ width: '30px' }}
          />
        </InputContainer>
      </InputsContainer>

      <ButtonsContainer>
        {/* <Button isDisabled={false} skipButton>
          Cancelar
          {loadingButton ? <Spinner color="#282828" /> : 'Salvar'}
        </Button> */}

        <Button
          padding={'0.6rem'}
          height={'auto'}
          isDisabled={!isFormValid}
          onClick={handleNextStep}
        >
          Próximo
          {/* {loadingButton ? <Spinner color="#282828" /> : 'Salvar'} */}
        </Button>
      </ButtonsContainer>
    </CustomerInfosContainer>
  );
};

export default CustomerInfoStepForm;
