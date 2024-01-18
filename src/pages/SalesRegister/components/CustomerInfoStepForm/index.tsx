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

const CustomerInfoStepForm: React.FC<{
  document: string;
  hide: boolean;
  setDocument: React.Dispatch<React.SetStateAction<string>>;
}> = ({ document, setDocument, hide }) => {
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
            style={{ width: '30px' }}
          />
        </InputContainer>
        <InputContainer>
          <Label>Cpf:</Label>
          <Input
            className="input"
            id="cpf"
            type="cpf"
            name="cpf"
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
            style={{ width: '30px' }}
          />
        </InputContainer>
      </InputsContainer>

      <ButtonsContainer>
        {/* <Button isDisabled={false} skipButton>
          Cancelar
          {loadingButton ? <Spinner color="#282828" /> : 'Salvar'}
        </Button> */}

        <Button padding={'0.6rem'} height={'auto'} isDisabled={false}>
          Próximo
          {/* {loadingButton ? <Spinner color="#282828" /> : 'Salvar'} */}
        </Button>
      </ButtonsContainer>
    </CustomerInfosContainer>
  );
};

export default CustomerInfoStepForm;
