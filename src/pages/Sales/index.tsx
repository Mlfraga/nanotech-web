import React, {
  useRef,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from 'react';
import { FaArrowAltCircleDown, FaArrowAltCircleUp } from 'react-icons/fa';
import { FiSearch, FiTrash } from 'react-icons/fi';

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
import Button from '../../components/Button';
import DatePicker from '../../components/DatePicker';
import Menu from '../../components/Menu';
import Pagination from '../../components/Pagination';
// import Header from '../../components/Header';
import Select from '../../components/Select';
import { useAuth } from '../../context/auth';
import { useToast } from '../../context/toast';
import api from '../../services/api';
import formatMoney from '../../utils/formatMoney';
import getSaleStatusTranslated from '../../utils/getSaleStatusTranslated';
import { Container, Content, Separator, List, Box } from './styles';

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

interface IFormDataFilter {
  date: Date;
  status: string;
}

interface IFilters {
  status?: string;
  date?: Date;
}

const Sales = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const formRef = useRef<FormHandles>(null);
  const searchFormRef = useRef<FormHandles>(null);

  const [sales, setSales] = useState<ISaleRequestResponseData[]>([]);
  const [openedServices, setOpenedServices] = useState<string[]>([]);
  const [selectedSales, setSelectedSales] = useState<string[]>([]);

  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const [filters, setFilters] = useState<IFilters>({});
  const [loading, setLoading] = useState<boolean>(false);

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
          car: sale.car.model,
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

  const handleSearchSale = useCallback(
    async ({ date, status }: IFormDataFilter) => {
      let query = {};

      if (!date && !status) {
        addToast({
          title: 'Por favor preencha algum campo para realizar a pesquisa.',
          type: 'error',
        });

        return;
      }

      if (date && status) {
        if (status === 'ALL') {
          query = { date };
        } else {
          query = { date, status };
        }
      }

      if (date && !status) {
        query = { date };
      }

      if (status && !date && status !== 'ALL') {
        query = { status };
      }

      setFilters(query);
      setCurrentPage(0);
    },
    [addToast],
  );

  const handleRemoveFilters = useCallback(async () => {
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
        <Form
          ref={searchFormRef}
          onSubmit={handleSearchSale}
          style={{ display: 'flex', marginBottom: '36px' }}
        >
          <DatePicker
            name="date"
            placeholderText="Filtrar por data de disponibilidade"
            containerProps={{
              width: 300,
              height: 10,
            }}
          />

          <Select
            placeholder="Filtrar por situação"
            height={8}
            backgroundColor="#424242"
            color="White"
            name="status"
            containerProps={{
              marginLeft: 4,
              width: 225,
              height: 10,
              border: '2px solid',
              borderColor: '#585858',
              backgroundColor: '#424242',
            }}
          >
            <option value="ALL">Todos</option>
            <option value="PENDING">Pendente</option>
            <option value="CONFIRMED">Confirmado</option>
            <option value="CANCELED">Cancelado</option>
            <option value="FINISHED">Finalizado</option>
          </Select>

          <Tooltip label="Filtrar vendas" aria-label="Filtrar vendas">
            <ChakraButton
              _hover={{
                bg: '#5580b9',
                color: '#fff',
              }}
              _focusWithin={{
                border: 0,
              }}
              height="40px"
              backgroundColor="#355a9d"
              marginLeft={4}
              type="submit"
            >
              <FiSearch />
            </ChakraButton>
          </Tooltip>

          <Tooltip label="Limpar filtros" aria-label="Limpar filtros">
            <ChakraButton
              _hover={{
                bg: '#4e4e4e',
              }}
              _focusWithin={{
                border: 0,
              }}
              height="40px"
              backgroundColor="#454545"
              marginLeft={4}
              onClick={handleRemoveFilters}
            >
              Limpar filtros
            </ChakraButton>
          </Tooltip>
        </Form>

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

        {user?.role === 'ADMIN' && (
          <div
            className={
              selectedSales.length < 1
                ? 'udpdateSaleContainerHide'
                : 'updateSaleContainer'
            }
            hidden={selectedSales.length < 1}
            style={{ marginTop: '16px', marginBottom: '56px' }}
          >
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
                  width: 300,
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
              <Button style={{ marginTop: '0px' }} type="submit">
                Alterar Situação
              </Button>
              <Tooltip label="Excluir venda" aria-label="Excluir venda">
                <Button
                  style={{ marginTop: '0px' }}
                  onClick={handleDeleteSales}
                  isDisabled={deleteLoading}
                >
                  <FiTrash />
                </Button>
              </Tooltip>
            </Form>
          </div>
        )}
      </Content>
    </Container>
  );
};

export default Sales;
