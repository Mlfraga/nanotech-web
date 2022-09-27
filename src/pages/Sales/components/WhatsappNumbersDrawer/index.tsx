import React, { useEffect, useState } from 'react';
import { FiSave, FiTrash, FiXSquare } from 'react-icons/fi';
import { FiPlus } from 'react-icons/fi';
import { NumberFormatValues } from 'react-number-format';

import {
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  IDrawer,
  DrawerHeader,
  DrawerBody,
  Drawer,
  Flex,
  Text,
  Checkbox,
  Grid,
  Select,
  PseudoBox,
  Button,
} from '@chakra-ui/core';

import { ISelectOption } from '../../../../components/Select';
import { useToast } from '../../../../context/toast';
import { ICompany } from '../../../../interfaces/companies';
import api from '../../../../services/api';
import { TelephoneField, StyledStack } from './styles';

interface INumber {
  id: string;
  number: string;
  company_id: string;
  restricted_to_especific_company: boolean;
}

type IWhatsappNumbersDrawerProps = Omit<IDrawer, 'children'>;

const WhatsappNumbersDrawer: React.FC<IWhatsappNumbersDrawerProps> = ({
  ...rest
}) => {
  const { addToast } = useToast();

  const [companiesOptions, setCompaniesOptions] = useState<ISelectOption[]>([]);
  const [newNumber, setNewNumber] = useState<INumber>({} as INumber);
  const [numbers, setNumbers] = useState<INumber[]>([]);

  const [createNumberMode, setCreateNumberMode] = useState(false);

  useEffect(() => {
    api.get<ICompany[]>('companies/').then(response => {
      const companies = response.data;

      setCompaniesOptions(
        companies.map(company => ({
          value: company.id,
          label: company.name,
        })),
      );
    });

    api.get<INumber[]>('/whatsapp-numbers').then(response => {
      setNumbers(response.data);
    });
  }, []);

  const validate = (): boolean => {
    const numberIsNullValidation = !newNumber?.number;

    if (numberIsNullValidation) {
      addToast({
        type: 'error',
        title: 'Erro ao adicionar número',
        description: 'O número é obrigatório',
      });

      return false;
    }

    const numberAlreadyExistsValidation = numbers.find(
      number => number.number === newNumber?.number,
    );
    const numberLengthValidation =
      newNumber?.number?.replace('_', '').length !== 13;
    const companyIsNullValidation =
      !newNumber?.company_id && newNumber?.restricted_to_especific_company;

    if (numberAlreadyExistsValidation) {
      addToast({
        type: 'error',
        title: 'Erro ao adicionar número',
        description: 'Esse número já está cadastrado',
      });
    }

    if (numberLengthValidation) {
      addToast({
        type: 'error',
        title: 'Erro ao adicionar número',
        description: 'O número deve conter 13 caracteres',
      });
    }

    if (companyIsNullValidation) {
      addToast({
        type: 'error',
        title: 'Erro ao adicionar número',
        description: 'Selecione uma empresa',
      });
    }

    return !(
      numberAlreadyExistsValidation ||
      numberIsNullValidation ||
      numberLengthValidation ||
      companyIsNullValidation
    );
  };

  const handleAddNumber = () => {
    const isValid = validate();

    if (isValid) {
      setCreateNumberMode(false);
      setNumbers([
        ...numbers,
        { ...newNumber, id: String(numbers.length + 1) },
      ]);
    }
  };

  return (
    <Drawer {...rest}>
      <DrawerOverlay />
      <DrawerContent overflow="auto" bg="#383838" minW={800}>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">
          Números a receber vendas por Whatsapp
        </DrawerHeader>

        <DrawerBody mt={6}>
          <StyledStack paddingX={2}>
            <Grid templateColumns="25% 25% 30% 6%" gap="2%" pr={4}>
              <Flex borderRight="1px solid #282828" paddingY="4px">
                <Text fontWeight="bold" fontSize={18}>
                  Número *
                </Text>
              </Flex>
              <Flex borderRight="1px solid #282828" paddingY="4px">
                <Text fontWeight="bold" fontSize={18}>
                  Concessionária específica *
                </Text>
              </Flex>
              <Flex>
                <Text fontWeight="bold" fontSize={18}>
                  Concessionária
                </Text>
              </Flex>
              <Text> </Text>
            </Grid>

            <Grid
              className="numbers-list"
              mt="16px"
              pr={2}
              templateColumns="25% 25% 30% 6%"
              gap="2%"
              overflowY="scroll"
              maxH={{
                xs: '40vh',
                sm: '40vh',
                md: '40vh',
                xl: '50vh',
                lg: '70vh',
              }}
            >
              {numbers.map(number => (
                <>
                  <Flex
                    key={number.id}
                    w="100%"
                    borderRight="1px solid #282828"
                    paddingY="4px"
                  >
                    <TelephoneField
                      format="## #####-####"
                      mask="_"
                      value={number.number}
                    />
                  </Flex>

                  <Flex w="100%" borderRight="1px solid #282828" paddingY="4px">
                    <Checkbox
                      name="receive_only_company_sales"
                      isChecked={number.restricted_to_especific_company}
                    ></Checkbox>
                  </Flex>

                  <Flex w="100%">
                    <Select
                      bg="#383838"
                      borderColor="#282828"
                      value={number?.company_id}
                      placeholder="Concessionária"
                      isDisabled={!number.restricted_to_especific_company}
                    >
                      {companiesOptions.map(company => (
                        <option key={company.value} value={company.value}>
                          {company.label}
                        </option>
                      ))}
                    </Select>
                  </Flex>

                  <PseudoBox
                    cursor="pointer"
                    _hover={{ color: 'red.500' }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <FiTrash size={18} />
                  </PseudoBox>
                </>
              ))}

              {createNumberMode && (
                <>
                  <Flex w="100%" borderRight="1px solid #282828" paddingY="4px">
                    <TelephoneField
                      format="## #####-####"
                      mask="_"
                      value={newNumber?.number}
                      onValueChange={(values: NumberFormatValues) => {
                        setNewNumber(oldValue => ({
                          ...oldValue,
                          number: values.formattedValue,
                        }));
                      }}
                    />
                  </Flex>

                  <Flex w="100%" borderRight="1px solid #282828" paddingY="4px">
                    <Checkbox
                      name="receive_only_company_sales"
                      isChecked={newNumber?.restricted_to_especific_company}
                      onChange={_e => {
                        setNewNumber(oldValue => ({
                          ...oldValue,
                          restricted_to_especific_company: !oldValue.restricted_to_especific_company,
                        }));
                      }}
                    />
                  </Flex>

                  <Flex w="100%">
                    <Select
                      bg="#383838"
                      borderColor="#282828"
                      value={newNumber?.company_id}
                      placeholder="Concessionária"
                      isDisabled={!newNumber?.restricted_to_especific_company}
                      onChange={e => {
                        setNewNumber(odValue => ({
                          ...odValue,
                          company: e?.target?.value,
                        }));
                      }}
                    >
                      {companiesOptions.map(company => (
                        <option key={company.value} value={company.value}>
                          {company.label}
                        </option>
                      ))}
                    </Select>
                  </Flex>

                  <Flex justifyContent="space-between">
                    <PseudoBox
                      cursor="pointer"
                      _hover={{ color: 'red.500' }}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      onClick={handleAddNumber}
                    >
                      <FiSave size={18} />
                    </PseudoBox>
                    <PseudoBox
                      cursor="pointer"
                      _hover={{ color: 'red.500' }}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      onClick={() => setCreateNumberMode(false)}
                    >
                      <FiXSquare size={18} />
                    </PseudoBox>
                  </Flex>
                </>
              )}
            </Grid>

            <Flex alignItems="center" justifyContent="flex-end" flex={1} mt={8}>
              <Button
                variantColor="green"
                leftIcon={FiPlus}
                onClick={() => {
                  setCreateNumberMode(true);
                }}
              >
                Adicionar número
              </Button>
            </Flex>
          </StyledStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default WhatsappNumbersDrawer;
