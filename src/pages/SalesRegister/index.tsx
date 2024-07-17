import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import SetSaleReferral, {
  IReferralData,
} from '../../components/Modals/SetSaleReferral';
import { useAuth } from '../../context/auth';
import { useToast } from '../../context/toast';
import api from '../../services/api';
import getValidationsErrors from '../../utils/getValidationError';
import {
  Container,
  Content,
  StyledForm,
  FormStepsContainer,
  FormStep,
  FormStepTitle,
  FormStepNumberTitle,
} from './styles';
import CustomerInfoStepForm from './components/CustomerInfoStepForm/index';
import ServiceOrderInfoForm from './components/ServiceOrderInfoForm';
import ServicesStepForm from './components/ServicesStepForm';
import OrderSummary from './components/OrderSummary';

export interface IUnit {
  id: string;
  name: string;
}

export interface ICompanyServices {
  id: string;
  price: number;
  company_price: number;
  name: string;
  description: string;
  service: {
    id: string;
    price: number;
    enabled: boolean;
  };
}

export interface ISalePayload {
  car: string;
  carModel: string;
  carPlate: string;
  carColor: string;
  comments?: string | undefined;
  unitId: string;
  deliveryDate: string;
  availabilityDate: string;
  companyPrice: any;
  costPrice: any;
  source: string;
  name: string;
  cpf: string;
}

export interface IFormData {
  unitId: string;
  car: string;
  carColor: string;
  carModel: string;
  carPlate: string;
  osNumber: string;
  cpf: string;
  sourceCar: string;
  availabilityDate: string;
  deliveryDate: string;
  name: string;
  comments?: string;
}

export type Step =
  | 'customer_data'
  | 'service_info'
  | 'services'
  | 'confirmation';

