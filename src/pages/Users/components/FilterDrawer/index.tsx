import React, { useEffect, useRef, useState } from 'react';

import {
  Box, Button,
  Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, IDrawer, Stack
} from '@chakra-ui/core';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import Input from '../../../../components/Input';
import Select from '../../../../components/Select';
import { ICompany } from '../../../../interfaces/companies';
import api from '../../../../services/api';
import roleOptions from '../../../../static/RoleOptions';
import enabledOptions from '../../../../static/RoleOptions copy';

export interface IUserFilters {
  role?: string;
  name?: string;
  telephone?: string;
  company_id?: string;
  enabled?: string;
}

interface IFilterDrawerProps extends Omit<IDrawer, 'children'> {
  close: () => void;
  applyFilter: (filter: IUserFilters) => void;
  initialValues: IUserFilters;
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

  useEffect(() => {
    api.get('companies').then(response => {
      const newCompaniesOptions: ICompany[] = response.data;

      setCompanyOptions(
        newCompaniesOptions.map(company => ({
          id: company.id,
          name: company.name,
        })),
      );
    });
  }, [])

  const handleApplyFilters = (data: IUserFilters) => {
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
        <DrawerHeader borderBottomWidth="1px">Filtrar Usuários</DrawerHeader>

        <Form
          style={{ display: 'flex', flex: 1, flexDirection: 'column' }}
          ref={formRef}
          onSubmit={handleApplyFilters}
        >
          <DrawerBody mt={6}>
            <Stack style={{ gap: '24px' }}>
              <Box>
                <Input
                  containerProps={{
                    border: '2px solid',
                    padding: '16px',
                    height: '40px',
                    borderRadius: '8px',
                    borderColor: '#585858',
                    backgroundColor: '#424242',
                    color: '#fff',
                  }}
                  name='name'
                  defaultValue={initialValues.name}
                  placeholder='Nome'
                />
              </Box>

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
                  placeholder="Cargo"
                  height={8}
                  backgroundColor="#424242"
                  color="White"
                  name="role"
                  containerProps={{
                    height: 10,
                    border: '2px solid',
                    borderColor: '#585858',
                    backgroundColor: '#424242',
                  }}
                  defaultValue={initialValues.role}
                >
                  {roleOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </Box>

              <Box>
                <Select
                  placeholder="Situaçāo do usuário"
                  height={8}
                  backgroundColor="#424242"
                  color="White"
                  name="enabled"
                  containerProps={{
                    height: 10,
                    border: '2px solid',
                    borderColor: '#585858',
                    backgroundColor: '#424242',
                  }}
                  defaultValue={initialValues.enabled}
                >
                  {enabledOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
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
