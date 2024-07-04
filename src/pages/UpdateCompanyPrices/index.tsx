import React, { useRef, useCallback, useEffect, useState } from 'react';
import { FiDollarSign } from 'react-icons/fi';
import { MdModeEdit } from 'react-icons/md';

import { Skeleton, Stack } from '@chakra-ui/core';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import Breadcrumb from '../../components/Breadcrumb';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuth } from '../../context/auth';
import { useToast } from '../../context/toast';
import api from '../../services/api';
import { currencyMasker } from '../../utils/masks';
import { Container, Content, List, Box } from './styles';

export interface ICompanyService {
  id: string;
  price: number;
  company_price: number;
  name: string;
}

const UpdateCompanyPrices = () => {
  const { addToast } = useToast();
  const { user } = useAuth();
  const formRef = useRef<FormHandles>(null);

  const [companyServices, setCompanyServices] = useState<ICompanyService[]>([]);
  const [editionMode, setEditionMode] = useState<boolean>(false);
  const [
    companyServiceSelected,
    setCompanyServiceSelected,
  ] = useState<ICompanyService>({} as ICompanyService);
  const [loading, setLoading] = useState<boolean>(false);

  const loadCompanyServices = useCallback(() => {
    setLoading(true);

    api
      .get(`services/${user.profile.company_id}`, {
        params: { showDisabled: false },
      })
      .then(response => {
        const { data } = response;

        const services: ICompanyService[] = data.map(
          (companyService: ICompanyService) => {
            const { id, company_price, price, name } = companyService;

            return {
              id,
              company_price,
              price,
              name,
            };
          },
        );

        setCompanyServices(services);
        setLoading(false);
      });
  }, [user]);

  useEffect(() => {
    loadCompanyServices();
  }, [loadCompanyServices]);

  const handleEditClick = useCallback((companyService: ICompanyService) => {
    setCompanyServiceSelected(companyService);

    setEditionMode(true);
  }, []);

  const handleKeyUp = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      event.preventDefault();
      currencyMasker(event);
    },
    [],
  );

  const handleCancelEdition = useCallback(() => {
    setEditionMode(false);
    setCompanyServiceSelected({} as ICompanyService);
  }, []);

  const handleSubmit = useCallback(
    async data => {
      try {
        if (!Number(data.newValue)) {
          formRef.current?.setErrors({
            newValue: 'O novo valor deve ser informado.',
          });
          return;
        }

        const response = await api.put(
          `services/${companyServiceSelected?.id}`,
          {
            company_price: data.newValue,
          },
        );

        if (response.status === 200) {
          addToast({
            title: 'Sucesso',
            type: 'success',
            description: 'Valor alterado com sucesso.',
          });
          setEditionMode(false);
          loadCompanyServices();
        }
      } catch (err) {
        addToast({
          title: 'Erro.',
          type: 'error',
          description: 'Ocorreu um erro ao alterar o valor, tente novamente.',
        });
      }
    },
    [addToast, companyServiceSelected, loadCompanyServices],
  );

  return (
    <Container>
      <Breadcrumb text="Preços dos serviços" />
      <Content width="100%" maxWidth="90vw">
        <div className="boxTitle">
          <span>Serviço</span>
          <span>Valor da Nanotech</span>
          <span>Valor a ser cobrado</span>
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
          </Stack>
        ) : (
          <>
            <List height={{ lg: '40vh', xl: '55vh' }}>
              {companyServices?.map(companyService => (
                <Box key={companyService.id}>
                  <span>{companyService?.name}</span>
                  <span>
                    {Number(companyService?.price).toLocaleString('pt-br', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                  <span>
                    {Number(companyService.company_price).toLocaleString(
                      'pt-br',
                      {
                        style: 'currency',
                        currency: 'BRL',
                      },
                    )}
                  </span>
                  <span></span>
                  <MdModeEdit
                    size={20}
                    onClick={() => {
                      handleEditClick(companyService);
                    }}
                  />
                </Box>
              ))}
            </List>
          </>
        )}
      </Content>

      {editionMode === true && (
        <div className="edition-mode-container">
          <section>
            <div className="header">
              <h1>Altere o valor do serviço</h1>
              <span className="service-name">
                {companyServiceSelected?.name}
              </span>

              <div className="company-service-data-header">
                <span>Valor a ser alterado</span>
                <span>Valor da Nanotech</span>
              </div>

              <div className="company-service-data">
                <span>
                  {Number(companyServiceSelected?.company_price).toLocaleString(
                    'pt-br',
                    {
                      style: 'currency',
                      currency: 'BRL',
                    },
                  )}
                </span>
                <span>
                  {Number(companyServiceSelected?.price).toLocaleString(
                    'pt-br',
                    {
                      style: 'currency',
                      currency: 'BRL',
                    },
                  )}
                </span>
              </div>
            </div>
            <Form ref={formRef} onSubmit={handleSubmit}>
              <div className="input">
                <p>Novo valor:</p>
                <Input
                  onKeyUp={handleKeyUp}
                  name="newValue"
                  icon={FiDollarSign}
                />
              </div>

              <div className="buttons">
                <Button skipButton onClick={handleCancelEdition}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </div>
            </Form>
          </section>
        </div>
      )}
    </Container>
  );
};

export default UpdateCompanyPrices;
