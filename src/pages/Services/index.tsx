import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Flex } from '@chakra-ui/core';

import Breadcrumb from '../../components/Breadcrumb';
import { useAuth } from '../../context/auth';
import api from '../../services/api';
import Carroussel from './components/Carroussel';
import { Container, Content } from './styles';

const Services = () => {
  const history = useHistory();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.profile.company_id) {
      console.log('🚀 ~ useEffect ~ user?.role:', user?.role);
      if (user?.role === 'MANAGER') {
        api
          .get(`services/${user.profile.company_id}`, {
            params: { showDisabled: false },
          })
          .then(response => {
            const servicesWithoutPriceAmount = response.data.filter(
              (service: { company_price?: number }) => !service.company_price,
            ).length;

            console.log(
              '🚀 ~ useEffect ~ servicesWithoutPriceAmount:',
              servicesWithoutPriceAmount,
            );
            console.log('🚀 ~ useEffect ~ response.data:', response.data);
            if (servicesWithoutPriceAmount > 0 || response.data.length < 0) {
              history.push('set-prices');
            }
          });
      }
    }
  }, [history, user.profile.company_id, user]);

  return (
    <Container>
      <Flex
        direction="column"
        w={{
          xs: '100%',
          sm: '100%',
          md: '100% ',
          lg: '100%',
          xl: '100%',
        }}
        ml={{
          xs: '0px',
          sm: '0px',
          md: '0px',
          lg: '0px',
          xl: '0px',
        }}
        flex={1}
      >
        <Breadcrumb text="Serviços" />

        <Content width="100%" maxWidth="90vw" mt={8} flex={1}>
          <Carroussel />
        </Content>
      </Flex>
    </Container>
  );
};

export default Services;
