import React, { useCallback, useEffect, useState } from 'react';
import { BiBuildings } from 'react-icons/bi';
import { FiCalendar, FiDollarSign, FiFilter, FiUser } from 'react-icons/fi';

import {
  Button as ChakraButton,
  Flex, Skeleton,
  Stack,
  Text,
  Tooltip,
} from '@chakra-ui/core';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import Breadcrumb from '../../components/Breadcrumb';
import Menu from '../../components/Menu';
import Pagination from '../../components/Pagination';
import { useAuth } from '../../context/auth';
import { useToast } from '../../context/toast';
import api from '../../services/api';
import formatMoney from '../../utils/formatMoney';
import FilterRewardsModal, { IRewardFilters } from './components/FilterDrawer';
import SaleStatus from './components/SaleStatus';
import { Container } from './styles';

interface ISales {
  pixKey: string | null | undefined;
  pixType: string | null | undefined
  seller: {
    name: string;
    company: {
      name: string;
    };
  };
  availability_date: Date;
  date_to_be_done: Date;
  delivery_date: Date;
  finished_at: Date;
  id: string;
  status: 'TO_DO' | 'IN_PROGRESS' | 'DONE' | 'PENDING';
  production_status: 'TO_DO' | 'IN_PROGRESS' | 'DONE' | 'PENDING';
  comments: string;
  techinical_comments: string;
  sellerName: string;
  client_identifier: string;
  car: {
    brand: string;
    color: string;
    model: string;
    plate: string;
  };
  unit: {
    name: string;
    company: {
      name: string;
    };
  };
  services_sales: {
    id: string;
    company_value: string;
    cost_value: string;
    sale_id: string;
    service_id: string;
    commissioner_id: string;
    created_at: string;
    updated_at: string;
    service: {
      id: string;
      name: string;
      price: string;
      enabled: boolean;
      company_price: string;
      commission_amount: string;
      company_id: string;
      created_at: string;
      updated_at: string;
    };
    commissioner: {
      id: string;
      name: string;
      company_id: string;
      unit_id: any;
      user_id: string;
      created_at: string;
      updated_at: string;
      user: {
        pix_key_type: null | string;
        pix_key: null | string;
      } | undefined;
    };
  }[];
}

interface IFetchSalesResponse {
  current_page: number;
  total_pages: number;
  total_items: number;
  total_items_page: number;
  items: ISales[];
}

