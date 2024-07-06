import React, { useCallback, useEffect, useState } from 'react';
import AlertDialog from '../../components/Dialogs/Alert';

import {
  Button as ChakraButton,
  Flex,
  Skeleton,
  Stack,
  Switch,
  Tooltip,
} from '@chakra-ui/core';

import api from '../../services/api';
import { useToast } from '../../context/toast';
import { IServiceGroup } from '../../interfaces/service_group';
import Breadcrumb from '../../components/Breadcrumb';

import { Column, CompanyStamp, Container, Content, List, Row } from './styles';
import CreateServiceModal from '../../components/Modals/CreateServiceGroup';
import { useHistory } from 'react-router-dom';
import { FiEdit } from 'react-icons/fi';
import UpdateServiceGroupModal from '../../components/Modals/UpdateServiceGroup';

const ServicesCatalog = () => {
  const { addToast } = useToast();
  const history = useHistory();

  const [
    serviceToToggleStatus,
    setServiceToToggleStatus,
  ] = useState<IServiceGroup>({} as IServiceGroup);
  const [serviceGroups, setServiceGroups] = useState<IServiceGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [disableServiceAlertOpened, setDisableServiceAlertOpened] = useState(
    false,
  );
  const [serviceFormModalOpened, setServiceFormModalOpened] = useState(false);
  const [
    updateServiceGroupModalOpened,
    setUpdateServiceGroupModalOpened,
  ] = useState(false);
  const [
    serviceGroupToUpdate,
    setServiceGroupToUpdate,
  ] = useState<IServiceGroup>({} as IServiceGroup);

  const fetchNanotechServices = useCallback(async () => {
    setLoading(true);

    const serviceGroups = await api.get<IServiceGroup[]>('/service-groups', {});

    setServiceGroups(serviceGroups.data);

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNanotechServices();
  }, [fetchNanotechServices]);

  const toggleServiceStatus = () => {
    setDisableServiceAlertOpened(false);

    const service = serviceToToggleStatus;

    setLoading(true);

    api
      .patch(`/service-groups/status/${service.id}`, {
        enabled: !service.enabled,
      })
      .then(() => {
        addToast({
          type: 'success',
          title: 'Sucesso',
          description: `Serviço ${
            service.enabled ? 'Desativado' : 'Ativado'
          } com Sucesso`,
        });

        fetchNanotechServices();
      })
      .catch(() => {
        addToast({
          type: 'error',
          title: 'Erro',
          description: `Erro ao ${
            service.enabled ? 'Desativar' : 'Ativar'
          } Serviço`,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleServiceFormModal = () => {
    setServiceFormModalOpened(!serviceFormModalOpened);
  };

  const handleGoToCompanyServices = (companyId: string) => {
    history.push(`/company/prices/${companyId}`);
  };

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
      >
        <Breadcrumb
          text="Catálogo de Serviços Nanotech"
          filterButton={
            <Flex>
              <Tooltip
                label="Criar Novo Serviço"
                aria-label="Criar Novo Serviço"
              >
                <ChakraButton
                  onClick={() => {
                    handleServiceFormModal();
                  }}
                  background="#2f5b9c"
                  _hover={{
                    bg: '#3d65a0',
                  }}
                >
                  Novo Serviço
                </ChakraButton>
              </Tooltip>
            </Flex>
          }
        />

        <Content width="100%" marginTop={4} maxWidth="90vw" overflowX="auto">
          <div className="boxTitle">
            <span>Serviço</span>
            <span>Disponível em</span>
            <span>Ativo</span>
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
            <List height={{ xs: '60vh', sm: '60vh', lg: '50vh', xl: '55vh' }}>
              {serviceGroups.map(service => (
                <Row>
                  <Column>
                    <span>
                      {`${
                        service.category?.name
                          ? `[${service.category.name}] - `
                          : ''
                      }
                      ${service.name}`}
                    </span>
                  </Column>

                  <Column>
                    {service.companies.map(company => (
                      <CompanyStamp
                        rand={Math.floor(Math.random() * 9)}
                        key={company.id}
                        onClick={() => handleGoToCompanyServices(company.id)}
                      >
                        {company.name}
                      </CompanyStamp>
                    ))}
                  </Column>

                  <Column>
                    <Switch
                      id="enabled"
                      isChecked={service.enabled}
                      color="green"
                      onClick={e => {
                        e.preventDefault();

                        setDisableServiceAlertOpened(true);
                        setServiceToToggleStatus(service);
                      }}
                    />

                    <ChakraButton
                      alignItems="center"
                      justifyContent="center"
                      width="20px"
                      height="20px"
                      padding="0px"
                      backgroundColor="transparent"
                      _hover={{
                        backgroundColor: '#444444',
                      }}
                      onClick={() => {
                        setServiceGroupToUpdate(service);
                        setUpdateServiceGroupModalOpened(true);
                      }}
                    >
                      <FiEdit />
                    </ChakraButton>
                  </Column>
                </Row>
              ))}
            </List>
          )}
        </Content>
      </Flex>

      <AlertDialog
        isOpen={disableServiceAlertOpened}
        onConfirm={toggleServiceStatus}
        setIsOpen={setDisableServiceAlertOpened}
        headerText={
          serviceToToggleStatus.enabled
            ? 'Tem Certeza Que Deseja Desativar Serviço?'
            : 'Ativar Serviço'
        }
        bodyText={
          serviceToToggleStatus.enabled
            ? 'Essa ação desativará o serviço para todas as concessionárias que o utilizam.'
            : 'Tem Certeza Que Deseja Ativar o Serviço?'
        }
      />

      <CreateServiceModal
        isOpen={serviceFormModalOpened}
        onClose={() => setServiceFormModalOpened(false)}
        onSave={() => {
          fetchNanotechServices();
        }}
      />

      <UpdateServiceGroupModal
        isOpen={updateServiceGroupModalOpened}
        onClose={() => setUpdateServiceGroupModalOpened(false)}
        onSave={() => {
          fetchNanotechServices();
        }}
        serviceGroup={serviceGroupToUpdate}
      />
    </Container>
  );
};

export default ServicesCatalog;
