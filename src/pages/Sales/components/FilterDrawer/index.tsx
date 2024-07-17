import React, { useRef } from 'react';

import {
  DrawerOverlay,
  DrawerFooter,
  DrawerContent,
  IDrawer,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
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
import {
  RowWithTwoFieldsContainer,
  DescriptionLabel,
  InputStyled,
  Row,
} from './styles';

interface IFilterDrawerProps extends Omit<IDrawer, 'children'> {
  initialValues: IFilterSalesParams;
  sellersOptions: ISelectOptions[];
  companiesOptions: ISelectOptions[];
  close: () => void;
  applyFilter: (filter: IFilterSalesParams) => void;
  cleanFilter: () => void;
}

const FilterDrawer: React.FC<IFilterDrawerProps> = ({
  initialValues,
  sellersOptions,
  companiesOptions,
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
      <DrawerContent overflowY="auto" bg="#383838">
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">Filtrar Vendas</DrawerHeader>

        <Form
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
          }}
          ref={formRef}
          onSubmit={handleApplyFilters}
        >
          <DrawerBody py={6}>
            <Stack style={{ gap: '24px' }}>
              <DescriptionLabel>Data de disponibilidade</DescriptionLabel>

              <RowWithTwoFieldsContainer>
                <DatePicker
                  name="startAvailabilityDate"
                  placeholderText="De"
                  containerProps={{
                    width: '100%',
                    height: 10,
                  }}
                  initialDate={initialValues.startAvailabilityDate}
                />
                <DatePicker
                  name="endAvailabilityDate"
                  placeholderText="Até"
                  containerProps={{
                    width: '100%',
                    height: 10,
                  }}
                  initialDate={initialValues.endAvailabilityDate}
                />
              </RowWithTwoFieldsContainer>

              <DescriptionLabel>Data de entrega</DescriptionLabel>

              <RowWithTwoFieldsContainer>
                <DatePicker
                  name="startDeliveryDate"
                  placeholderText="De"
                  containerProps={{
                    width: '100%',
                    height: 10,
                  }}
                  initialDate={initialValues.startDeliveryDate}
                />
                <DatePicker
                  name="endDeliveryDate"
                  placeholderText="Até"
                  containerProps={{
                    width: '100%',
                    height: 10,
                  }}
                  initialDate={initialValues.endDeliveryDate}
                />
              </RowWithTwoFieldsContainer>

              <DescriptionLabel>Data de finalização</DescriptionLabel>

              <RowWithTwoFieldsContainer>
                <DatePicker
                  name="startFinishedDate"
                  placeholderText="De"
                  containerProps={{
                    width: '100%',
                    height: 10,
                  }}
                  initialDate={initialValues.startFinishedDate}
                />
                <DatePicker
                  name="endFinishedDate"
                  placeholderText="Até"
                  containerProps={{
                    width: '100%',
                    height: 10,
                  }}
                  initialDate={initialValues.endFinishedDate}
                />
              </RowWithTwoFieldsContainer>

              <Row>
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
              </Row>

              <Row>
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
              </Row>

              {user.role !== 'SELLER' && user.role !== 'MANAGER' && (
                <Row>
                  <Select
                    placeholder="Concessionária"
                    height={8}
                    backgroundColor="#424242"
                    color="White"
                    name="companyId"
                    containerProps={{
                      height: 10,
                      border: '2px solid',
                      borderColor: '#585858',
                      backgroundColor: '#424242',
                    }}
                    defaultValue={initialValues.companyId}
                  >
                    {companiesOptions.map(option => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </Select>
                </Row>
              )}

              <Row>
                <InputStyled
                  className="plateInput"
                  id="plate"
                  type="plate"
                  maxLength={7}
                  name="plate"
                  placeholder="Placa/Chassi"
                  defaultValue={initialValues.plate}
                  containerProps={{
                    maxHeight: '40px',
                    border: '2px solid',
                    borderColor: '#585858',
                    color: '#fff',
                    backgroundColor: '#424242',
                  }}
                />
              </Row>
            </Stack>
          </DrawerBody>

          <DrawerFooter
            borderTopWidth="1px"
            pt={6}
            marginBottom={{
              base: 20,
              md: 0,
              lg: 0,
              xl: 0,
            }}
          >
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
