import React, { useEffect, useRef, useState } from 'react';

import {
  Box, Button,
  Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, IDrawer, Stack
} from '@chakra-ui/core';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import { AxiosResponse } from 'axios';
import DatePicker from '../../../../components/DatePicker';
import Select from '../../../../components/Select';
import { ICompany } from '../../../../interfaces/companies';
import api from '../../../../services/api';
import productionStatus from '../../../../utils/ProductionStatus';
import { DescriptionLabel, RowWithTwoFieldsContainer } from './styles';

export interface IRewardFilters {
  start_delivery_date?: Date;
  end_delivery_date?: Date;
  company_id?: string;
  production_status?: string;
  unit_id?: string;
  seller_id?: string;
  status?: string;
}

interface IFilterDrawerProps extends Omit<IDrawer, 'children'> {
  close: () => void;
  applyFilter: (filter: IRewardFilters) => void;
  initialValues: IRewardFilters;
  cleanFilter: () => void;
}

const FilterDrawer: React.FC<IFilterDrawerProps> = ({
  close,
  cleanFilter,
  initialValues,
  applyFilter,
  ...rest
}) => {
  const formRef = useRef<FormHandles>(null);
  const [companyOptions, setCompanyOptions] = useState<{ id: string; name: string; }[]>([]);
  const [sellerOptions, setSellerOptions] = useState<{ id: string; name: string; }[]>([]);

  useEffect(() => {
    api
      .get('/profiles', {
        params: { role: 'SELLER', showDisabled: false },
      })
      .then((response: AxiosResponse) => {
        const sellers = response.data;
        const formattedSellers = sellers.map((seller: any) => ({
          id: seller.id,
          name: seller.name,
        }));

        setSellerOptions(formattedSellers);

        api
        .get('/profiles', {
          params: { role: 'MANAGER', showDisabled: false },
        })
        .then((response: AxiosResponse) => {
          const managers = response.data;
          const formattedManagers = managers.map((seller: any) => ({
            id: seller.id,
            name: seller.name,
          }));

          setSellerOptions(formattedManagers);
        });
      });

    api.get('/companies').then(response => {
      const newCompaniesOptions: ICompany[] = response.data;

      setCompanyOptions(
        newCompaniesOptions.map(company => ({
          id: company.id,
          name: company.name,
        })),
      );
    });
  }, [])

  const handleApplyFilters = (data: IRewardFilters) => {
    close();

    applyFilter(data);
  };

  const handleCleanFilters = () => {
    close();
    cleanFilter();
  };

  return (
    <Drawer {...rest}>
      <DrawerOverlay />
      <DrawerContent overflowY="auto" bg="#383838" minW={{
        lg: 460,
        xl: 460,
      }}>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">Filtrar Recompensas</DrawerHeader>

        <Form
          style={{ display: 'flex', flex: 1, flexDirection: 'column' }}
          ref={formRef}
          onSubmit={handleApplyFilters}
        >
          <DrawerBody mt={6}>
            <Stack style={{ gap: '24px' }}>
              <DescriptionLabel>Data de disponibilidade</DescriptionLabel>

              <RowWithTwoFieldsContainer>
                <DatePicker
                  name="start_delivery_date"
                  placeholderText="De"
                  containerProps={{
                    width: '100%',
                    height: 10,
                  }}
                  initialDate={initialValues.start_delivery_date}
                />

                <DatePicker
                  name="end_delivery_date"
                  placeholderText="De"
                  containerProps={{
                    width: '100%',
                    height: 10,
                  }}
                  initialDate={initialValues.end_delivery_date}
                />
              </RowWithTwoFieldsContainer>

              <Box>
                <Select
                  placeholder="Concessionária"
                  height={8}
                  backgroundColor="#424242"
                  color="White"
                  name="company_id"
                  containerProps={{
                    height: 10,
                    border: '2px solid',
                    borderColor: '#585858',
                    backgroundColor: '#424242',
                  }}
                  defaultValue={initialValues.company_id}
                >
                  {companyOptions.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </Select>
              </Box>

              <Box>
                <Select
                  placeholder="Status de Produçāo"
                  height={8}
                  backgroundColor="#424242"
                  color="White"
                  name="production_status"
                  containerProps={{
                    height: 10,
                    border: '2px solid',
                    borderColor: '#585858',
                    backgroundColor: '#424242',
                  }}
                  defaultValue={initialValues.production_status}
                >
                  {productionStatus.map(opt => (
                    <option key={opt.name} value={opt.name}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </Box>

              <Box>
                <Select
                  placeholder="Status"
                  height={8}
                  backgroundColor="#424242"
                  color="White"
                  name="status"
                  containerProps={{
                    height: 10,
                    border: '2px solid',
                    borderColor: '#585858',
                    backgroundColor: '#424242',
                  }}
                  defaultValue={initialValues.status}
                >
                  <option value="PENDING">Pendente</option>
                  <option value="CONFIRMED">Confirmado</option>
                  <option value="CANCELED">Cancelado</option>
                  <option value="FINISHED">Finalizado</option>
                </Select>
              </Box>

              <Box>
                <Select
                  placeholder="Vendedor"
                  height={8}
                  backgroundColor="#424242"
                  color="White"
                  name="seller_id"
                  containerProps={{
                    height: 10,
                    border: '2px solid',
                    borderColor: '#585858',
                    backgroundColor: '#424242',
                  }}
                  defaultValue={initialValues.seller_id}
                >
                  {sellerOptions.map((seller) => (
                    <option key={seller.id} value={seller.id}>{seller.name}</option>
                  ))}
                </Select>
              </Box>
            </Stack>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Button variant="outline" mr={3} onClick={handleCleanFilters}>
              Limpar Filtros
            </Button>
            <Button
              _hover={{
                bg: '#5580b9',
                color: '#fff',
              }}
              _focusWithin={{
                border: 0,
              }}
              backgroundColor="#355a9d"
              style={{ padding: 12 }}
              type="submit"
            >
              Aplicar Filtros
            </Button>
          </DrawerFooter>
        </Form>
      </DrawerContent>
    </Drawer>
  );
};

export default FilterDrawer;
