import React, { useCallback, useEffect, useState } from 'react';
import { BiBuildings } from 'react-icons/bi';
import { FiCalendar, FiUser, FiInfo } from 'react-icons/fi';

import {
  Box,
  Flex,
  Select,
  Skeleton,
  Stack,
  Text,
  Tooltip,
  Button,
} from '@chakra-ui/core';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import Breadcrumb from '../../components/Breadcrumb';
import Menu from '../../components/Menu';
import SalesCommentsModal from '../../components/Modals/SalesComments';
import api from '../../services/api';
import SaleStatus from './components/SaleStatus';
import { Container } from './styles';
import getSaleStatusTranslated from '../../utils/getSaleStatusTranslated';

interface ISales {
  availability_date: Date;
  date_to_be_done: Date;
  delivery_date: Date;
  id: string;
  status: string;
  production_status: 'TO_DO' | 'IN_PROGRESS' | 'DONE' | 'PENDING';
  comments: string;
  techinical_comments: string;
  sellerName: string;
  client_identifier: string;
  unit: {
    name: string;
    company: {
      name: string;
    };
  };
  services_sales: {
    id: string
  company_value: string
  cost_value: string
  sale_id: string
  service_id: string
  commissioner_id: string
  created_at: string
  updated_at: string
  service: {
    id: string
    name: string
    price: string
    enabled: boolean
    company_price: string
    commission_amount: string
    company_id: string
    created_at: string
    updated_at: string
  }
  commissioner: {
    id: string
    name: string
    company_id: string
    unit_id: any
    user_id: string
    created_at: string
    updated_at: string
  }
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

  const fetchRewards = useCallback(async () => {
    setLoading(true);

    api
      .get<ISales[]>('sales/rewards', {
        params: {
          listFrom,
        },
      })
      .then(response => {
        setSales(response.data);
      })
      .finally(() => setLoading(false));
  }, [listFrom]);

  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  // console.log(sales)

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
          <Flex direction="column"  overflowX="auto">
            <div className="boxTitle">
              <span>N°</span>
              <span>Comissão</span>
              <span>Serviço</span>
              <span>Entrega</span>
              <span>Status</span>
            </div>
          </Flex>

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
                <Box
                  key={sale.id}
                  borderRadius={8}
                  paddingX={6}
                  paddingY={3}
                  backgroundColor="#303030"
                  mb={6}
                  className="boxSales"
                >
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
                      {sale.services_sales.map((service) => {
                        const price = Number(service.company_value) - Number(service.cost_value)
                          return (
                            <span className='serviceName'>{Number(price).toLocaleString(
                              'pt-br',
                              {
                                style: 'currency',
                                currency: 'BRL',
                              },
                            )}</span>
                          )
                        })}
                    </Text>
                    <Text
                      display="flex"
                      fontSize={14}
                      fontFamily="inter"
                      color="#6e737c"
                      marginX={1}
                    >
                      <Flex >
                        {sale.services_sales.map((service) => {
                          return (
                            <span className='serviceName'>{service.service.name}</span>
                          )
                        })}
                      </Flex>
                    </Text>
                    <Text
                      display="flex"
                      fontSize={14}
                      fontFamily="inter"
                      color="#6e737c"
                      marginX={1}
                    >
                      {format(
                            new Date(sale.delivery_date),
                            "dd'/'MM'/'yyyy '-' HH:mm'h'",
                            { locale: ptBR },
                          )}
                    </Text>
                    <Text
                      fontSize={14}
                      fontFamily="inter"
                      fontWeight="bold"
                      color="#ededed"
                    >
                      <div className="status">
                        <span>
                          <div className={sale.status} />
                          {getSaleStatusTranslated(sale.status)}
                        </span>
                      </div>
                    </Text>
                </Box>
              ))
            )}
          </Flex>
        </Flex>
      </Flex>
    </Container>
  );
};

export default Rewards;