const Rewards = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [filterDrawerOpened, setFilterDrawerOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sales, setSales] = useState<ISales[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [filterValues, setFilterValues] = useState<IRewardFilters>({});

  const fetchRewards = useCallback(async ({ page }: {page: number}) => {
    setLoading(true);

    api
      .get<IFetchSalesResponse>('sales/rewards', {
        params: {
          page
        }
      })
      .then(response => {
        const formattedSales = response.data.items.map(sale => {
          return {
            ...sale,
            pixKey: sale.services_sales.find((service) => !!service.commissioner?.user?.pix_key)?.commissioner?.user?.pix_key,
            pixType: sale.services_sales.find((service) => !!service.commissioner?.user?.pix_key_type)?.commissioner?.user?.pix_key_type,
          }
        });

        setTotalPages(response.data.total_pages);
        setSales(formattedSales);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchRewards({ page: 0 });
  }, [fetchRewards]);

  const handleUpdatePagination = useCallback((page: number) => {
    setCurrentPage(page);

    fetchRewards({page});
  }, [fetchRewards])

  const handleApplyFilters = useCallback((values: IRewardFilters) => {
    setFilterValues(values);

    if (
      !values.start_delivery_date &&
      !values.end_delivery_date &&
      !values.status &&
      !values.production_status &&
      !values.seller_id &&
      !values.company_id
    ) {
      addToast({
        title: 'Por favor preencha algum campo para realizar a pesquisa.',
        type: 'error',
      });

      return;
    }

    setLoading(true);

    console.log('values: ', values);

    api
      .get<IFetchSalesResponse>('sales/rewards', {
        params: {
          page: 0,
          ...(values.start_delivery_date && String(values.start_delivery_date).length > 0 && {start_delivery_date: values.start_delivery_date}),
          ...(values.end_delivery_date && String(values.end_delivery_date).length > 0 && {end_delivery_date: values.end_delivery_date}),
          ...(values.status && String(values.status).length > 0 && {status: values.status}),
          ...(values.production_status && String(values.production_status).length > 0 && {production_status: values.production_status}),
          ...(values.seller_id && String(values.seller_id).length > 0 && {seller_id: values.seller_id}),
          ...(values.company_id && String(values.company_id).length > 0 && {company_id: values.company_id}),
        }
      })
      .then(response => {
        const formattedSales = response.data.items.map(sale => {
          return {
            ...sale,
            pixKey: sale.services_sales.find((service) => !!service.commissioner?.user?.pix_key)?.commissioner?.user?.pix_key,
            pixType: sale.services_sales.find((service) => !!service.commissioner?.user?.pix_key_type)?.commissioner?.user?.pix_key_type,
          }
        });

        setTotalPages(response.data.total_pages);
        setSales(formattedSales);
      })
      .finally(() => setLoading(false));
  }, [addToast]);

  return (
    <Container>
      <Menu />

      <Flex
        direction="column"
        w={{
          xs: '100%',
          sm: '100%',
          md: '100% ',
          lg: 'calc(100% - 80px)',
          xl: '100%',
        }}
        ml={{
          xs: '0px',
          sm: '0px',
          md: '0px',
          lg: '80px',
          xl: '0px',
        }}
        paddingX={8}
      >
        <Breadcrumb
          text="Comissões"
          filterButton={
            <Flex>
              {user.role === 'ADMIN' && (
                <Tooltip label="Filtros" aria-label="Filtros">
                  <ChakraButton
                    onClick={() => {
                      setFilterDrawerOpened(true);
                    }}
                    mr={2}
                    background="#2f5b9c"
                    _hover={{
                      bg: "#3d65a0"
                    }}
                  >
                    <FiFilter size={20} />
                  </ChakraButton>
                </Tooltip>
              )}
            </Flex>
          }
          />

          <Flex
            width="100%"
            maxWidth="90vw"
            marginLeft="auto"
            marginRight="auto"
            flexDirection="column"
            mt={4}
          >
          <Flex direction="column" marginY={4}>
            {loading ? (
              <Stack>
                <Skeleton
                  height="160px"
                  borderRadius="md"
                  colorStart="#505050"
                  colorEnd="#404040"
                  marginTop="8px"
                />
                <Skeleton
                  height="160px"
                  borderRadius="md"
                  colorStart="#505050"
                  colorEnd="#404040"
                  marginTop="8px"
                />
                <Skeleton
                  height="160px"
                  borderRadius="md"
                  colorStart="#505050"
                  colorEnd="#404040"
                  marginTop="8px"
                />
                <Skeleton
                  height="160px"
                  borderRadius="md"
                  colorStart="#505050"
                  colorEnd="#404040"
                  marginTop="8px"
                />
              </Stack>
            ) : (
              sales.map(sale => (
                <Flex
                  key={sale.id}
                  borderRadius={8}
                  border="1px solid #282828"
                  paddingX={6}
                  paddingY={3}
                  flexDirection="column"
                  backgroundColor="#353535"
                  mb={6}
                >
                  <Flex alignItems="center">
                    <Text
                      display="flex"
                      fontSize={14}
                      fontFamily="inter"
                      color="#6e737c"
                    >
                      {`#${sale.client_identifier}`}
                    </Text>

                    <Text
                      display="flex"
                      fontSize={14}
                      fontFamily="inter"
                      color="#6e737c"
                      marginX={1}
                    >
                      -
                    </Text>

                    <Text
                      fontSize={14}
                      fontFamily="inter"
                      fontWeight="bold"
                      color="#ededed"
                    >
                      {`${sale.car.brand.toLocaleUpperCase()} ${sale.car.model.toLocaleUpperCase()} - ${
                        sale.car.plate
                      }`}
                    </Text>

                    <Tooltip
                      label="Status de produção"
                      aria-label="Status de produção"
                      placement="top"
                      hasArrow
                    >
                      <Flex>
                        <SaleStatus
                          sale_id={sale.id}
                          status={sale.production_status}
                          enableUpdateStatus={false}
                        />
                      </Flex>
                    </Tooltip>

                    <Tooltip
                      label="Status da venda"
                      aria-label="Status da venda"
                      placement="top"
                      hasArrow
                    >
                      <Flex>
                        <SaleStatus
                          sale_id={sale.id}
                          status={sale.status}
                          enableUpdateStatus={false}
                        />
                      </Flex>
                    </Tooltip>
                  </Flex>

                  <Flex mt={4}>
                    <Tooltip
                      label="Concessionária"
                      aria-label="Concessionária"
                      placement="top"
                      hasArrow
                    >
                      <Flex>
                        <BiBuildings color="#b6b6b6" />

                        <Text ml={2} color="#b6b6b6" fontWeight="bold">
                          {`${sale.unit.company.name.toLocaleUpperCase()} - ${sale.unit.name.toUpperCase()}`}
                        </Text>
                      </Flex>
                    </Tooltip>

                    <Tooltip
                      label="Vendedor(a)"
                      aria-label="Vendedor(a)"
                      placement="top"
                      hasArrow
                    >
                      <Flex ml={4}>
                        <FiUser color="#b6b6b6" />

                        <Text ml={2} color="#b6b6b6" fontWeight="bold">
                          {sale.seller.name.toLocaleUpperCase()}
                        </Text>
                      </Flex>
                    </Tooltip>

                    {user.role === 'ADMIN' && (
                      <Tooltip
                        label="Comissionário(a)"
                        aria-label="Comissionário(a)"
                        placement="top"
                        hasArrow
                      >
                        <Flex ml={4}>
                          <FiUser color="#b6b6b6" />

                          <Text ml={2} color="#b6b6b6" fontWeight="bold">
                            {sale.services_sales.find(service => !!service.commissioner_id)?.commissioner.name}
                          </Text>
                        </Flex>
                      </Tooltip>
                    )}

                    <Tooltip
                      label={sale.finished_at ? "Data de finalizaçāo" : "Data estimada de entrega"}
                      aria-label={sale.finished_at ? "Data de finalizaçāo" : "Data estimada de entrega"}
                      placement="top"
                      hasArrow
                    >
                      <Flex ml={4}>
                        <FiCalendar color="#b6b6b6" />

                        <Text ml={2} color="#b6b6b6" fontWeight="bold">
                          {sale.finished_at ? format(
                            new Date(sale.finished_at),
                            "dd'/'MM'/'yyyy '-' HH:mm'h'",
                            { locale: ptBR },
                          ) :  format(
                            new Date(sale.delivery_date),
                            "dd'/'MM'/'yyyy '-' HH:mm'h'",
                            { locale: ptBR },
                          )}
                        </Text>
                      </Flex>
                    </Tooltip>

                    <Tooltip
                      label="Recompensa da indicaçāo"
                      aria-label="Recompensa da indicaçāo"
                      placement="top"
                      hasArrow
                    >
                      <Flex ml={4}>
                        <FiDollarSign color="#b6b6b6" />

                        <Text ml={2} color="#b6b6b6" fontWeight="bold">
                          {`${formatMoney(
                            Number(
                              sale.services_sales.filter(service => !!service.commissioner_id).reduce(
                                (accumulator, value) =>
                                  accumulator + Number(value.service.commission_amount),
                                0,
                              ),
                            ),
                          )}${user.role === 'ADMIN' ? ` - PIX: ${sale.pixKey}  - ${sale.pixType}` : ''}`}
                        </Text>
                      </Flex>
                    </Tooltip>
                  </Flex>

                  <Flex
                    mt={6}
                    borderTop="1px solid #4b4b4b"
                    style={{ gap: '6px' }}
                    width="100%"
                    wrap="wrap"
                    position="relative"
                  >
                    <Text
                      position="absolute"
                      top="-10px"
                      left="0"
                      paddingRight="8px"
                      background="#353535"
                      fontWeight="bold"
                    >
                      SERVIÇOS:
                    </Text>
                    {sale.services_sales.map(service => (
                      <Flex
                        key={service.id}
                        borderRadius={8}
                        mt={4}
                        border="1px solid #282828"
                        paddingX={2}
                        paddingY={1}
                      >
                        {service.service.name.toUpperCase()}
                        {!!service.commissioner_id ? ` - ${formatMoney(
                          Number(service.service.commission_amount),
                        )}` : ''}
                      </Flex>
                    ))}
                  </Flex>
                </Flex>
              ))
            )}

            <Pagination
              minWidth="1000px"
              setPage={handleUpdatePagination}
              page={currentPage}
              total_pages={totalPages}
            />
          </Flex>
        </Flex>
      </Flex>

      {console.log(filterValues)}

      <FilterRewardsModal
        isOpen={filterDrawerOpened}
        onClose={() => setFilterDrawerOpened(false)}
        close={() => setFilterDrawerOpened(false)}
        initialValues={filterValues}
        applyFilter={handleApplyFilters}
        cleanFilter={() => {
          fetchRewards({page: 0})

          setFilterValues({});
        }}
      />
    </Container>
  );
};

export default Rewards;
