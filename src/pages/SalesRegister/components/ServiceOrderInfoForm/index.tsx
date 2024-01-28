import React from 'react';
import {
  ButtonsContainer,
  ServiceOrderInfosContainer,
  DateTimeContainer,
  InputContainer,
  InputsContainer,
  Label,
  SelectContainer,
  TextareaContainer,
} from './styles';
import Input from '../../../../components/Input';
import Button from '../../../../components/Button';
import Select from '../../../../components/Select';
import Datetime from '../../../../components/Datetime';
import Textarea from '../../../../components/Textarea';
import { Step } from '../..';
import * as Yup from 'yup';
import getValidationsErrors from '../../../../utils/getValidationError';
import { FormHandles } from '@unform/core';

const ServiceOrderInfoForm: React.FC<{
  sourceCarSelectOption: { value: string; label: string }[];
  hide: boolean;
  formRef: React.RefObject<FormHandles>;
  unitSelectOptions: { value: string; label: string }[];
  setCurrentStep: React.Dispatch<React.SetStateAction<Step>>;
  setValidatedForms: React.Dispatch<
    React.SetStateAction<{ [K in Step]: boolean }>
  >;
}> = ({
  sourceCarSelectOption,
  hide,
  formRef,
  unitSelectOptions,
  setCurrentStep,
  setValidatedForms,
}) => {
  const [isFormValid, setIsFormValid] = React.useState(false);

  const validateForm = () => {
    if (!formRef.current) {
      setIsFormValid(false);
    }

    const {
      sourceCar,
      unitId,
      osNumber,
      availabilityDate,
      deliveryDate,
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
      sourceCar: Yup.string().required('Origem do carro obrigatório'),
      unitId: Yup.string().required('Unidade obrigatório'),
      osNumber: Yup.number().required('Código da OS obrigatório'),
      availabilityDate: Yup.string().required(
        'Data e hora de disponibilidade obrigatório',
      ),
      deliveryDate: Yup.string().required('Data e hora de entrega obrigatório'),
    });

    try {
      formRef.current?.setErrors({});
      schema.validateSync(
        {
          sourceCar,
          unitId,
          osNumber,
          availabilityDate,
          deliveryDate,
        },
        {
          abortEarly: false,
        },
      );

      setIsFormValid(true);

      setValidatedForms(prevState => ({
        ...prevState,
        service_info: true,
      }));
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationsErrors(err);

        formRef.current?.setErrors(errors);
      }

      setValidatedForms(prevState => ({
        ...prevState,
        service_info: false,
      }));
      setIsFormValid(false);
    }
  };

  const handleNextStep = () => {
    setCurrentStep('services');
  };

  const handleBackStep = () => {
    setCurrentStep('customer_data');
  };

  return (
    <ServiceOrderInfosContainer style={{ display: hide ? 'none' : 'flex' }}>
      <InputsContainer>
        <SelectContainer>
          <Label>Origem do carro:</Label>
          <Select
            height="34px"
            backgroundColor="#424242"
            color="White"
            name="sourceCar"
            placeholder="Origem do carro"
            onChange={validateForm}
            containerProps={{
              marginRight: 8,
              width: '100%',
              height: '37px',
              border: '2px solid',
              borderColor: '#585858',
              backgroundColor: '#424242',
            }}
          >
            {sourceCarSelectOption.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </SelectContainer>

        <SelectContainer>
          <Label htmlFor="unitId">Unidade:</Label>

          <Select
            height="34px"
            backgroundColor="#424242"
            color="White"
            name="unitId"
            id="unitId"
            placeholder="Selecione a unidade"
            onChange={validateForm}
            containerProps={{
              marginRight: 8,
              width: '100%',
              height: '37px',
              border: '2px solid',
              borderColor: '#585858',
              backgroundColor: '#424242',
            }}
          >
            {unitSelectOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </SelectContainer>

        <InputContainer>
          <Label htmlFor="osNumber">Código da OS:</Label>

          <Input
            className="input"
            id="osNumber"
            type="number"
            name="osNumber"
            onKeyUp={validateForm}
          />
        </InputContainer>

        <DateTimeContainer>
          <Label>Data e Hora de disponibilidade:</Label>
          <Datetime name="availabilityDate" onChange={validateForm} />
        </DateTimeContainer>

        <DateTimeContainer>
          <Label>Data e Hora de entrega:</Label>
          <Datetime name="deliveryDate" onChange={validateForm} />
        </DateTimeContainer>

        <TextareaContainer>
          <Label htmlFor="comments">Observações:</Label>

          <Textarea
            name="comments"
            onKeyUp={validateForm}
            style={{ width: '100%' }}
          />
        </TextareaContainer>
      </InputsContainer>

      <ButtonsContainer>
        <Button isDisabled={false} onClick={handleBackStep} skipButton>
          Voltar
          {/* {loadingButton ? <Spinner color="#282828" /> : 'Salvar'} */}
        </Button>

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
    </ServiceOrderInfosContainer>
  );
};

export default ServiceOrderInfoForm;
