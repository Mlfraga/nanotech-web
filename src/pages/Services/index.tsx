import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Box, Flex, Grid, Text } from '@chakra-ui/core';

import nanoproteçãoImg from '../../assets/nanoproteção.jpg';
import signInBackgroundImg from '../../assets/sign-in-background-3.jpg';
import Breadcrumb from '../../components/Breadcrumb';
import Menu from '../../components/Menu';
import { useAuth } from '../../context/auth';
import api from '../../services/api';
import { Container, Content } from './styles';

const Services = () => {
  const history = useHistory();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.profile.company_id) {
      if (user?.role === 'MANAGER') {
        api
          .get(`services/${user.profile.company_id}`, {
            params: { showDisabled: false },
          })
          .then(response => {
            const servicesWithoutPriceAmount = response.data.filter(
              (service: { company_price?: number }) => !service.company_price,
            ).length;

            if (servicesWithoutPriceAmount > 0 || response.data.length < 0) {
              history.push('set-prices');
            }
          });
      }
    }
  }, [history, user.profile.company_id, user]);

  return (
    <Container>
      <Menu />

      <Breadcrumb text="Serviços" />

      <Content
        width="100%"
        maxWidth={{
          xs: '90vw',
          sm: '90vw',
          md: '80vw',
          lg: '78vw',
          xl: '90vw',
        }}
        marginLeft="auto"
        marginRight="auto"
      >
        <Grid templateColumns="repeat(2, 1fr)" gap={6} marginTop="26px">
          <Box
            w="100%"
            bg="gray.700"
            borderRadius="md"
            display="flex"
            flexDirection="column"
            alignItems="center"
            paddingTop="15px"
            paddingLeft="15px"
            paddingRight="15px"
            border="2px solid #626262"
            onClick={() => history.push('/service/vitrificacao')}
          >
            <img
              style={{ maxWidth: '100%', borderRadius: '8px' }}
              className="images"
              src={signInBackgroundImg}
              alt="img"
            />
            <Flex
              alignItems="center"
              paddingY="10px"
              marginTop="2px"
              width="100%"
              height="15px"
              margin="8px"
            >
              <Text fontSize="16px" color="#CCC">
                Polimento técnico
              </Text>
            </Flex>
          </Box>
          <Box
            w="100%"
            bg="gray.700"
            borderRadius="md"
            display="flex"
            flexDirection="column"
            alignItems="center"
            paddingTop="15px"
            paddingLeft="15px"
            paddingRight="15px"
            border="2px solid #626262"
            onClick={() => history.push('/service/vitrificacao')}
          >
            <img
              style={{ maxWidth: '330px', borderRadius: '8px' }}
              className="images"
              src={nanoproteçãoImg}
              alt="img"
            />
            <Flex
              alignItems="center"
              paddingY="10px"
              marginTop="2px"
              width="100%"
              height="15px"
              margin="8px"
            >
              <Text fontSize="16px" color="#CCC">
                Nano Proteção
              </Text>
            </Flex>
          </Box>
          <Box
            w="100%"
            bg="gray.700"
            borderRadius="md"
            display="flex"
            flexDirection="column"
            alignItems="center"
            paddingTop="15px"
            paddingLeft="15px"
            paddingRight="15px"
            border="2px solid #626262"
            onClick={() => history.push('/service/vitrificacao')}
          >
            <img
              style={{ maxWidth: '100%', borderRadius: '8px' }}
              className="images"
              src={signInBackgroundImg}
              alt="img"
            />
            <Flex
              alignItems="center"
              paddingY="10px"
              marginTop="2px"
              width="100%"
              height="15px"
              margin="8px"
            >
              <Text fontSize="16px" color="#CCC">
                Interiores
              </Text>
            </Flex>
          </Box>
          <Box
            w="100%"
            bg="gray.700"
            borderRadius="md"
            display="flex"
            flexDirection="column"
            alignItems="center"
            paddingTop="15px"
            paddingLeft="15px"
            paddingRight="15px"
            border="2px solid #626262"
            onClick={() => history.push('/service/vitrificacao')}
          >
            <img
              style={{ maxWidth: '100%', borderRadius: '8px' }}
              className="images"
              src={signInBackgroundImg}
              alt="img"
            />
            <Flex
              alignItems="center"
              paddingY="10px"
              marginTop="2px"
              width="100%"
              height="15px"
              margin="8px"
            >
              <Text fontSize="16px" color="#CCC">
                Vidros
              </Text>
            </Flex>
          </Box>
        </Grid>
      </Content>
    </Container>
  );
};

export default Services;
