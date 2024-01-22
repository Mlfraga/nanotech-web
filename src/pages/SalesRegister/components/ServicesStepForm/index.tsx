import React, { useCallback, useMemo, useState } from 'react';
import {
  ButtonsContainer,
  SearchContainer,
  SelectServicesSubtitle,
  SelectServicesTitle,
  ServiceBox,
  ServiceDescription,
  ServiceDescriptionContainer,
  ServicePrice,
  ServicePriceContainer,
  ServiceTitle,
  Services,
  ServicesContainer,
  ServicesHeading,
  TitleContainer,
} from './styles';
import Button from '../../../../components/Button';
import { Tooltip } from '@chakra-ui/core';
import { ICompanyServices, Step } from '../..';
import Input from '../../../../components/Input';

interface IServicesStepFormProps {
  companyServices: ICompanyServices[];
  selectedServices: { value: string; label: string }[];
  setSelectedServices: React.Dispatch<{ value: string; label: string }[]>;
  hide: boolean;
  setCurrentStep: React.Dispatch<React.SetStateAction<Step>>;
  setValidatedForms: React.Dispatch<
    React.SetStateAction<{ [K in Step]: boolean }>
  >;
}

const ServicesStepForm: React.FC<IServicesStepFormProps> = ({
  companyServices,
  selectedServices,
  setSelectedServices,
  hide,
  setCurrentStep,
  setValidatedForms,
}) => {
  const [searchName, setSearchName] = useState('');

  const handleChangeSearchName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchName(event.target.value);
    },
    [],
  );

  const handleSelectService = useCallback(
    (companyService: ICompanyServices) => {
      const alreadySelected = selectedServices.findIndex(
        item => item.value === companyService.id,
      );

      if (alreadySelected >= 0) {
        const filteredItems = selectedServices.filter(
          item => item.value !== companyService.id,
        );

        setSelectedServices(filteredItems);
      } else {
        setSelectedServices([
          ...selectedServices,
          { value: companyService.id, label: companyService.name },
        ]);
      }
    },
    [selectedServices],
  );

  const filteredServices = useMemo(() => {
    return companyServices.filter(companyService => {
      return companyService.name
        .toLowerCase()
        .includes(searchName.toLowerCase());
    });
  }, [companyServices, searchName]);

  return (
    <ServicesContainer style={{ display: hide ? 'none' : 'flex' }}>
      <ServicesHeading>
        <TitleContainer>
          <SelectServicesTitle>Selecione os serviços</SelectServicesTitle>
          <SelectServicesSubtitle>
            Escolha os serviços solicitados pelo cliente, você pode filtrar os
            serviços pelo nome.
          </SelectServicesSubtitle>
        </TitleContainer>

        <SearchContainer>
          <Input
            containerProps={{
              height: 'auto',
              padding: '8px 16px',
              border: '2px solid',
              borderColor: '#585858',
              color: '#fff',
              backgroundColor: '#424242',
            }}
            onChange={handleChangeSearchName}
            placeholder="Pesquisar serviços"
            name="searchServices"
          />
        </SearchContainer>
      </ServicesHeading>

      <Services>
        {filteredServices.map(companyService => (
          <>
            <ServiceBox
              onClick={() => handleSelectService(companyService)}
              className={
                selectedServices.map(s => s.value).includes(companyService.id)
                  ? 'selected'
                  : ''
              }
            >
              <ServiceDescriptionContainer>
                <ServiceTitle>{companyService.name}</ServiceTitle>

                {companyService?.description && (
                  <ServiceDescription>
                    {companyService?.description}
                  </ServiceDescription>
                )}
              </ServiceDescriptionContainer>

              <ServicePriceContainer>
                <Tooltip
                  hasArrow
                  placement="top"
                  aria-label="Preço da concessionária"
                  label="Preço da concessionária"
                >
                  <ServicePrice>
                    {String(
                      Number(companyService.company_price).toLocaleString(
                        'pt-br',
                        {
                          style: 'currency',
                          currency: 'BRL',
                        },
                      ),
                    )}
                  </ServicePrice>
                </Tooltip>
              </ServicePriceContainer>
            </ServiceBox>
          </>
        ))}
      </Services>

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
    </ServicesContainer>
  );
};

export default ServicesStepForm;