const SalesRegister = () => {
  const history = useHistory();
  const { user } = useAuth();
  const { addToast } = useToast();

  const formRef = useRef<FormHandles>(null);

  const [document, setDocument] = useState('');
  const [currentStep, setCurrentStep] = useState<Step>('customer_data');
  const [loadingButton, setLoadingButton] = useState(false);
  const [validatedForms, setValidatedForms] = useState<
    { [K in Step]: boolean }
  >({
    customer_data: false,
    service_info: false,
    services: false,
    confirmation: false,
  });
  const [saleCommissionerModalOpened, setSaleReferralModalOpened] = useState(
    false,
  );
  const [salePayload, setSalePayload] = useState<ISalePayload>(
    {} as ISalePayload,
  );
  const [refferedSale] = useState(false);

  const [companyServices, setCompanyServices] = useState<ICompanyServices[]>(
    [],
  );
  const [selectedServices, setSelectedServices] = useState<
    {
      value: string;
      label: string;
      companyPrice: number;
      customerPrice: number;
    }[]
  >([]);

  const sourceCarSelectOption: Array<{ value: string; label: string }> = [
    { value: 'NEW', label: '0 KM' },
    { value: 'USED', label: 'Seminovo' },
    { value: 'WORKSHOP', label: 'Oficina' },
  ];

  const [unitSelectOptions, setUnitSelectOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);

  useEffect(() => {
    api
      .get(`services/${user?.profile.company_id}`, {
        params: { showDisabled: false },
      })
      .then(response => {
        const responseServices: ICompanyServices[] = response.data;

        setCompanyServices(
          responseServices.filter(service => !!service.company_price),
        );
      });

    api
      .get(`units/${user?.profile.company_id}`)
      .then(response => {
        const unities: IUnit[] = response.data;

        const unitiesOptions: Array<{
          value: string;
          label: string;
        }> = unities.map(unit => ({ value: unit.id, label: unit.name }));

        setUnitSelectOptions(unitiesOptions);
      })
      .catch(() => {
        history.push('/services');
      });
  }, [history, user]);

  const handleSubmitByReferral = useCallback(
    async (commissionerData: IReferralData) => {
      setLoadingButton(true);

      try {
        const formattedServices = selectedServices.map(
          service => service.value,
        );

        const responseCreatedSale = await api.post('sales', salePayload);

        const createServiceSaleData = {
          saleId: responseCreatedSale.data.id,
          serviceIds: formattedServices,
          isReferred: true,
          referral_data: commissionerData,
        };

        await api.post('service-sales', createServiceSaleData);

        addToast({
          title: 'Sucesso',
          type: 'success',
          description: 'Pedido registrado com sucesso.',
        });
        setLoadingButton(false);
        setSelectedServices([]);

        formRef.current?.reset();
        setDocument('');
      } catch (err) {
        addToast({
          title: 'Erro',
          description:
            'Não foi possível registrar essa venda, tente novamente.',
          type: 'error',
        });

        setLoadingButton(false);
      }
    },
    [addToast, salePayload, selectedServices],
  );

  const handleSubmit = useCallback(
    async (data: IFormData, { reset }) => {
      setLoadingButton(true);

      const formattedServices = selectedServices.map(service => service.value);

      const responseCompanyBudget = await api.post(
        '/sales/company-sale-budget',
        { services: formattedServices },
      );

      const { companyPrice } = responseCompanyBudget.data;

      const responseCostBudget = await api.post('/sales/sale-budget', {
        services: formattedServices,
      });

      const { costPrice } = responseCostBudget.data;

      try {
        formRef.current?.setErrors({});

        const cpfWithoutPoint = data.cpf.replace('.', '');

        const formattedCpf = cpfWithoutPoint.replace('.', '').replace('-', '');

        const schema = Yup.object().shape({
          unitId: Yup.string().required('Por favor selecione a unidade.'),
          car: Yup.string().required('Carro obrigatório'),
          carColor: Yup.string().required('Cor do carro obrigatório'),
          carModel: Yup.string().required('Modelo do carro obrigatório'),
          carPlate: Yup.string()
            .required('Chassi do carro obrigatório')
            .length(7, 'O Chassi deve ter 7 dígitos'),
          osNumber: Yup.string().required('Código da OS obrigatório'),
          cpf: Yup.string()
            .required('Cpf obrigatório')
            .matches(
              /^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}-?[0-9]{2}|[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}-?[0-9]{2})$/,
              'O documento deve ter 11 ou 14 dígitos.',
            ),
          name: Yup.string().required('Nome obrigatório'),
          sourceCar: Yup.string().required('Origem do carro obrigatório'),
          deliveryDate: Yup.string().required('Data de entrega obrigatória'),
          comments: Yup.string(),
          availabilityDate: Yup.string().required(
            'Data de disponibilidade obrigatória',
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        if (selectedServices.length <= 0) {
          addToast({ title: 'Nenhum serviço selecionado.', type: 'error' });
          throw new Error('Services are required.');
        }

        const createSaleData = {
          unitId: data.unitId,
          deliveryDate: new Date(data.deliveryDate).toISOString(),
          availabilityDate: new Date(data.availabilityDate).toISOString(),
          companyPrice,
          partner_external_id: data.osNumber,
          costPrice,
          source: data.sourceCar,
          name: data.name,
          cpf: formattedCpf,
          ...(data?.comments && {
            comments: data?.comments?.replace(/(\r\n|\n|\r)/gm, ' '),
          }),
          car: data.car,
          carModel: data.carModel,
          carPlate: data.carPlate,
          carColor: data.carColor,
        };

        if (refferedSale) {
          setSalePayload(createSaleData);
          setSaleReferralModalOpened(true);
          setLoadingButton(false);

          return;
        }

        const responseCreatedSale = await api.post('sales', createSaleData);

        const createServiceSaleData = {
          saleId: responseCreatedSale.data.id,
          serviceIds: formattedServices,
          isReferred: false,
        };

        await api.post('service-sales', createServiceSaleData);

        addToast({
          title: 'Sucesso',
          type: 'success',
          description: 'Pedido registrado com sucesso.',
        });
        setLoadingButton(false);
        setSelectedServices([]);

        setValidatedForms({
          customer_data: false,
          service_info: false,
          services: false,
          confirmation: false,
        });
        setCurrentStep('customer_data');
        reset();
        setDocument('');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          if (selectedServices.length <= 0) {
            addToast({ title: 'Nenhum serviço selecionado.', type: 'error' });
          }

          const errors = getValidationsErrors(err);

          formRef.current?.setErrors(errors);
          setLoadingButton(false);
          return;
        }

        addToast({
          title: 'Erro',
          description:
            'Não foi possível registrar essa venda, tente novamente.',
          type: 'error',
        });
        setLoadingButton(false);
      }
    },
    [addToast, selectedServices, refferedSale],
  );

  const checkIsSameStep = useCallback(
    (step: Step) => {
      return step === currentStep;
    },
    [currentStep],
  );

  return (
    <Container>
      <Content>
        <FormStepsContainer>
          <FormStep
            active={checkIsSameStep('customer_data')}
            onClick={() => {
              setCurrentStep('customer_data');
            }}
          >
            <FormStepNumberTitle>1</FormStepNumberTitle>
            <FormStepTitle>Dados do cliente</FormStepTitle>
          </FormStep>
          <FormStep
            active={checkIsSameStep('service_info')}
            onClick={() => {
              setCurrentStep('service_info');
            }}
            disabled={!validatedForms.customer_data}
          >
            <FormStepNumberTitle>2</FormStepNumberTitle>
            <FormStepTitle>Dados da OS</FormStepTitle>
          </FormStep>
          <FormStep
            active={checkIsSameStep('services')}
            onClick={() => {
              setCurrentStep('services');
            }}
            disabled={
              !validatedForms.service_info || !validatedForms.customer_data
            }
          >
            <FormStepNumberTitle>3</FormStepNumberTitle>
            <FormStepTitle>Serviços</FormStepTitle>
          </FormStep>
          <FormStep
            active={checkIsSameStep('confirmation')}
            onClick={() => {
              setCurrentStep('confirmation');
            }}
            disabled={
              !validatedForms.service_info ||
              !validatedForms.customer_data ||
              !validatedForms.services
            }
          >
            <FormStepNumberTitle>4</FormStepNumberTitle>
            <FormStepTitle>Confirmaçāo</FormStepTitle>
          </FormStep>
        </FormStepsContainer>

        <StyledForm ref={formRef} onSubmit={handleSubmit}>
          <CustomerInfoStepForm
            formRef={formRef}
            document={document}
            setCurrentStep={setCurrentStep}
            setValidatedForms={setValidatedForms}
            setDocument={setDocument}
            hide={!checkIsSameStep('customer_data')}
          />

          <ServiceOrderInfoForm
            formRef={formRef}
            sourceCarSelectOption={sourceCarSelectOption}
            unitSelectOptions={unitSelectOptions}
            hide={!checkIsSameStep('service_info')}
            setCurrentStep={setCurrentStep}
            setValidatedForms={setValidatedForms}
          />

          <ServicesStepForm
            selectedServices={selectedServices}
            setSelectedServices={setSelectedServices}
            companyServices={companyServices}
            hide={!checkIsSameStep('services')}
            setCurrentStep={setCurrentStep}
            setValidatedForms={setValidatedForms}
          />

          <OrderSummary
            hide={!checkIsSameStep('confirmation')}
            sourceCarSelectOption={sourceCarSelectOption}
            formRef={formRef}
            unitSelectOptions={unitSelectOptions}
            selectedServices={selectedServices}
            setCurrentStep={setCurrentStep}
            loadingButton={loadingButton}
          />
        </StyledForm>
      </Content>

      <SetSaleReferral
        isOpen={!!saleCommissionerModalOpened}
        onClose={() => setSaleReferralModalOpened(false)}
        selectedServices={selectedServices}
        handleSubmitByReferral={handleSubmitByReferral}
        companyId={user.profile.company_id}
      />
    </Container>
  );
};

export default SalesRegister;
