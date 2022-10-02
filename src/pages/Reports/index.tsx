import React, {
  useMemo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { FiLoader } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';

import { Box, Flex, Button as ChakraButton, Grid } from '@chakra-ui/core';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import Breadcrumb from '../../components/Breadcrumb';
import DatePicker from '../../components/DatePicker';
import Menu from '../../components/Menu';
import Select from '../../components/Select';
import { useAuth } from '../../context/auth';
import { useToast } from '../../context/toast';
import api from '../../services/api';
import { Container } from './styles';

interface ICompaniesResponseData {
  id: string;
  name: string;
  telephone: string;
  cnpj: string;
  units: Array<{ id: string; name: string; telephone: string }>;
}

interface IService {
  id: string;
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
  const [isReportLoading, setIsReportLoading] = useState(false);

  const canHandleSales = useMemo(
    () => user?.role === 'ADMIN' || user?.role === 'NANOTECH_REPRESENTATIVE',
    [user],
  );

  useEffect(() => {
    if (user.role === 'ADMIN' || user.role === 'NANOTECH_REPRESENTATIVE') {
      api.get('companies').then(response => {
        const newCompanies: ICompaniesResponseData[] = response.data;

        setCompanies(newCompanies);
      });
    }
  }, [user.role]);

  const handleGetReport = useCallback(
    async (data: IFormData) => {
      setIsReportLoading(true);

      const reqData = {
        initialDate: data.initialDate,
        finalDate: data.finalDate,
        ...(data.status && { status: data.status }),
        ...(data.company && { company: data.company }),
        ...(user.role !== 'ADMIN' &&
          user.role !== 'NANOTECH_REPRESENTATIVE' && {
            company: user.profile.company_id,
          }),
      };

      try {
        const file = await api.get<IGetReportResponseData>(
          '/sales/sales-report',
          {
            params: reqData,
          },
        );

        setTimeout(() => {
          setIsReportLoading(false);
          formRef.current?.reset();

          window.open(
            file.data.url_to_download,
            '_blank',
            'noopener,noreferrer',
          );

          history.push('services');

          addToast({
            title: 'Relatório exportado com sucesso.',
            description: 'Verifique no local de download escolhido.',
            type: 'success',
          });
        }, 1000);
      } catch (e) {
        addToast({
          title: 'Ocorreu um erro ao exportar o relatório.',
          description: 'Tente novamente mais tarde.',
          type: 'error',
        });

        setIsReportLoading(false);
      }
    },
    [addToast, history, user.profile.company_id, user.role],
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
          <Form ref={formRef} onSubmit={handleGetReport}>
            <Grid templateColumns="repeat(4, 1fr)" paddingY={8} gap={4}>
              {canHandleSales && (
                <Select
                  name="company"
                  height={8}
                  backgroundColor="#424242"
                  color="White"
                  placeholder="Concessionárias"
                  containerProps={{
                    marginRight: 8,
                    width: '100%',
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

              <DatePicker
                placeholderText="Data de entrega inicial"
                name="initialDate"
                containerProps={{
                  marginRight: 6,
                  width: '100%',
                }}
              />

              <DatePicker
                containerProps={{
                  marginRight: 6,
                  width: '100%',
                }}
                placeholderText="Data de entrega final"
                name="finalDate"
              />

              <Select
                name="status"
                height={8}
                backgroundColor="#424242"
                color="White"
                placeholder="Status"
                containerProps={{
                  width: '100%',
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
            </Grid>

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
