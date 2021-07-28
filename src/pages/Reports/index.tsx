import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FiLoader } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';

import { Box, Flex, Button as ChakraButton } from '@chakra-ui/core';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import Breadcrumb from '../../components/Breadcrumb';
import DatePicker from '../../components/DatePicker';
import Menu from '../../components/Menu';
import Select from '../../components/Select';
import Separator from '../../components/Separator';
import { useAuth } from '../../context/auth';
import { useToast } from '../../context/toast';
import api from '../../services/api';
import { Container } from './styles';

interface ICompaniesResponseData {
  id: number;
  name: string;
  telephone: string;
  cnpj: string;
  units: Array<{ id: number; name: string; telephone: string }>;
}

interface IService {
  id: number;
  name: string;
  price: number;
  enabled: boolean;
}

interface IFormData {
  company: string;
  service: string;
  initialDate: Date;
  finalDate: Date;
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'FINISHED';
}

interface IGetReportResponseData {
  url_to_download: string;
  destroysIn: number;
}

const Reports: React.FC = () => {
  const history = useHistory();

  const formRef = useRef<FormHandles>(null);
  const { user } = useAuth();
  const { addToast } = useToast();

  const [companies, setCompanies] = useState<ICompaniesResponseData[]>([]);
  const [services, setServices] = useState<IService[]>([]);
  const [isReportLoading, setIsReportLoading] = useState(false);

  useEffect(() => {
    if (user.role === 'ADMIN') {
      api.get('companies').then(response => {
        const newCompanies: ICompaniesResponseData[] = response.data;

        setCompanies(newCompanies);
      });
    }

    api.get('services').then(response => {
      const newServices: IService[] = response.data;

      setServices(newServices);
    });
  }, [user.role]);

  const handleGetReport = useCallback(
    async (data: IFormData) => {
      setIsReportLoading(true);

      const reqData = {
        initialDate: data.initialDate,
        finalDate: data.finalDate,
        ...(data.status && { status: data.status }),
      };

      data.service.split('').length >= 1 &&
        Object.assign(reqData, {
          service: data.service,
        });

      const file = await api.get<IGetReportResponseData>(
        '/sales/sales-report',
        {
          params: reqData,
        },
      );

      setTimeout(() => {
        setIsReportLoading(false);
        formRef.current?.reset();

        window.open(file.data.url_to_download, '_blank', 'noopener,noreferrer');

        history.push('services');

        addToast({
          title: 'Relatório exportado com sucesso.',
          description: 'Verifique no local de download escolhido.',
          type: 'success',
        });
      }, 1000);
    },
    [addToast, history],
  );

  return (
    <Container>
      <Menu />
      <Breadcrumb text="Relatórios" />
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        width="100%"
      >
        <Box
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
          <Separator text="Filtros" />
          <Form ref={formRef} onSubmit={handleGetReport}>
            <Flex marginBottom={8}>
              {user.role === 'ADMIN' && (
                <Select
                  name="company"
                  height={8}
                  backgroundColor="#424242"
                  color="White"
                  placeholder="Concessionárias"
                  containerProps={{
                    marginTop: 6,
                    marginRight: 8,
                    width: 300,
                    height: 10,
                    border: '2px solid',
                    borderColor: '#585858',
                    backgroundColor: '#424242',
                  }}
                >
                  {companies.map(company => (
                    <option value={company.id} key={company.id}>
                      {company.name}
                    </option>
                  ))}
                </Select>
              )}

              <Select
                name="service"
                height={8}
                backgroundColor="#424242"
                color="White"
                placeholder="Serviços"
                containerProps={{
                  marginTop: 6,
                  marginRight: 6,
                  width: 300,
                  height: 10,
                  border: '2px solid',
                  borderColor: '#585858',
                  backgroundColor: '#424242',
                }}
              >
                {services.map(service => (
                  <option value={service.id} key={service.id}>
                    {service.name}
                  </option>
                ))}
              </Select>

              <Flex marginTop={6}>
                <DatePicker
                  placeholderText="Data inicial"
                  name="initialDate"
                  containerProps={{
                    marginRight: 6,
                  }}
                />
                <DatePicker placeholderText="Data final" name="finalDate" />
              </Flex>

              <Select
                name="status"
                height={8}
                backgroundColor="#424242"
                color="White"
                placeholder="Status"
                containerProps={{
                  marginTop: 6,
                  marginLeft: 6,
                  width: 300,
                  height: 10,
                  border: '2px solid',
                  borderColor: '#585858',
                  backgroundColor: '#424242',
                }}
              >
                <option value="PENDING">Pendente</option>
                <option value="CONFIRMED">Confirmado</option>
                <option value="CANCELED">Cancelado</option>
                <option value="FINISHED">Finalizado</option>
              </Select>
            </Flex>

            <Flex>
              <ChakraButton
                isDisabled={isReportLoading}
                width="100%"
                backgroundColor="#355a9d"
                _hover={{
                  backgroundColor: '#5580b9',
                }}
                type="submit"
              >
                {isReportLoading ? <FiLoader /> : 'Gerar arquivo'}
              </ChakraButton>
            </Flex>
          </Form>
        </Box>
      </Flex>
    </Container>
  );
};

export default Reports;
