import React, { useRef } from 'react';

import {
  DrawerOverlay,
  DrawerFooter,
  DrawerContent,
  IDrawer,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Box,
  Stack,
  Button,
  Drawer,
} from '@chakra-ui/core';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import DatePicker from '../../../../components/DatePicker';
import Select from '../../../../components/Select';
import { useAuth } from '../../../../context/auth';
import { ISelectOptions } from '../../../../interfaces/select';
import { IFilterSalesParams } from '../../index';

interface IFilterDrawerProps extends Omit<IDrawer, 'children'> {
  initialValues: IFilterSalesParams;
  sellersOptions: ISelectOptions[];
  close: () => void;
  applyFilter: (filter: IFilterSalesParams) => void;
  cleanFilter: () => void;
}

const FilterDrawer: React.FC<IFilterDrawerProps> = ({
  initialValues,
  sellersOptions,
  close,
  applyFilter,
  cleanFilter,
  ...rest
}) => {
  const { user } = useAuth();
  const formRef = useRef<FormHandles>(null);

  const handleApplyFilters = (data: IFilterSalesParams) => {
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
      <DrawerContent bg="#383838" minW={460}>
        <DrawerCloseButton
          onClick={() => {
            console.log('opaaa');
          }}
        />
        <DrawerHeader borderBottomWidth="1px">Filtrar Vendas</DrawerHeader>

        <Form
          style={{ display: 'flex', flex: 1, flexDirection: 'column' }}
          ref={formRef}
          onSubmit={handleApplyFilters}
        >
          <DrawerBody mt={6}>
            <Stack spacing="24px">
              <Box>
                <DatePicker
                  name="availabilityDate"
                  placeholderText="Data de Disponibilidade"
                  containerProps={{
                    width: '100%',
                    height: 10,
                  }}
                  initialDate={initialValues.availabilityDate}
                />
              </Box>

              <Box>
                <DatePicker
                  name="deliveryDate"
                  placeholderText="Data de Entrega"
                  containerProps={{
                    width: '100%',
                    height: 10,
                  }}
                  initialDate={initialValues.deliveryDate}
                />
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
                  <option value="ALL">Todos</option>
                  <option value="PENDING">Pendente</option>
                  <option value="CONFIRMED">Confirmado</option>
                  <option value="CANCELED">Cancelado</option>
                  <option value="FINISHED">Finalizado</option>
                </Select>
              </Box>

              <Box>
                {user.role !== 'SELLER' && (
                  <Select
                    placeholder="Vendedor"
                    height={8}
                    backgroundColor="#424242"
                    color="White"
                    name="sellerId"
                    containerProps={{
                      height: 10,
                      border: '2px solid',
                      borderColor: '#585858',
                      backgroundColor: '#424242',
                    }}
                    defaultValue={initialValues.sellerId}
                  >
                    {sellersOptions.map(option => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </Select>
                )}
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
