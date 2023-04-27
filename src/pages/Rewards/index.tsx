import React, { useCallback, useEffect, useState } from 'react';
import { BiBuildings } from 'react-icons/bi';
import { FiCalendar, FiDollarSign, FiUser } from 'react-icons/fi';

import {
  Flex, Skeleton,
  Stack,
  Text,
  Tooltip
} from '@chakra-ui/core';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import Breadcrumb from '../../components/Breadcrumb';
import Menu from '../../components/Menu';
import { useAuth } from '../../context/auth';
import api from '../../services/api';
import formatMoney from '../../utils/formatMoney';
import SaleStatus from './components/SaleStatus';
import { Container } from './styles';

interface ISales {
  pixKey: string | null | undefined;
  pixType: string | null | undefined
  seller: {
    name: string;
  };
  availability_date: Date;
  date_to_be_done: Date;
  delivery_date: Date;
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

const Rewards = () => {
  const [loading, setLoading] = useState(false);
  const [commentsModalIsOpen, setCommentsModalIsOpen] = useState(false);
  const [sales, setSales] = useState<ISales[]>([]);
  const [listFrom, setListFrom] = useState('today');
  const [selectedSaleComments, setSelectedSaleComments] = useState({
    comments: '',
    techinicalComments: '',
  });
  const [companyName, setCompanyName] = useState('');
  const { user } = useAuth();

  const fetchRewards = useCallback(async () => {
    setLoading(true);

    api
      .get<ISales[]>('sales/rewards', {
        params: {
          listFrom,
        },
      })
      .then(response => {
        const formattedSales = response.data.map(sale => {
          return {
            ...sale,
            pixKey: sale.services_sales.find((service) => !!service.commissioner?.user?.pix_key)?.commissioner?.user?.pix_key,
            pixType: sale.services_sales.find((service) => !!service.commissioner?.user?.pix_key_type)?.commissioner?.user?.pix_key_type,
          }
         });

        setSales(formattedSales);

        const companyId = response.data.map(sale => {
          return sale.services_sales[0].service.company_id;
        });

        api.get('/companies/find/' + companyId[0]).then(response => {
          setCompanyName(response.data.name);
        });
      })
      .finally(() => setLoading(false));
  }, [listFrom]);

  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);


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
        <Breadcrumb text="Comissões" />

        <Flex
          width="100%"
          maxWidth="90vw"
          marginLeft="auto"
          marginRight="auto"
          flexDirection="column"
          mt={8}
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
                      {`${sale.car.brand.toLocaleUpperCase()} ${sale.car.color.toLocaleUpperCase()} - ${
                        sale.car.plate
                      }`}
                    </Text>

                    <Flex>
                      <Tooltip
                        label="Status de produção"
                        aria-label="Status de produção"
                        placement="top"
                        hasArrow
                      >
                        <div>
                          <SaleStatus
                            sale_id={sale.id}
                            status={sale.production_status}
                            enableUpdateStatus={false}
                          />
                        </div>
                      </Tooltip>
                    </Flex>

                    <SaleStatus
                      sale_id={sale.id}
                      status={sale.status}
                      enableUpdateStatus={false}
                    />

                    {/* <Flex flex={1} w="100%" justifyContent="flex-end">
                      <Tooltip label="Observações" aria-label="Observações">
                        <Button
                          bg="transparent"
                          _hover={{
                            background: 'transparent',
                            color: '#6e737c',
                          }}
                          color="#fff"
                          onClick={() => {
                            setCommentsModalIsOpen(true);
                            setSelectedSaleComments({
                              comments: sale.comments,
                              techinicalComments: sale.techinical_comments,
                            });
                          }}
                        >
                          <FiInfo size={20} />
                        </Button>
                      </Tooltip>
                    </Flex> */}
                  </Flex>

                  <Flex mt={4}>
                    <Flex>
                      <BiBuildings color="#b6b6b6" />

                      <Text ml={2} color="#b6b6b6" fontWeight="bold">
                        {companyName.toLocaleUpperCase()}
                      </Text>
                    </Flex>

                    <Flex ml={4}>
                      <FiUser color="#b6b6b6" />

                      <Text ml={2} color="#b6b6b6" fontWeight="bold">
                        {sale.seller.name.toLocaleUpperCase()}
                      </Text>
                    </Flex>

                    <Flex ml={4}>
                      <FiCalendar color="#b6b6b6" />

                      <Text ml={2} color="#b6b6b6" fontWeight="bold">
                        {format(
                          new Date(sale.delivery_date),
                          "dd'/'MM'/'yyyy '-' HH:mm'h'",
                          { locale: ptBR },
                        )}
                      </Text>
                    </Flex>

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
          </Flex>
        </Flex>
      </Flex>
    </Container>
  );
};

export default Rewards;
