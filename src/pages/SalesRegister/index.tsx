import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useHistory } from 'react-router-dom';

import { Box, Spinner, Tooltip } from '@chakra-ui/core';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import Breadcrumb from '../../components/Breadcrumb';
import Button from '../../components/Button';
import Datetime from '../../components/Datetime';
import Input from '../../components/Input';
import SetSaleReferral, {
  IReferralData,
} from '../../components/Modals/SetSaleReferral';
import Select from '../../components/Select';
import Textarea from '../../components/Textarea';
import { useAuth } from '../../context/auth';
import { useToast } from '../../context/toast';
import api from '../../services/api';
import getValidationsErrors from '../../utils/getValidationError';
import { documentMask } from '../../utils/masks';
import {
  CompanyInfosContainer,
  Container,
  Content,
  DateTimeContainer,
  StyledForm,
  FormSectionTitle,
  InputContainer,
  InputsContainer,
  Label,
  SelectContainer,
  ServiceBox,
  Services,
  FormStepsContainer,
  FormStep,
  FormStepTitle,
  FormStepNumberTitle,
} from './styles';
import CustomerInfoStepForm from './components/CustomerInfoStepForm/index';

export interface IUnit {
  id: string;
  name: string;
}

interface ICompanyServices {
  id: string;
  price: number;
  company_price: number;
  name: string;
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

interface IFormData {
  unitId: string;
  car: string;
  carColor: string;
  carModel: string;
  carPlate: string;
  cpf: string;
  sourceCar: string;
  availabilityDate: string;
  deliveryDate: string;
  name: string;
  comments?: string;
}

type Step = 'customer_data' | 'service_info' | 'services' | 'confirmation';

const StepComponents: {
  [K in Step]: React.ComponentType<any>;
} = {
  customer_data: CustomerInfoStepForm,
  service_info: CompanyInfosContainer,
  services: CompanyInfosContainer,
  confirmation: CompanyInfosContainer,
};

const SalesRegister = () => {
  const history = useHistory();
  const { user } = useAuth();
  const { addToast } = useToast();

  const formRef = useRef<FormHandles>(null);

  const [document, setDocument] = useState('');
  const [currentStep, setCurrentStep] = useState<Step>('customer_data');
  const [loadingButton, setLoadingButton] = useState(false);
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
    { value: string; label: string }[]
  >([]);

  const selectOptions: Array<{ value: string; label: string }> = [
    { value: 'NEW', label: '0 KM' },
    { value: 'USED', label: 'Semi-novo' },
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

  const StepComponent = StepComponents[currentStep];

  return (
    <Container>
      <Breadcrumb text="Registro de vendas" />
      <Content>
        <FormStepsContainer>
          <FormStep active={checkIsSameStep('customer_data')}>
            <FormStepNumberTitle>1</FormStepNumberTitle>
            <FormStepTitle>Dados do cliente</FormStepTitle>
          </FormStep>
          <FormStep active={checkIsSameStep('service_info')}>
            <FormStepNumberTitle>2</FormStepNumberTitle>
            <FormStepTitle>Dados da OS</FormStepTitle>
          </FormStep>
          <FormStep active={checkIsSameStep('services')}>
            <FormStepNumberTitle>3</FormStepNumberTitle>
            <FormStepTitle>Serviços</FormStepTitle>
          </FormStep>
          <FormStep active={checkIsSameStep('confirmation')}>
            <FormStepNumberTitle>4</FormStepNumberTitle>
            <FormStepTitle>Confirmaçāo</FormStepTitle>
          </FormStep>
        </FormStepsContainer>

        <StyledForm ref={formRef} onSubmit={handleSubmit}>
          <StepComponent />
          {/* <CompanyInfosContainer>
            <FormSectionTitle>Informaçōes da OS</FormSectionTitle>

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
                  {selectOptions.map(opt => (
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
          </CompanyInfosContainer>

          <CompanyInfosContainer>
            <FormSectionTitle>Serviços</FormSectionTitle>

            <Services
              templateColumns={{
                xs: '29% 29% 29%',
                sm: '23% 23% 23% 23%',
                md: '17% 17% 17% 17% 17%',
                lg: '18% 18% 18% 18% 18%',
                xl: '15.6% 15.6% 15.6% 15.6% 15.6% 15.6%',
              }}
            >
              {companyServices.map(companyService => (
                <Tooltip
                  key={companyService.id}
                  label={String(
                    Number(companyService.company_price).toLocaleString(
                      'pt-br',
                      {
                        style: 'currency',
                        currency: 'BRL',
                      },
                    ),
                  )}
                  aria-label={String(
                    Number(companyService.company_price).toLocaleString(
                      'pt-br',
                      {
                        style: 'currency',
                        currency: 'BRL',
                      },
                    ),
                  )}
                >
                  <ServiceBox
                    onClick={() => handleSelectService(companyService)}
                    className={
                      selectedServices
                        .map(s => s.value)
                        .includes(companyService.id)
                        ? 'selected'
                        : ''
                    }
                  >
                    <span>{companyService.name}</span>
                  </ServiceBox>
                </Tooltip>
              ))}
            </Services>
          </CompanyInfosContainer>

          <Box flex={1} fontSize="18px" marginRight="18px">
            <span style={{ marginBottom: '6px' }}>Observações:</span>
            <Textarea name="comments" style={{ marginTop: '16px' }} />
          </Box>

          <div className="buttons_container">
            <Button isDisabled={!!loadingButton} type="submit" mt={0}>
              {loadingButton ? <Spinner color="#282828" /> : 'Salvar'}
            </Button>
          </div> */}
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
