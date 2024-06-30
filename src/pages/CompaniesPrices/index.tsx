import React, { useCallback, useEffect, useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import { useParams } from 'react-router-dom';

import {
  Button as ChakraButton,
  Flex,
  Skeleton,
  Stack,
  Switch,
  Tooltip,
} from '@chakra-ui/core';

import Breadcrumb from '../../components/Breadcrumb';
import AlertDialog from '../../components/Dialogs/Alert';
import CreateService from '../../components/Modals/LinkServiceToCompany';
import UpdateService from '../../components/Modals/UpdateService';
import { useToast } from '../../context/toast';
import { ICompany } from '../../interfaces/companies';
import api from '../../services/api';
import { Box, Container, Content, List } from './styles';

interface ICompanyPricesRouterParams {
  id: string;
}

export interface ICompanyPrices {
  id: string;
  price: number;
  company_price: number;
  enabled: boolean;
  company_id: string;
  commission_amount: string;
  name: string;
  company: { name: string };
}

const CompaniesPrices = () => {
  const { id: companyId } = useParams<ICompanyPricesRouterParams>();
  const { addToast } = useToast();

  const [
    disableServiceAlertOpened,
    setDisableServiceAlertOpened,
  ] = useState<boolean>(false);
  const [disableService, setDisableService] = useState<{
    id: string;
    enabled: boolean;
  }>(
    {} as {
      id: string;
      enabled: boolean;
    },
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [
    createServiceModalOpened,
    setCreateServiceModalOpened,
  ] = useState<boolean>(false);
  const [companyPrices, setCompanyPrices] = useState<ICompanyPrices[]>([]);
  const [company, setCompany] = useState<ICompany>({} as ICompany);

  const [openUpdateService, setOpenUpdateService] = useState<boolean>(false);
  const [serviceToEdit, setServiceToEdit] = useState<ICompanyPrices>(
    {} as ICompanyPrices,
  );

  useEffect(() => {
    setLoading(true);

    api
      .get<ICompanyPrices[]>(`services/${companyId}`, {
        params: { showDisabled: true },
      })
      .then(response => {
        const companyServices = response.data;
        console.log('🚀 ~ useEffect ~ companyServices:', companyServices);

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

    api
      .get<ICompanyPrices[]>(`services/${companyId}`, {
        params: { showDisabled: true },
      })
      .then(response => {
        const companyServices = response.data;

        setCompanyPrices(companyServices);
        setLoading(false);
      });
  }, [companyId, setLoading, setCompanyPrices]);

  const toggleEnabled = useCallback(async () => {
    try {
      const methodType = disableService.enabled ? 'enable' : 'disable';

      await api.patch(`services/${methodType}/${disableService.id}`);

      addToast({
        title: `Serviço ${
          methodType === 'enable' ? 'Ativado' : 'Desativado'
        } com sucesso.`,
        type: 'success',
      });

      getServices();
    } catch (error) {
      let errorMessage = 'Erro ao desativar serviço.';

      if (
        (error as any)?.response?.data?.message ===
        'You cannot enable a service that belongs to a disabled group.'
      ) {
        errorMessage =
          'Você não pode ativar um serviço que pertence a um grupo desativado.';
      }

      addToast({
        title: errorMessage,
        type: 'error',
      });
    } finally {
      setDisableServiceAlertOpened(false);
      setDisableService(
        {} as {
          id: string;
          enabled: boolean;
        },
      );
    }
  }, [disableService, addToast, getServices]);

  return (
    <Container>
      <Breadcrumb
        text={`Serviços Disponíveis para ${company?.name}`}
        filterButton={
          <Flex style={{ gap: '6px' }}>
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
              onClick={() => setCreateServiceModalOpened(true)}
            >
              Disponibilizar novo serviço
            </ChakraButton>
          </Flex>
        }
      />

      <Content width="100%" marginTop="26px" maxWidth="90vw">
        <div className="boxTitle">
          <h3>Nome</h3>
          <h3>Preço</h3>
          <h3>Preço Nanotech</h3>
          <h3>Valor Comissāo</h3>
          <h3>Disponível Para Venda</h3>
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

                <span>
                  {row.commission_amount
                    ? Number(row.commission_amount).toLocaleString('pt-br', {
                        style: 'currency',
                        currency: 'BRL',
                      })
                    : ' - '}
                </span>

                <Switch
                  id="enabled"
                  isChecked={row.enabled}
                  color="green"
                  onClick={_e => {
                    setDisableServiceAlertOpened(true);
                    setDisableService({
                      id: row.id,
                      enabled: !row.enabled,
                    });
                  }}
                />

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
                    maxW={80}
                  >
                    <FiEdit />
                  </ChakraButton>
                </Tooltip>
              </Box>
            ))}
          </List>
        )}
      </Content>

      <UpdateService
        isOpen={!!openUpdateService}
        onClose={() => setOpenUpdateService(false)}
        onSave={getServices}
        service={serviceToEdit}
      />

      <CreateService
        isOpen={!!createServiceModalOpened}
        onClose={() => setCreateServiceModalOpened(false)}
        onSave={getServices}
        company={{ id: companyId, name: company?.name }}
      />

      <AlertDialog
        isOpen={disableServiceAlertOpened}
        onConfirm={toggleEnabled}
        setIsOpen={setDisableServiceAlertOpened}
        headerText={
          disableService.enabled ? 'Ativar Serviço' : 'Desativar Serviço'
        }
        bodyText={
          disableService.enabled
            ? 'Tem Certeza Que Deseja Ativar Serviço?'
            : 'Tem Certeza Que Deseja Desativar Serviço?'
        }
        confirmButtonVariantColor={disableService.enabled ? 'green' : 'red'}
        saveText={disableService.enabled ? 'Ativar' : 'Desativar'}
      />
    </Container>
  );
};

export default CompaniesPrices;
