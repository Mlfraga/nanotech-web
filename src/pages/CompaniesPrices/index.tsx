import React, { useCallback, useEffect, useState } from 'react';
import { FiTag } from 'react-icons/fi';
import { useHistory, useParams } from 'react-router-dom';

import {
  Skeleton,
  Stack,
  Tooltip,
  Button as ChakraButton,
} from '@chakra-ui/core';

import Breadcrumb from '../../components/Breadcrumb';
import Button from '../../components/Button';
import Menu from '../../components/Menu';
import UpdateService from '../../components/Modals/UpdateService';
import { ICompany } from '../../interfaces/companies';
import api from '../../services/api';
import { Container, Content, List, Box, Separator } from './styles';

interface ICompanyPricesRouterParams {
  id: string;
}

export interface ICompanyPrices {
  id: string;
  price: number;
  company_price: number;
  company_id: string;
  name: string;
  company: { name: string };
}

const CompaniesPrices = () => {
  const { id: companyId } = useParams<ICompanyPricesRouterParams>();
  const history = useHistory();

  const [loading, setLoading] = useState<boolean>(false);
  const [companyPrices, setCompanyPrices] = useState<ICompanyPrices[]>([]);
  const [company, setCompany] = useState<ICompany>({} as ICompany);

  const [openUpdateService, setOpenUpdateService] = useState<boolean>(false);
  const [serviceToEdit, setServiceToEdit] = useState<ICompanyPrices>(
    {} as ICompanyPrices,
  );

  useEffect(() => {
    setLoading(true);

    api
      .get<ICompanyPrices[]>(`company-services/by-company/${companyId}`)
      .then(response => {
        const companyServices = response.data;

        setCompanyPrices(
          companyServices.sort((a, b) => a.name.localeCompare(b.name)),
        );

        api
          .get<ICompany>(`companies/${companyId}`)
          .then(({ data: companyData }) => {
            setCompany(companyData);
          });

        setLoading(false);
      });
  }, [companyId]);

  const getServices = useCallback(() => {
    setLoading(true);

    api.get(`company-services/by-company/${companyId}`).then(response => {
      const companyServices = response.data;

      setCompanyPrices(companyServices);
      setLoading(false);
    });
  }, [companyId, setLoading, setCompanyPrices]);

  return (
    <Container>
      <Menu />
      <Breadcrumb text="Serviços" />
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
          <span>{`Serviços Disponíveis na ${company?.name}`}</span>
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
                  <span>{row.name}</span>
                  <span>
                    {row.company_price
                      ? Number(row.company_price).toLocaleString('pt-br', {
                          style: 'currency',
                          currency: 'BRL',
                        })
                      : '-'}
                  </span>
                  <span>
                    {Number(row.price).toLocaleString('pt-br', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                  <Tooltip
                    aria-label="Alterar dados do serviço"
                    label="Alterar dados do serviço"
                  >
                    <ChakraButton
                      onClick={() => {
                        setOpenUpdateService(true);
                        setServiceToEdit(row);
                      }}
                      _hover={{ background: '#353535', border: 0 }}
                      _focusWithin={{ border: 0 }}
                      background="#282828"
                    >
                      <FiTag />
                    </ChakraButton>
                  </Tooltip>
                </Box>
              ))}
            </List>
            <div className="button">
              <Button
                onClick={() => {
                  history.push(`/services-register/${companyId}`);
                }}
              >
                Registrar novo serviço
              </Button>
            </div>
          </>
        )}
      </Content>

      <UpdateService
        isOpen={!!openUpdateService}
        onClose={() => setOpenUpdateService(false)}
        onSave={getServices}
        service={serviceToEdit}
      />
    </Container>
  );
};

export default CompaniesPrices;
