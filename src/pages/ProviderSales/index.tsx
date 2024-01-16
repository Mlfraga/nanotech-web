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
  car: {
    name: string;
    color: string;
    plate: string;
  };
  unit: {
    name: string;
    company: {
      name: string;
    };
  };
  services: { name: string; id: string }[];
}

const ProviderSales = () => {
  const [loading, setLoading] = useState(false);
  const [commentsModalIsOpen, setCommentsModalIsOpen] = useState(false);
  const [sales, setSales] = useState<ISales[]>([]);
  const [listFrom, setListFrom] = useState('today');
  const [selectedSaleComments, setSelectedSaleComments] = useState({
    comments: '',
    techinicalComments: '',
  });

  const fetchSalesByProvider = useCallback(async () => {
    setLoading(true);

    api
      .get<ISales[]>('/service-sale-providers/sales/provider', {
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
    fetchSalesByProvider();
  }, [fetchSalesByProvider]);

  return (
    <Container>
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
        <Breadcrumb text="Meus serviços" />

        <Flex width="100%" maxWidth="90vw" flexDirection="column" mt={8}>
          <Select
            placeholder="Selecione o dia"
            backgroundColor="#282828"
            borderColor="#282828"
            size="md"
            name="listFrom"
            value={listFrom}
            onChange={e => setListFrom(e.target.value)}
          >
            <option value="yesterday">Ontem</option>
            <option value="today">Hoje</option>
            <option value="tomorrow">Amanhã</option>
          </Select>

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
                      {`${sale.car.name.toUpperCase()} ${sale.car.color.toUpperCase()} - ${
                        sale.car.plate
                      }`}
                    </Text>

                    <SaleStatus
                      sale_id={sale.id}
                      status={sale.production_status}
                      onUpdateStatus={fetchSalesByProvider}
                      enableUpdateStatus
                    />

                    <Flex flex={1} w="100%" justifyContent="flex-end">
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
                    </Flex>
                  </Flex>

                  <Flex mt={4}>
                    <Flex>
                      <BiBuildings color="#b6b6b6" />

                      <Text ml={2} color="#b6b6b6" fontWeight="bold">
                        {`${sale.unit.company.name.toUpperCase()} ${sale.unit.name.toUpperCase()}`}
                      </Text>
                    </Flex>

                    <Flex ml={4}>
                      <FiUser color="#b6b6b6" />

                      <Text ml={2} color="#b6b6b6" fontWeight="bold">
                        {sale.sellerName.toUpperCase()}
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
                    {sale.services.map(service => (
                      <Box
                        key={service.id}
                        borderRadius={8}
                        mt={4}
                        border="1px solid #282828"
                        paddingX={2}
                        paddingY={1}
                      >
                        {service.name}
                      </Box>
                    ))}
                  </Flex>
                </Flex>
              ))
            )}
          </Flex>
        </Flex>
      </Flex>
      <SalesCommentsModal
        isOpen={commentsModalIsOpen}
        onClose={() => setCommentsModalIsOpen(false)}
        comments={selectedSaleComments.comments}
        techinicalComments={selectedSaleComments.techinicalComments}
      />
    </Container>
  );
};

export default ProviderSales;
