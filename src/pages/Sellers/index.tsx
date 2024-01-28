import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Skeleton, Stack, Flex } from '@chakra-ui/core';

import Breadcrumb from '../../components/Breadcrumb';
import Button from '../../components/Button';
import api from '../../services/api';
import { Container, Content, List } from './styles';

interface IFormatRow {
  id: string;
  name: string;
  enabled: boolean;
  user: {
    telephone: string;
    email: string;
    role: 'MANAGER' | 'SELLER';
  };
  company: {
    name: string;
  };
  unit: {
    name: string;
  };
}

const Sellers = () => {
  const [rows, setRows] = useState<IFormatRow[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    api.get('users/company').then(response => {
      const sellers: IFormatRow[] = response.data;

      setRows(sellers);
      setLoading(false);
    });
  }, []);

  return (
    <Container>
      <Breadcrumb text="Vendedores" />

      <Content width="100%" maxWidth="90vw">
        <div className="boxTitle">
          <h3>Nome</h3>
          <h3>Telefone</h3>
          <h3>E-mail</h3>
          <h3>Concessionária</h3>
          <h3>Cargo</h3>
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
            <Skeleton
              height="60px"
              borderRadius="md"
              colorStart="#505050"
              colorEnd="#404040"
              marginTop="8px"
            />
          </Stack>
        ) : (
          <List
            maxH={{
              xs: '90vh',
              sm: '90vh',
              md: '70vh',
              lg: '60vh',
              xl: '60vh',
            }}
          >
            {rows.map(row => (
              <div key={row.id} className="box">
                <span>{row.name}</span>
                <span>{row.user.telephone}</span>
                <span>{row.user.email}</span>
                <span>{row.company.name}</span>
                <span>
                  {row.user?.role === 'MANAGER' ? 'Gerente' : 'Vendedor'}
                </span>
              </div>
            ))}
          </List>
        )}
      </Content>

      <Flex
        marginLeft="auto"
        maxW="90vw"
        mr="auto"
        ml="auto"
        alignItems="flex-end"
        justifyContent="flex-end"
      >
        <Button
          maxW="300px"
          onClick={() => {
            history.push('sellers-register');
          }}
        >
          Registrar novo vendedor
        </Button>
      </Flex>
    </Container>
  );
};

export default Sellers;
