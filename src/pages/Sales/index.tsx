import React, {
  useRef,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from 'react';
import { FaArrowAltCircleDown, FaArrowAltCircleUp } from 'react-icons/fa';
import { FiEdit3, FiFilter, FiTrash, FiSave } from 'react-icons/fi';

import {
  Button as ChakraButton,
  Tooltip,
  Text,
  Box as ChakraBox,
  Flex as ChakraFlex,
  Skeleton,
  Stack,
} from '@chakra-ui/core';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import Breadcrumb from '../../components/Breadcrumb';
import AlertDialog from '../../components/Dialogs/Alert';
import Menu from '../../components/Menu';
import UpdateSalesModal from '../../components/Modals/UpdateSales';
import Pagination from '../../components/Pagination';
import Select from '../../components/Select';
import { useAuth } from '../../context/auth';
import { useToast } from '../../context/toast';
import { ISelectOptions } from '../../interfaces/select';
import { IUser } from '../../interfaces/users';
import api from '../../services/api';
import formatMoney from '../../utils/formatMoney';
import getSaleStatusTranslated from '../../utils/getSaleStatusTranslated';
import FilterDrawer from './components/FilterDrawer';
import {
  Container,
  Content,
  Separator,
  List,
  Box,
  ActionButttonsContainer,
} from './styles';

interface ISaleRequestResponseData {
  id: string;
  client_identifier: string;
  availability_date: string;
  delivery_date: string;
  status: string;
  company_value: number;
  cost_value: number;
  comments: string;
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
  deliveryDate?: Date;
  availabilityDate?: Date;
  status?: string;
  sellerId?: string;
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

  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const [filters, setFilters] = useState<IFilterSalesParams>(
    {} as IFilterSalesParams,
  );
  const [loading, setLoading] = useState<boolean>(false);

  const [filterDrawerOpened, setFilterDrawerOpened] = useState<boolean>(false);
  const [deleteDialogOpened, setDeleteDialogOpened] = useState<boolean>(false);
  const [openEditSalesModal, setOpenEditSalesModal] = useState<boolean>(false);
  const [saleToEdit, setSaleToEdit] = useState<
    ISaleRequestResponseData | undefined
  >({} as ISaleRequestResponseData);

  const loadSales = async () => {
    setLoading(true);

    const res = await api.get('sales', { params: { page: currentPage } });

    setSales(res.data.items);
    setTotalPages(res.data.total_pages);
    setCurrentPage(res.data.current_page);

    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);

    api
      .get('sales', {
        params: {
          page: currentPage,
          ...filters,
        },
      })
      .then(response => {
        const { data } = response;

        setSales(data?.items);
        setTotalPages(data?.total_pages);
        setLoading(false);
      });

    if (user.role === 'ADMIN') {
      api.get<IUser[]>('profiles').then(response => {
        setSellersOptions(
          response.data
            .filter(u => u.id !== user.profile.id && u.user.role !== 'ADMIN')
            .map(seller => ({ id: seller.id, name: seller.name })),
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
  }, [user, currentPage, filters]);

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

        return {
          id: sale.id,
          client_id: `${sale.seller.company.client_identifier}${sale.unit.client_identifier}${sale.client_identifier}`,
          seller: sale.seller.name,
          customer: sale.person.name,
          comments: sale.comments,
          car: `${sale.car.brand} ${sale.car.model}`,
          carPlate: sale.car.plate,
          company_value: sale.company_value,
          cost_value: sale.cost_value,
          availability_date: sale.availability_date,
          delivery_date: sale.delivery_date,
          status: sale.status,
          services,
          unit: sale.unit.name,
          request_date: sale.request_date,
        };
      }),
    [sales, user],
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
        !params.availabilityDate &&
        !params.status &&
        !params.deliveryDate &&
        !params.sellerId
      ) {
        addToast({
          title: 'Por favor preencha algum campo para realizar a pesquisa.',
          type: 'error',
        });

        return;
      }

      setFilters({
        ...(params.deliveryDate && { deliveryDate: params.deliveryDate }),
        ...(params.availabilityDate && {
          availabilityDate: params.availabilityDate,
        }),
        ...(params.status && { status: params.status }),
        ...(params.sellerId && { sellerId: params.sellerId }),
      });

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

  return (
    <Container>
      <Menu />

      <Breadcrumb text="Vendas realizadas" />

      <Content
        marginLeft="auto"
        marginRight="auto"
        width="100%"
        marginTop="26px"
        paddingBottom="16px"
        maxWidth={{
          xs: '90vw',
          sm: '90vw',
          md: '80vw',
          lg: '78vw',
          xl: '90vw',
        }}
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
          style={{ padding: 24 }}
          onClick={() => setFilterDrawerOpened(true)}
          isDisabled={deleteLoading}
          leftIcon={FiFilter}
        >
          Filtros
        </ChakraButton>

        {user?.role === 'ADMIN' && (
          <ChakraBox
            marginLeft="auto"
            marginRight="auto"
            width="100%"
            marginTop="26px"
            paddingBottom="16px"
            maxWidth={{
              xs: '90vw',
              sm: '90vw',
              md: '80vw',
              lg: '78vw',
              xl: '90vw',
            }}
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
              </ActionButttonsContainer>
            </Form>
          </ChakraBox>
        )}

        <Separator>
          <span>Vendas</span>
          <div />
        </Separator>

        <div className="boxTitle">
          <span>N°</span>
          <span>Vendedor</span>
          <span>Carro</span>
          <span>Placa</span>
          <span>Data de disponibilidade</span>
          <span>Data de entrega</span>
          <span>Situação</span>
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
                    user?.role === 'ADMIN'
                      ? () => handleSelectSale(sale.id)
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
                    <span>{sale.client_id}</span>
                    <span>{sale.seller}</span>
                    <span>{sale.car}</span>
                    <span>{sale.carPlate}</span>
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
                            {user?.role === 'ADMIN'
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
                setPage={setCurrentPage}
                page={currentPage}
                total_pages={totalPages}
              />
            </List>
          </>
        )}
      </Content>

      <AlertDialog
        isOpen={deleteDialogOpened}
        onDelete={handleDeleteSales}
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
        close={() => setFilterDrawerOpened(false)}
        applyFilter={handleApplyFilter}
        cleanFilter={handleCleanFilter}
      />

      <UpdateSalesModal
        isOpen={openEditSalesModal}
        onClose={() => setOpenEditSalesModal(false)}
        onSave={loadSales}
        sale={saleToEdit}
      />
    </Container>
  );
};

export default Sales;
