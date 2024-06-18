import React, { useCallback, useEffect, useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import { useParams } from 'react-router-dom';

import {
  Button as ChakraButton,
  Skeleton,
  Stack,
  Switch,
  Tooltip,
} from '@chakra-ui/core';

import Breadcrumb from '../../components/Breadcrumb';
import Button from '../../components/Button';
import AlertDialog from '../../components/Dialogs/Alert';
import CreateService from '../../components/Modals/CreateService';
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
    const methodType = disableService.enabled ? 'enable' : 'disable';

    const { status } = await api.patch(
      `services/${methodType}/${disableService.id}`,
    );

    if (status === 202) {
      addToast({
        title: `Serviço ${
          methodType === 'enable' ? 'Ativado' : 'Desativado'
        } com sucesso.`,
        type: 'success',
      });
    }

    getServices();
    setDisableServiceAlertOpened(false);
    setDisableService(
      {} as {
        id: string;
        enabled: boolean;
      },
    );
  }, [disableService, addToast, getServices]);

  return (
    <Container>
      <Breadcrumb text={`Serviços Disponíveis para ${company?.name}`} />
      <Content width="100%" marginTop="26px" maxWidth="90vw">
        <div className="boxTitle">
          <h3>Nome</h3>
          <h3>Preço</h3>
          <h3>Preço Nanotech</h3>
          <h3>Valor Comissāo</h3>
          <h3>Ativo</h3>
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
            <div className="button">
              <Button
                onClick={() => {
                  setCreateServiceModalOpened(true);
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
