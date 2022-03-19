import React, { useEffect, useMemo, useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';

import {
  Button as CharaButton,
  Skeleton,
  Stack,
  Tooltip,
} from '@chakra-ui/core';

import Breadcrumb from '../../components/Breadcrumb';
import Button from '../../components/Button';
import Menu from '../../components/Menu';
// import UpdateService from '../../components/Modals/UpdateService';
import api from '../../services/api';
import { Container, Content, Separator, List } from './styles';

interface IFormatRow {
  id: string;
  name: string;
  price: number;
  enabled: boolean;
}

const AdminServices = () => {
  const [rows, setRows] = useState<IFormatRow[]>([]);

  // const [openUpdateService, setOpenUpdateService] = useState<string>();

  const history = useHistory();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    api.get('services').then(response => {
      const services: IFormatRow[] = response.data;

      setRows(services);
      setLoading(false);
    });
  }, []);

  // const getService = useCallback(() => {
  //   api.get('services').then(response => {
  //     const services: IFormatRow[] = response.data;

  //     setRows(services);
  //   });
  // }, []);

  // const handleOpenUpdateServiceModal = useCallback((id: string) => {
  //   setOpenUpdateService(id);
  // }, []);

  // const handleCloseUpdateServiceModal = useCallback(async () => {
  //   setOpenUpdateService(undefined);
  // }, []);

  const rowsFormatted = useMemo(
    () =>
      rows.map(row => ({
        id: row.id,
        name: row.name,
        price: row.price.toLocaleString('pt-br', {
          style: 'currency',
          currency: 'BRL',
        }),
        enabled: row.enabled,
        button: (
          <Tooltip
            aria-label="Alterar dados do serviço"
            label="Alterar dados do serviço"
          >
            <CharaButton
              onClick={() => console.log(row.id)}
              _hover={{ background: '#353535', border: 0 }}
              _focusWithin={{ border: 0 }}
              background="#282828"
            >
              <FiEdit />
            </CharaButton>
          </Tooltip>
        ),
      })),
    [rows],
  );

  return (
    <Container>
      <Menu />

      <Breadcrumb text="Serviços" />
      <Content
        marginLeft="auto"
        marginRight="auto"
        width="100%"
        maxWidth={{
          xs: '90vw',
          sm: '90vw',
          md: '80vw',
          lg: '78vw',
          xl: '90vw',
        }}
      >
        <Separator>
          <span>Serviços</span>
          <div />
        </Separator>

        <div className="boxTitle">
          <h3>Nome</h3>
          <h3>Preço</h3>
          <h3>Situação</h3>
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
              {rowsFormatted.map(row => (
                <div className="box" key={row.id}>
                  <span>{row.name}</span>
                  <span>
                    {Number(row.price).toLocaleString('pt-br', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                  <span>
                    <div className={!row.enabled ? 'unabled' : 'enabled'} />
                    {!row.enabled ? 'Inativo' : 'Ativo'}
                  </span>
                  {row.button}
                </div>
              ))}
            </List>
          </>
        )}

        <div className="button">
          <Button
            onClick={() => {
              history.push('services-register');
            }}
          >
            Registrar novo serviço
          </Button>
        </div>
      </Content>
    </Container>
  );
};

export default AdminServices;
