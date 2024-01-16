import React, {
  useMemo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { FiLoader } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';

import { Flex, Button as ChakraButton } from '@chakra-ui/core';
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
  const [finishedSelected, setFinishedSelected] = useState(false);

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

  const handleGetPdfReport = useCallback(
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

          const link = document.createElement('a');

          link.setAttribute('target', '_blank');
          link.setAttribute('href', file.data.url_to_download);
          link.dispatchEvent(new MouseEvent('click'));

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

  const handleGetExcelReport = useCallback(
    async (data: IFormData) => {
      setIsReportLoading(true);

      const reqData = {
        startRangeFinishedDate: data.initialDate,
        endRangeFinishedDate: data.finalDate,
        ...(data.status && { status: data.status }),
        ...(data.company && { company: data.company }),
      };

      try {
        const file = await api.get<IGetReportResponseData>(
          '/sales/excel-sales-report',
          {
            params: reqData,
          },
        );

        setTimeout(() => {
          setIsReportLoading(false);
          formRef.current?.reset();

          const link = document.createElement('a');

          link.setAttribute('target', '_blank');
          link.setAttribute('href', file.data.url_to_download);
          link.dispatchEvent(new MouseEvent('click'));

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
    [addToast, history],
  );

  return (
    <Container>
      <Breadcrumb text="Relatórios" />
      <Flex
        direction="column"
        width="100%"
        maxWidth="90vw"
        padding="0px 0px 26px 8px"
      >
        <Form ref={formRef} onSubmit={handleGetPdfReport}>
          <Flex
            flexWrap="wrap"
            style={{ gap: '6px' }}
            direction="row"
            mt="16px"
          >
            {canHandleSales && (
              <Select
                name="company"
                height={8}
                backgroundColor="#424242"
                color="White"
                placeholder="Concessionárias"
                containerProps={{
                  height: 10,
                  border: '2px solid',
                  borderColor: '#585858',
                  backgroundColor: '#424242',
                  maxWidth: '300px',
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
              name="status"
              height={8}
              backgroundColor="#424242"
              color="White"
              placeholder="Status"
              containerProps={{
                height: 10,
                border: '2px solid',
                borderColor: '#585858',
                backgroundColor: '#424242',
                maxWidth: '300px',
              }}
              onChange={e => {
                if (e.target.value === 'FINISHED') {
                  setFinishedSelected(true);
                } else {
                  setFinishedSelected(false);
                }
              }}
            >
              <option value="PENDING">Pendente</option>
              <option value="CONFIRMED">Confirmado</option>
              <option value="CANCELED">Cancelado</option>
              <option value="FINISHED">Finalizado</option>
            </Select>

            {finishedSelected && (
              <>
                <DatePicker
                  placeholderText="Data da conclusão (inicial)"
                  name="initialDate"
                  containerProps={{
                    width: '100%',
                    maxWidth: '300px',
                  }}
                />

                <DatePicker
                  containerProps={{
                    width: '100%',
                    maxWidth: '300px',
                  }}
                  placeholderText="Data da conclusão (final)"
                  name="finalDate"
                />
              </>
            )}
          </Flex>

          <Flex style={{ gap: '16px', marginTop: '16px' }}>
            <ChakraButton
              alignItems="center"
              justifyContent="center"
              isDisabled={isReportLoading}
              width="100%"
              backgroundColor="#355a9d"
              _hover={{
                backgroundColor: '#5580b9',
              }}
              type="submit"
            >
              {isReportLoading ? <FiLoader /> : 'Gerar relatório PDF'}
            </ChakraButton>

            <ChakraButton
              alignItems="center"
              justifyContent="center"
              isDisabled={isReportLoading}
              width="100%"
              backgroundColor="#355a9d"
              _hover={{
                backgroundColor: '#5580b9',
              }}
              onClick={() => {
                handleGetExcelReport(formRef.current?.getData() as IFormData);
              }}
            >
              {isReportLoading ? <FiLoader /> : 'Gerar relatório Excel'}
            </ChakraButton>
          </Flex>
        </Form>
      </Flex>
    </Container>
  );
};

export default Reports;
