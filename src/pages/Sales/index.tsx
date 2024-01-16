import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FaArrowAltCircleDown, FaArrowAltCircleUp } from 'react-icons/fa';
import {
  FiEdit3,
  FiFilter,
  FiNavigation,
  FiSave,
  FiSettings,
  FiTrash,
  FiUsers,
} from 'react-icons/fi';

import {
  Box as ChakraBox,
  Button as ChakraButton,
  Flex as ChakraFlex,
  Flex,
  Skeleton,
  Stack,
  Text,
  Tooltip,
} from '@chakra-ui/core';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { AxiosResponse } from 'axios';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import Breadcrumb from '../../components/Breadcrumb';
import AlertDialog from '../../components/Dialogs/Alert';
import Menu from '../../components/Menu';
import IndicateServiceProvider from '../../components/Modals/IndicateServiceProvider';
import UpdateSalesModal from '../../components/Modals/UpdateSales';
import Pagination from '../../components/Pagination';
import Select from '../../components/Select';
import { useAuth } from '../../context/auth';
import { useToast } from '../../context/toast';
import { ICompany } from '../../interfaces/companies';
import { ISelectOptions } from '../../interfaces/select';
import { IServiceProvider } from '../../interfaces/service_provider';
import { IUser } from '../../interfaces/users';
import api from '../../services/api';
import formatMoney from '../../utils/formatMoney';
import getSaleStatusTranslated from '../../utils/getSaleStatusTranslated';
import SaleStatus from '../ProviderSales/components/SaleStatus';
import FilterDrawer from './components/FilterDrawer';
import WhatsappNumbersDrawer from './components/WhatsappNumbersDrawer';
import {
  ActionButttonsContainer,
  Box,
  Container,
  Content,
  List,
  Separator,
} from './styles';

interface ISaleRequestResponseData {
  id: string;
  client_identifier: string;
  availability_date: string;
  delivery_date: string;
  status: string;
  production_status: string;
  hasAlreadyBeenDirected: boolean;
  company_value: number;
  cost_value: number;
  comments: string;
  source: string;
  unit: {
    id: string;
    client_identifier: string;
    name: string;
  };
  seller: {
    name: string;
    company: {
      id: string;
      client_identifier: string;
    };
  };
  person: {
    name: string;
  };
  car: {
    brand: string;
    plate: string;
    color: string;
    model: string;
  };
  services_sales: Array<{
    id: string;
    company_value: number;
    cost_value: number;
    service: {
      id: string;
      name: string;
      price: number;
    };
  }>;
  request_date: string;
}

export interface IFilterSalesParams {
  startDeliveryDate?: Date;
  endDeliveryDate?: Date;
  startAvailabilityDate?: Date;
  endAvailabilityDate?: Date;
  startFinishedDate?: Date;
  endFinishedDate?: Date;
  status?: string;
  sellerId?: string;
  companyId?: string;
  plate?: string;
}

