import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Box, Flex, Grid, Text } from '@chakra-ui/core';

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
        let servicesAmount = 0;

        api.get('/services').then(response => {
          servicesAmount = response.data.length;
        });

        api.get('company-services/company').then(response => {
          const companyservices = response.data;

          if (
            companyservices.length === 0 ||
            companyservices.length < servicesAmount
          ) {
            history.push('set-prices');
          }
        });
      }
    }
  }, [history, user]);

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
        <Grid templateColumns="repeat(4, 1fr)" gap={6} marginTop="26px">
          <Box
            w="100%"
            h="60"
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
                Vitrificação de Pintura
              </Text>
            </Flex>
          </Box>
          <Box
            w="100%"
            h="60"
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
                Vitrificação de Pintura
              </Text>
            </Flex>
          </Box>
          <Box
            w="100%"
            h="60"
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
            {/* <iframe
              style={{ width: '100%', height: '72%' }}
              src="https://www.youtube.com/embed/DXAQTlfGIYM"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer;
              autoplay; clipboard-write;
              encrypted-media;
              gyroscope; picture-in-picture"
              allowFullScreen
            /> */}
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
                Vitrificação de Pintura
              </Text>
            </Flex>
          </Box>
          <Box
            w="100%"
            h="60"
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
                Vitrificação de Pintura
              </Text>
            </Flex>
          </Box>
          <Box
            w="100%"
            h="60"
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
                Vitrificação de Pintura
              </Text>
            </Flex>
          </Box>
        </Grid>
      </Content>
    </Container>
  );
};

export default Services;
