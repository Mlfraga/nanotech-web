import React from 'react';
import {
  ButtonsContainer,
  ServiceOrderInfosContainer,
  DateTimeContainer,
  InputContainer,
  InputsContainer,
  Label,
  SelectContainer,
} from './styles';
import Input from '../../../../components/Input';
import Button from '../../../../components/Button';
import Select from '../../../../components/Select';
import Datetime from '../../../../components/Datetime';

const ServiceOrderInfoForm: React.FC<{
  sourceCarSelectOption: { value: string; label: string }[];
  hide: boolean;
  unitSelectOptions: { value: string; label: string }[];
}> = ({ sourceCarSelectOption, unitSelectOptions, hide }) => {
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
          <Label htmlFor="unitId">Unidade</Label>

          <Select
            height="34px"
            backgroundColor="#424242"
            color="White"
            name="unitId"
            id="unitId"
            placeholder="Selecione a unidade"
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
            type="osNumber"
            name="osNumber"
          />
        </InputContainer>

        <DateTimeContainer>
          <Label>Data e hora de disponibilidade:</Label>
          <Datetime name="availabilityDate" />
        </DateTimeContainer>

        <DateTimeContainer>
          <Label>Data e hora de entrega:</Label>
          <Datetime name="deliveryDate" />
        </DateTimeContainer>
      </InputsContainer>

      <ButtonsContainer>
        <Button isDisabled={false} skipButton>
          Voltar
          {/* {loadingButton ? <Spinner color="#282828" /> : 'Salvar'} */}
        </Button>

        <Button padding={'0.6rem'} height={'auto'} isDisabled={false}>
          Próximo
          {/* {loadingButton ? <Spinner color="#282828" /> : 'Salvar'} */}
        </Button>
      </ButtonsContainer>
    </ServiceOrderInfosContainer>
  );
};

export default ServiceOrderInfoForm;
