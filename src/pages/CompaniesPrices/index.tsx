import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Skeleton, Stack } from '@chakra-ui/core';

import Breadcrumb from '../../components/Breadcrumb';
import Menu from '../../components/Menu';
import api from '../../services/api';
import { Container, Content, List, Box, Separator } from './styles';

interface ICompaniesPricesRouterParams {
  id: string;
}

interface ICompaniesPrices {
  id: string;
  price: number;
  company_id: string;
  company: { name: string };
  service_id: string;
  service: {
    id: string;
    name: string;
    price: number;
    enabled: true;
  };
}

const CompaniesPrices = () => {
  const { id: companyId } = useParams<ICompaniesPricesRouterParams>();

  const [loading, setLoading] = useState<boolean>(false);
  const [companyPrices, setCompanyPrices] = useState<ICompaniesPrices[]>([]);

  useEffect(() => {
    setLoading(true);

    api.get(`company-services/by-company/${companyId}`).then(response => {
      const companyServices = response.data;

      setCompanyPrices(companyServices);
      setLoading(false);
    });
  }, [companyId]);

  return (
    <Container>
      <Menu />
      <Breadcrumb text="Concessionárias" />
      <Content
        marginLeft="auto"
        marginRight="auto"
        width="100%"
        marginTop="26px"
        maxWidth={{
          xs: '90vw',
          sm: '90vw',
          md: '80vw',
          lg: '78vw',
          xl: '90vw',
        }}
      >
        <Separator>
          <span>{`Preços da Concessionária ${companyPrices[0]?.company?.name}`}</span>
          <div />
        </Separator>
        <div className="boxTitle">
          <h3>Nome</h3>
          <h3>Preço</h3>
          <h3>Preço Nanotech</h3>
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
            <List height={{ lg: '40vh', xl: '55vh' }}>
              {companyPrices.map(row => (
                <Box key={row.id}>
                  <span>{row.service.name}</span>
                  <span>
                    {Number(row.price).toLocaleString('pt-br', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                  <span>
                    {Number(row.service.price).toLocaleString('pt-br', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                </Box>
              ))}
            </List>
          </>
        )}
      </Content>
    </Container>
  );
};

export default CompaniesPrices;