const Sales = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const formRef = useRef<FormHandles>(null);
  const searchFormRef = useRef<FormHandles>(null);

  const [sales, setSales] = useState<ISaleRequestResponseData[]>([]);
  const [openedServices, setOpenedServices] = useState<string[]>([]);
  const [selectedSales, setSelectedSales] = useState<string[]>([]);
  const [sellersOptions, setSellersOptions] = useState<ISelectOptions[]>([]);
  const [companiesOptions, setCompaniesOptions] = useState<ISelectOptions[]>(
    [],
  );

  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [saleToLinkProviders, setSaleToLinkProviders] = useState<string | null>(
    null,
  );

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const [filters, setFilters] = useState<IFilterSalesParams>(
    {} as IFilterSalesParams,
  );
  const [loading, setLoading] = useState<boolean>(false);

  const [
    whatsappNumbersDrawerOpened,
    setWhatsappNumbersDrawerOpened,
  ] = useState<boolean>(false);
  const [filterDrawerOpened, setFilterDrawerOpened] = useState<boolean>(false);
  const [deleteDialogOpened, setDeleteDialogOpened] = useState<boolean>(false);
  const [openEditSalesModal, setOpenEditSalesModal] = useState<boolean>(false);
  const [
    openLinkServiceProviderToSalesModal,
    setOpenLinkServiceProviderToSalesModal,
  ] = useState<boolean>(false);
  const [saleToEdit, setSaleToEdit] = useState<
    ISaleRequestResponseData | undefined
  >({} as ISaleRequestResponseData);
  const [serviceProviders, setServiceProviders] = useState<IServiceProvider[]>(
    [],
  );
  const [
    selectedProviderServiceSales,
    setSelectedProviderServiceSales,
  ] = useState<{
    serviceProviders: IServiceProvider[];
    techinical_comments: string;
    date_to_be_done?: Date;
  }>({
    serviceProviders: [],
    techinical_comments: '',
    date_to_be_done: undefined,
  });

  const loadSales = useCallback(async () => {
    setLoading(true);

    const res = await api.get('sales', {
      params: {
        page: currentPage,
        ...(filters?.startDeliveryDate && {
          startDeliveryDate: filters?.startDeliveryDate,
        }),
        ...(filters?.endDeliveryDate && {
          endDeliveryDate: filters?.endDeliveryDate,
        }),
        ...(filters?.startAvailabilityDate && {
          startAvailabilityDate: filters?.startAvailabilityDate,
        }),
        ...(filters?.endAvailabilityDate && {
          endAvailabilityDate: filters?.endAvailabilityDate,
        }),
        ...(filters?.startFinishedDate && {
          startFinishedDate: filters?.startFinishedDate,
        }),
        ...(filters?.endFinishedDate && {
          endFinishedDate: filters?.endFinishedDate,
        }),
        ...(filters?.status && { status: filters?.status }),
        ...(filters?.sellerId && { sellerId: filters?.sellerId }),
        ...(filters?.companyId && { companyId: filters?.companyId }),
        ...(filters?.plate && { plate: filters?.plate }),
      },
    });

    setSales(res.data.items);
    setTotalPages(res.data.total_pages);
    setCurrentPage(res.data.current_page);

    setLoading(false);
  }, [currentPage, filters]);

  useEffect(() => {
    setLoading(true);

    api
      .get('sales', {
        params: {
          page: currentPage,
          ...(filters?.startDeliveryDate && {
            startDeliveryDate: filters?.startDeliveryDate,
          }),
          ...(filters?.endDeliveryDate && {
            endDeliveryDate: filters?.endDeliveryDate,
          }),
          ...(filters?.startAvailabilityDate && {
            startAvailabilityDate: filters?.startAvailabilityDate,
          }),
          ...(filters?.endAvailabilityDate && {
            endAvailabilityDate: filters?.endAvailabilityDate,
          }),
          ...(filters?.startFinishedDate && {
            startFinishedDate: filters?.startFinishedDate,
          }),
          ...(filters?.endFinishedDate && {
            endFinishedDate: filters?.endFinishedDate,
          }),
          ...(filters?.status && { status: filters?.status }),
          ...(filters?.sellerId && { sellerId: filters?.sellerId }),
          ...(filters?.plate && { plate: filters?.plate }),
          ...(filters?.companyId && { companyId: filters?.companyId }),
        },
      })
      .then(response => {
        const { data } = response;

        setSales(data?.items);
        setTotalPages(data?.total_pages);
        setLoading(false);
      });
  }, [currentPage, filters]);

  useEffect(() => {
    if (user.role === 'ADMIN' || user.role === 'NANOTECH_REPRESENTATIVE') {
      api
        .get<IUser[]>('/profiles', {
          params: { role: 'SELLER', showDisabled: true },
        })
        .then(response => {
          setSellersOptions(
            response.data.map(seller => ({ id: seller.id, name: seller.name })),
          );
        });

      api.get('companies').then(response => {
        const newCompaniesOptions: ICompany[] = response.data;

        setCompaniesOptions(
          newCompaniesOptions.map(company => ({
            id: company.id,
            name: company.name,
          })),
        );
      });
    }

    if (user.role === 'MANAGER') {
      api.get<IUser[]>('users/company').then(response => {
        setSellersOptions(
          response.data.map(seller => ({ id: seller.id, name: seller.name })),
        );
      });
    }
  }, [user]);

  useEffect(() => {
    api
      .get('/profiles', {
        params: { role: 'SERVICE_PROVIDER', showDisabled: false },
      })
      .then((response: AxiosResponse) => {
        setServiceProviders(response.data);
      });
  }, []);

  const formattedSales = useMemo(
    () =>
      sales?.map(sale => {
        const services: Array<{
          id: string;
          name: string;
          price: string;
        }> = [];

        if (user?.role === 'ADMIN') {
          sale.services_sales.forEach(service => {
            services.push({
              id: service.service.id,
              name: service.service.name,
              price: formatMoney(service.cost_value),
            });

            return services;
          });
        } else {
          sale.services_sales.forEach(service => {
            services.push({
              id: service.service.id,
              name: service.service.name,
              price: formatMoney(service.company_value),
            });
          });
        }

        const formattedSellerName = `${sale.seller.name.split(' ')[0]} ${
          sale.seller.name.split(' ')[1]?.charAt(0) ?? ''
        }`;

        const formattedCar = `${sale.car.brand} ${sale.car.model}`
          .split(' ')
          .filter((item, i, allItems) => i === allItems.indexOf(item));

        return {
          id: sale.id,
          client_id: `${sale.seller.company.client_identifier}${sale.unit.client_identifier}${sale.client_identifier}`,
          seller: formattedSellerName,
          customer: sale.person.name,
          comments: sale.comments,
          car:
            formattedCar.length > 2
              ? `${formattedCar[0]} ${formattedCar[1]} ${formattedCar[2]}`
              : formattedCar.join(' '),
          carPlate: sale.car.plate,
          company_value: sale.company_value,
          cost_value: sale.cost_value,
          source: sale.source,
          hasAlreadyBeenDirected: sale.hasAlreadyBeenDirected,
          availability_date: sale.availability_date,
          delivery_date: sale.delivery_date,
          status: sale.status,
          production_status: sale.production_status,
          services,
          unit: sale.unit.name,
          request_date: sale.request_date,
        };
      }),
    [sales, user],
  );

  const canHandleSales = useMemo(
    () => user?.role === 'ADMIN' || user?.role === 'NANOTECH_REPRESENTATIVE',
    [user],
  );

  const handleOpenServices = useCallback(
    (id: string) => {
      setOpenedServices([...openedServices, id]);
    },
    [openedServices],
  );

  const handleCloseServices = useCallback(
    (id: string) => {
      const newopenedServices = openedServices.filter(
        serviceId => serviceId !== id,
      );

      setOpenedServices(newopenedServices);
    },
    [openedServices],
  );

  const handleSelectSale = useCallback(
    (id: string) => {
      if (selectedSales?.includes(id)) {
        if (selectedSales.length === 1) {
          setSelectedSales([]);

          return;
        }

        const newSelectedSaless = selectedSales.filter(sale => sale !== id);

        setSelectedSales(newSelectedSaless);

        return;
      }

      if (selectedSales) {
        setSelectedSales([...selectedSales, id]);
        return;
      }

      setSelectedSales([id]);
    },
    [selectedSales],
  );

  const handleUpdateSale = useCallback(
    async data => {
      if (selectedSales.length < 1) {
        addToast({
          title: 'Não é possível alterar a situação da venda.',
          description: 'Por favor selecione alguma venda.',
          type: 'error',
        });

        return;
      }

      if (!data.statusSale) {
        addToast({ title: 'Campo de situação da venda vazio.', type: 'error' });
        return;
      }

      const response = await api.patch('sales/status/', {
        status: data.statusSale,
        sales: selectedSales,
      });

      if (response.status === 200) {
        setSelectedSales([]);
        addToast({
          title: 'Sucesso',
          description: 'Situação da venda alterada com sucesso',
          type: 'success',
        });

        const res = await api.get('sales', {
          params: { page: currentPage },
        });

        setSales(res.data.items);
      }
    },
    [addToast, currentPage, selectedSales],
  );

  const handleApplyFilter = useCallback(
    (params: IFilterSalesParams) => {
      if (
        !params.startAvailabilityDate &&
        !params.endAvailabilityDate &&
        !params.status &&
        !params.startDeliveryDate &&
        !params.endDeliveryDate &&
        !params.startFinishedDate &&
        !params.endFinishedDate &&
        !params.sellerId &&
        !params.companyId &&
        !params.plate
      ) {
        addToast({
          title: 'Por favor preencha algum campo para realizar a pesquisa.',
          type: 'error',
        });

        return;
      }

      const newFilters = {
        ...(params.startDeliveryDate && {
          startDeliveryDate: params.startDeliveryDate,
        }),
        ...(params.endDeliveryDate && {
          endDeliveryDate: params.endDeliveryDate,
        }),
        ...(params.startAvailabilityDate && {
          startAvailabilityDate: params.startAvailabilityDate,
        }),
        ...(params.endAvailabilityDate && {
          endAvailabilityDate: params.endAvailabilityDate,
        }),
        ...(params.startFinishedDate && {
          startFinishedDate: params.startFinishedDate,
        }),
        ...(params.plate && {
          plate: params.plate,
        }),
        ...(params.endFinishedDate && {
          endFinishedDate: params.endFinishedDate,
        }),
        ...(params.status && { status: params.status }),
        ...(params.sellerId && { sellerId: params.sellerId }),
        ...(params.companyId && { companyId: params.companyId }),
      };

      setFilters(newFilters);
      setCurrentPage(0);
    },
    [addToast],
  );

  const handleCleanFilter = useCallback(async () => {
    const salesWithoutFilter = await api.get('sales', {
      params: { page: currentPage },
    });

    setTotalPages(salesWithoutFilter.data.total_pages);
    const { items } = salesWithoutFilter.data;

    searchFormRef.current?.reset();

    setSales(items);
    setTotalPages(salesWithoutFilter.data.total_pages);
    setCurrentPage(salesWithoutFilter.data.current_page);

    setFilters({});
  }, [currentPage]);

  const handleDeleteSales = useCallback(async () => {
    setDeleteLoading(true);
    try {
      const response = await api.delete<{
        message: string;
        errors: Array<{ id: string; message: string }>;
      }>('/sales', {
        data: {
          ids: selectedSales,
        },
      });

      response.data.errors.forEach(error => {
        addToast({
          type: 'error',
          title: `Não foi possível excluir a venda n° ${error.id}`,
        });
      });

      const notDeletedSales = response.data.errors.map(err => err.id);

      setSelectedSales(notDeletedSales);

      const res = await api.get('sales', { params: { page: currentPage } });

      setSales(res.data.items);
      setTotalPages(res.data.total_pages);
      setCurrentPage(res.data.current_page);

      addToast({ type: 'success', title: 'Venda(s) excluída(s) com sucesso' });
    } catch (e) {
      addToast({ type: 'error', title: 'Erro' });
    }

    setDeleteLoading(false);
    setDeleteDialogOpened(false);
  }, [selectedSales, addToast, currentPage]);

  const selectedSalesInfo = formattedSales.filter(sale =>
    selectedSales.some((id: string) => id === sale.id),
  );

  return (
    <Flex direction="column" flex={1} w="100%">
      <Breadcrumb
        text="Vendas realizadas"
        filterButton={
          <Flex style={{ gap: '6px' }}>
            {canHandleSales && (
              <Tooltip
                label="Configurar números"
                aria-label="Configurar números"
              >
                <ChakraButton
                  _hover={{
                    bg: '#282828',
                    color: '#fff',
                  }}
                  _focusWithin={{
                    border: 0,
                  }}
                  backgroundColor="#303030"
                  width={12}
                  height={12}
                  borderRadius="50%"
                  onClick={() => setWhatsappNumbersDrawerOpened(true)}
                  isDisabled={deleteLoading}
                >
                  <FiSettings />
                </ChakraButton>
              </Tooltip>
            )}
            <ChakraButton
              _hover={{
                bg: '#5580b9',
                color: '#fff',
              }}
              _focusWithin={{
                border: 0,
              }}
              backgroundColor="#355a9d"
              style={{ padding: 24 }}
              onClick={() => setFilterDrawerOpened(true)}
              isDisabled={deleteLoading}
              leftIcon={FiFilter}
            >
              Filtros
            </ChakraButton>
          </Flex>
        }
      />

      <Content width="100%" mt={4}>
        {canHandleSales && (
          <ChakraBox
            width="100%"
            marginTop="26px"
            paddingBottom="16px"
            className="updateSaleContainer"
            hidden={selectedSales.length < 1}
          >
            <span>Realizar ações em venda(s) selecionada(s)</span>

            <Form
              ref={formRef}
              onSubmit={handleUpdateSale}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <Select
                height={8}
                backgroundColor="#424242"
                color="White"
                name="statusSale"
                containerProps={{
                  marginRight: 8,
                  width: '100%',
                  minWidth: 300,
                  height: 10,
                  border: '2px solid',
                  borderColor: '#585858',
                  backgroundColor: '#424242',
                }}
              >
                <option value="PENDING">Pendente</option>
                <option value="CONFIRMED">Confirmado</option>
                <option value="CANCELED">Cancelado</option>
                <option value="FINISHED">Finalizado</option>
              </Select>

              <ActionButttonsContainer>
                <Tooltip label="Salvar alteração" aria-label="Salvar alteração">
                  <ChakraButton
                    _hover={{
                      bg: '#5580b9',
                      color: '#fff',
                    }}
                    _focusWithin={{
                      border: 0,
                    }}
                    backgroundColor="#355a9d"
                    style={{ padding: 12 }}
                    type="submit"
                  >
                    <FiSave />
                  </ChakraButton>
                </Tooltip>

                <Tooltip label="Excluir venda" aria-label="Excluir venda">
                  <ChakraButton
                    _hover={{
                      bg: '#5580b9',
                      color: '#fff',
                    }}
                    _focusWithin={{
                      border: 0,
                    }}
                    backgroundColor="#355a9d"
                    style={{ padding: 12 }}
                    onClick={() => setDeleteDialogOpened(true)}
                    isDisabled={deleteLoading}
                  >
                    <FiTrash />
                  </ChakraButton>
                </Tooltip>

                {selectedSales.length === 1 && (
                  <Tooltip label="Editar venda" aria-label="Editar venda">
                    <ChakraButton
                      _hover={{
                        bg: '#5580b9',
                        color: '#fff',
                      }}
                      _focusWithin={{
                        border: 0,
                      }}
                      backgroundColor="#355a9d"
                      style={{ padding: 12 }}
                      onClick={() => {
                        setOpenEditSalesModal(true);
                        setSaleToEdit(
                          sales.find(sale => sale.id === selectedSales[0]),
                        );
                      }}
                    >
                      <FiEdit3 />
                    </ChakraButton>
                  </Tooltip>
                )}

                {canHandleSales && selectedSales.length === 1 && (
                  <Tooltip
                    label="Atribuir responsáveis técnicos"
                    aria-label="Atribuir responsáveis técnicos"
                  >
                    <ChakraButton
                      _hover={{
                        bg: '#5580b9',
                        color: '#fff',
                      }}
                      _focusWithin={{
                        border: 0,
                      }}
                      backgroundColor="#355a9d"
                      style={{ padding: 12 }}
                      onClick={() => {
                        setOpenLinkServiceProviderToSalesModal(true);
                        setSaleToLinkProviders(selectedSalesInfo[0].id);

                        api
                          .get(
                            `/service-sale-providers/sale/${selectedSalesInfo[0].id}`,
                          )
                          .then(response => {
                            setSelectedProviderServiceSales({
                              serviceProviders: response.data.providers,
                              date_to_be_done: response.data.date_to_be_done
                                ? new Date(response.data.date_to_be_done)
                                : undefined,
                              techinical_comments:
                                response.data.techinical_comments,
                            });
                          });
                      }}
                    >
                      <FiUsers />
                    </ChakraButton>
                  </Tooltip>
                )}
              </ActionButttonsContainer>
            </Form>
          </ChakraBox>
        )}

        <Flex direction="column" overflowX="auto">
          <div className="boxTitle">
            <span>N°</span>
            <span>Vendedor</span>
            <span>Carro - Placa/Chassi</span>
            <span>Disponibilidade</span>
            <span>Entrega</span>
            <span>Status</span>
            <span>Status Prod.</span>
          </div>

          {loading ? (
            <Stack marginTop="16px">
              <Skeleton
                height="60px"
                borderRadius="md"
                colorStart="#505050"
                colorEnd="#404040"
                marginTop="8px"
              />
              <Skeleton
                height="60px"
                borderRadius="md"
                colorStart="#505050"
                colorEnd="#404040"
                marginTop="8px"
              />
              <Skeleton
                height="60px"
                borderRadius="md"
                colorStart="#505050"
                colorEnd="#404040"
                marginTop="8px"
              />
              <Skeleton
                height="60px"
                borderRadius="md"
                colorStart="#505050"
                colorEnd="#404040"
                marginTop="8px"
              />
              <Skeleton
                height="60px"
                borderRadius="md"
                colorStart="#505050"
                colorEnd="#404040"
                marginTop="8px"
              />
              <Skeleton
                height="60px"
                borderRadius="md"
                colorStart="#505050"
                colorEnd="#404040"
                marginTop="8px"
              />
              <Skeleton
                height="60px"
                borderRadius="md"
                colorStart="#505050"
                colorEnd="#404040"
                marginTop="8px"
              />
            </Stack>
          ) : (
            <>
              <List width="100%" marginTop={4} paddingBottom={16}>
                {formattedSales.map(sale => (
                  <Box
                    key={sale.id}
                    onClick={
                      canHandleSales
                        ? () => {
                            handleSelectSale(sale.id);
                          }
                        : undefined
                    }
                  >
                    <div
                      className={
                        selectedSales.includes(sale.id)
                          ? 'header-selected'
                          : 'header'
                      }
                      style={
                        openedServices.includes(sale.id)
                          ? {
                              borderRadius: '15px 15px 0 0',
                              borderBottom: 0,
                              cursor: 'pointer',
                            }
                          : { borderRadius: '15px', cursor: 'pointer' }
                      }
                    >
                      <span>
                        {sale.hasAlreadyBeenDirected &&
                          (user.role === 'ADMIN' ||
                            user.role === 'NANOTECH_REPRESENTATIVE') && (
                            <Tooltip
                              label="Venda já direcionada para profissionais"
                              aria-label="Venda já direcionada para profissionais"
                              placement="top"
                            >
                              <span>
                                <FiNavigation
                                  style={{ marginRight: '6px' }}
                                  color="#355a9d"
                                />
                              </span>
                            </Tooltip>
                          )}
                        {sale.client_id}
                      </span>
                      <span>{sale.seller}</span>
                      <span>{`${sale.car} - ${sale.carPlate}`}</span>
                      <span>
                        {format(
                          new Date(sale.availability_date),
                          "dd'/'MM'/'yyyy '-' HH:mm'h'",
                          { locale: ptBR },
                        )}
                      </span>
                      <span>
                        {format(
                          new Date(sale.delivery_date),
                          "dd'/'MM'/'yyyy '-' HH:mm'h'",
                          { locale: ptBR },
                        )}
                      </span>

                      <div className="status">
                        <span>
                          <div className={sale.status} />
                          {getSaleStatusTranslated(sale.status)}
                        </span>
                      </div>

                      <SaleStatus
                        sale_id={sale.id}
                        status={
                          sale.production_status as
                            | 'PENDING'
                            | 'TO_DO'
                            | 'IN_PROGRESS'
                            | 'DONE'
                        }
                        enableUpdateStatus={false}
                        containerStyle={{
                          justifyContent: 'start',
                          margin: '0px',
                          marginRight: '16px',
                          border: '0px',
                          padding: '0px',
                        }}
                      />

                      {openedServices.includes(sale.id) ? (
                        <FaArrowAltCircleUp
                          onClick={e => {
                            e.stopPropagation();
                            handleCloseServices(sale.id);
                          }}
                          style={{ cursor: 'pointer' }}
                          size={26}
                        />
                      ) : (
                        <FaArrowAltCircleDown
                          onClick={e => {
                            e.stopPropagation();
                            handleOpenServices(sale.id);
                          }}
                          style={{ cursor: 'pointer' }}
                          size={26}
                        />
                      )}
                    </div>

                    <div
                      className="dropDown"
                      hidden={!openedServices.includes(sale.id)}
                      style={
                        selectedSales.includes(sale.id)
                          ? { border: '2px solid #355a9d', borderTop: 0 }
                          : { border: 0 }
                      }
                    >
                      <Separator className="separator">
                        <span>Detalhes</span>
                        <div />
                      </Separator>
                      <ChakraFlex>
                        <ChakraBox width="70%">
                          <div className="details">
                            <span>
                              <strong>Unidade:</strong> {` ${sale.unit}`}
                            </span>
                            <span>
                              <strong>Data do pedido: </strong>
                              {format(
                                new Date(sale.request_date),
                                "dd'/'MM'/'yyyy '-' HH:mm'h'",
                                { locale: ptBR },
                              )}
                            </span>
                          </div>
                          <Separator className="separator">
                            <span style={{ fontSize: '14px' }}>Serviços</span>
                            <div />
                          </Separator>
                          {sale.services.map(service => (
                            <div className="service" key={service.id}>
                              <span>{service.name}</span>
                              <span>{service?.price}</span>
                            </div>
                          ))}
                          <div className="total">
                            <span>Total</span>
                            <span>
                              {user?.role === 'ADMIN' ||
                              user?.role === 'NANOTECH_REPRESENTATIVE'
                                ? Number(sale.cost_value).toLocaleString(
                                    'pt-br',
                                    {
                                      style: 'currency',
                                      currency: 'BRL',
                                    },
                                  )
                                : Number(sale.company_value).toLocaleString(
                                    'pt-br',
                                    {
                                      style: 'currency',
                                      currency: 'BRL',
                                    },
                                  )}
                            </span>
                          </div>
                        </ChakraBox>
                        <ChakraFlex
                          wordBreak="break-all"
                          marginTop="16px"
                          marginLeft={2}
                          borderRadius="md"
                          width="30%"
                          padding={6}
                          flexShrink="initial"
                          background="#303030"
                        >
                          <Text
                            width="100%"
                            textAlign="center"
                            lineHeight={2}
                            fontSize={16}
                          >
                            <strong>Observações:</strong>
                            <br />
                            {sale.comments}
                          </Text>
                        </ChakraFlex>
                      </ChakraFlex>
                    </div>
                  </Box>
                ))}

                <Pagination
                  minWidth="1000px"
                  setPage={setCurrentPage}
                  page={currentPage}
                  total_pages={totalPages}
                />
              </List>
            </>
          )}
        </Flex>
      </Content>

      <AlertDialog
        isOpen={deleteDialogOpened}
        onConfirm={handleDeleteSales}
        setIsOpen={setDeleteDialogOpened}
        headerText="Excluir Venda"
        bodyText="Tem certeza que deseja excluir a venda?"
      />

      <FilterDrawer
        isOpen={filterDrawerOpened}
        placement="right"
        onClose={() => setFilterDrawerOpened(false)}
        initialValues={filters}
        sellersOptions={sellersOptions}
        companiesOptions={companiesOptions}
        close={() => setFilterDrawerOpened(false)}
        applyFilter={handleApplyFilter}
        cleanFilter={handleCleanFilter}
      />

      {canHandleSales && (
        <>
          <WhatsappNumbersDrawer
            isOpen={whatsappNumbersDrawerOpened}
            placement="right"
            onClose={() => setWhatsappNumbersDrawerOpened(false)}
          />

          <UpdateSalesModal
            isOpen={openEditSalesModal}
            onClose={() => setOpenEditSalesModal(false)}
            onSave={loadSales}
            sale={saleToEdit}
          />

          <IndicateServiceProvider
            isOpen={openLinkServiceProviderToSalesModal}
            onClose={() => {
              setOpenLinkServiceProviderToSalesModal(false);
            }}
            onSave={() => {
              setOpenLinkServiceProviderToSalesModal(false);
              loadSales();
            }}
            selectedProviderServiceSales={selectedProviderServiceSales}
            saleId={saleToLinkProviders}
            serviceProviders={serviceProviders}
          />
        </>
      )}
    </Flex>
  );
};

export default Sales;
