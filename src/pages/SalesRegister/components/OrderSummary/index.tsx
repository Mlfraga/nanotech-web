import React, { useMemo } from 'react';
import {
  ButtonsContainer,
  OrderSummaryContainer,
  Heading,
  TitleContainer,
  OrderSummaryContent,
  OrderHeader,
  HeaderInfo,
  HeaderKey,
  HeaderInfoValue,
  OrderServicesSection,
  SericesDetails,
  OrderSummaryTitle,
  OrderSummarySubtitle,
  ServiceItem,
  ServiceName,
  ServicePrice,
  ServiceTotalLabel,
  ServiceTotalContainer,
  Content,
  HeaderInfoRow,
} from './styles';
import { Image } from '@chakra-ui/core';
import Button from '../../../../components/Button';
import { FormHandles } from '@unform/core';
import Logo from '../../../../assets/undraw_approve_qwp7.svg';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Step } from '../..';

interface IOrderSummaryProps {
  sourceCarSelectOption: { value: string; label: string }[];
  hide: boolean;
  formRef: React.RefObject<FormHandles>;
  selectedServices: {
    value: string;
    label: string;
    companyPrice: number;
    customerPrice: number;
  }[];
  unitSelectOptions: { value: string; label: string }[];
  setCurrentStep: React.Dispatch<React.SetStateAction<Step>>;
  loadingButton: boolean;
}

const OrderSummary: React.FC<IOrderSummaryProps> = ({
  hide,
  formRef,
  selectedServices,
  sourceCarSelectOption,
  setCurrentStep,
  unitSelectOptions,
  loadingButton,
}) => {
  const formData = formRef.current?.getData() as {
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

  const handleBackStep = () => {
    setCurrentStep('services');
  };

  const saleTotalValue = useMemo(() => {
    const serviceValues = selectedServices.map(service =>
      Number(service.companyPrice),
    );

    return serviceValues.reduce((accumulator, serviceValue) => {
      return accumulator + Number(serviceValue);
    }, 0);
  }, [selectedServices]);

  return (
    <OrderSummaryContainer style={{ display: hide ? 'none' : 'flex' }}>
      <Heading>
        <TitleContainer>
          <OrderSummaryTitle>Resumo do pedido</OrderSummaryTitle>
          <OrderSummarySubtitle>
            Revise as informações do pedido e confirme!
          </OrderSummarySubtitle>
        </TitleContainer>
      </Heading>

      <Content>
        {formData && (
          <OrderSummaryContent>
            <OrderHeader>
              <HeaderInfo>
                <HeaderKey> Cliente: </HeaderKey>
                <HeaderInfoValue>{formData.name}</HeaderInfoValue>
              </HeaderInfo>

              <HeaderInfo>
                <HeaderKey> Carro: </HeaderKey>
                <HeaderInfoValue>
                  {`${formData?.car} ${formData?.carModel} ${formData?.carColor} - ${formData?.carPlate}`}
                </HeaderInfoValue>
              </HeaderInfo>

              <HeaderInfo>
                <HeaderKey> Origem: </HeaderKey>
                <HeaderInfoValue>
                  {
                    sourceCarSelectOption.find(
                      x => x.value === formData.sourceCar,
                    )?.label
                  }
                </HeaderInfoValue>
              </HeaderInfo>

              <HeaderInfo>
                <HeaderKey> Unidade: </HeaderKey>
                <HeaderInfoValue>
                  {
                    unitSelectOptions.find(
                      unit => unit.value === formData?.unitId,
                    )?.label
                  }
                </HeaderInfoValue>
              </HeaderInfo>

              <HeaderInfo>
                <HeaderKey> Os: </HeaderKey>
                <HeaderInfoValue>{formData?.osNumber}</HeaderInfoValue>
              </HeaderInfo>

              <HeaderInfoRow>
                <HeaderInfo>
                  <HeaderKey> Disponibilidade: </HeaderKey>
                  <HeaderInfoValue>
                    {formData?.availabilityDate
                      ? format(
                          new Date(formData?.availabilityDate),
                          "dd'/'MM'/'yyyy '-' HH:mm'h'",
                          { locale: ptBR },
                        )
                      : ' 12/01/2024'}
                  </HeaderInfoValue>
                </HeaderInfo>

                <HeaderInfo>
                  <HeaderKey> Entrega: </HeaderKey>
                  <HeaderInfoValue>
                    {formData?.deliveryDate
                      ? format(
                          new Date(formData?.deliveryDate),
                          "dd'/'MM'/'yyyy '-' HH:mm'h'",
                          { locale: ptBR },
                        )
                      : '12/01/2024'}
                  </HeaderInfoValue>
                </HeaderInfo>
              </HeaderInfoRow>
            </OrderHeader>

            <OrderServicesSection>
              <SericesDetails>
                {selectedServices.map(service => (
                  <ServiceItem key={service.value}>
                    <ServiceName>{service.label}</ServiceName>
                    <ServicePrice>
                      {Number(service.companyPrice).toLocaleString('pt-br', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </ServicePrice>
                  </ServiceItem>
                ))}

                <ServiceTotalContainer>
                  <ServiceTotalLabel>Total</ServiceTotalLabel>
                  <ServicePrice>
                    <b>
                      {Number(saleTotalValue).toLocaleString('pt-br', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </b>
                  </ServicePrice>
                </ServiceTotalContainer>
              </SericesDetails>
            </OrderServicesSection>
          </OrderSummaryContent>
        )}

        <Image width={40} src={Logo}></Image>
      </Content>

      <ButtonsContainer>
        <Button isDisabled={false} onClick={handleBackStep} skipButton>
          Voltar
        </Button>

        <Button
          padding={'0.6rem'}
          height={'auto'}
          isDisabled={loadingButton}
          type="submit"
        >
          Confirmar
        </Button>
      </ButtonsContainer>
    </OrderSummaryContainer>
  );
};

export default OrderSummary;
