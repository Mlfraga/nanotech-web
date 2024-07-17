import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Skeleton, Stack, Button as ChakraButton } from '@chakra-ui/core';

import Breadcrumb from '../../components/Breadcrumb';
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
      <Breadcrumb
        text="Vendedores"
        filterButton={
          <ChakraButton
            _hover={{
              bg: '#5580b9',
              color: '#fff',
            }}
            _focusWithin={{
              border: 0,
            }}
            backgroundColor="#355a9d"
            style={{ padding: 24 }}
            onClick={() => {
              history.push('sellers-register');
            }}
          >
            Registrar novo vendedor
          </ChakraButton>
        }
      />

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
    </Container>
  );
};

export default Sellers;
