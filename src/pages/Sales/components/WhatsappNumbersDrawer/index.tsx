import React, { useCallback, useEffect, useState } from 'react';
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
  company_id?: string;
  restricted_to_especific_company: boolean;
}

type IWhatsappNumbersDrawerProps = Omit<IDrawer, 'children'>;

const WhatsappNumbersDrawer: React.FC<IWhatsappNumbersDrawerProps> = ({
  ...rest
}) => {
  const numbersListContainerRef = React.useRef<HTMLDivElement>(null);

  const { addToast } = useToast();

  const [companiesOptions, setCompaniesOptions] = useState<ISelectOption[]>([]);
  const [newNumber, setNewNumber] = useState<INumber>({
    restricted_to_especific_company: false,
  } as INumber);
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
      setNumbers(
        response.data.map(n => ({ ...n, number: n.number.replace('+55', '') })),
      );
    });
  }, []);

  const validate = useCallback((): boolean => {
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
      newNumber?.number?.replace('_', '').length !== 12;
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
  }, [numbers, addToast, newNumber]);

  const handleAddNumber = () => {
    const isValid = validate();

    if (isValid) {
      setCreateNumberMode(false);
      setNumbers([
        ...numbers,
        { ...newNumber, id: String(numbers.length + 1) },
      ]);

      setNewNumber({
        restricted_to_especific_company: false,
      } as INumber);
    }
  };

  const handleUpdateValue = ({
    fieldName,
    value,
    numberId,
  }: {
    fieldName: 'number' | 'company_id' | 'restricted_to_especific_company';
    value: string | boolean;
    numberId: string;
  }) => {
    const newList = numbers.map(n =>
      n.id === numberId
        ? {
            ...n,
            [fieldName]: value,
            ...(fieldName === 'restricted_to_especific_company' &&
              value === false && { company_id: '' }),
          }
        : n,
    );

    setNumbers(newList);
  };

  const handleChangeValue = ({
    fieldName,
    value,
  }: {
    fieldName: 'number' | 'company_id' | 'restricted_to_especific_company';
    value: string | boolean;
  }) => {
    setNewNumber({ ...newNumber, [fieldName]: value });
  };

  const handleCancelNumberCreation = () => {
    setCreateNumberMode(false);
    setNewNumber({
      restricted_to_especific_company: false,
    } as INumber);
  };

  const handleOpenCreateNumberMode = () => {
    setCreateNumberMode(true);

    setTimeout(() => {
      numbersListContainerRef.current?.scrollTo({
        top: numbersListContainerRef.current?.scrollHeight,
        behavior: 'auto',
      });
    }, 100);
  };

  const handleSaveNumbers = () => {
    const formattedNumbers = numbers.map(n => ({
      number: String(n.number).replace(' ', '').replace('-', ''),
      restricted_to_especific_company: n.restricted_to_especific_company,
      company_id:
        typeof n.company_id === 'string' && n?.company_id?.length <= 1
          ? null
          : n.company_id,
    }));

    const payload = {
      numbers: formattedNumbers,
    };

    api
      .post('/whatsapp-numbers', payload)
      .then(() => {
        addToast({
          type: 'success',
          title: 'Sucesso',
          description: 'Números salvos com sucesso',
        });
      })
      .catch(() => {
        addToast({
          type: 'error',
          title: 'Erro ao salvar números',
          description: 'Ocorreu um erro ao salvar os números',
        });
      });
  };

  const handleRemoveNumber = (numberId: string) => {
    const newList = numbers.filter(n => n.id !== numberId);

    setNumbers(newList);
  };

  return (
    <Drawer {...rest}>
      <DrawerOverlay />
      <DrawerContent overflowY="auto" bg="#383838" minW={800}>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">
          Números a receber vendas por Whatsapp
        </DrawerHeader>

        <DrawerBody mt={6} flex={1} display="flex">
          <StyledStack flex={1} display="flex" paddingX={2}>
            <Grid templateColumns="25% 25% 30% 6%" gap="2%">
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

            <Flex
              ref={numbersListContainerRef}
              className="numbers-list"
              mt="16px"
              direction="column"
              overflow="auto"
              height={{
                xs: '180px',
                sm: '180px',
                md: '180px',
                lg: '400px',
                xl: '400px',
              }}
            >
              {numbers.map(number => (
                <Grid templateColumns="25% 25% 30% 6%" gap="2%">
                  <Flex
                    key={number.id}
                    w="100%"
                    borderRight="1px solid #282828"
                    paddingY="4px"
                  >
                    <TelephoneField
                      format="## ####-####"
                      mask="_"
                      value={number.number}
                      onValueChange={(values: NumberFormatValues) => {
                        handleUpdateValue({
                          fieldName: 'number',
                          value: values.formattedValue,
                          numberId: number.id,
                        });
                      }}
                    />
                  </Flex>

                  <Flex w="100%" borderRight="1px solid #282828" paddingY="4px">
                    <Checkbox
                      name="receive_only_company_sales"
                      isChecked={number.restricted_to_especific_company}
                      onChange={e => {
                        handleUpdateValue({
                          fieldName: 'restricted_to_especific_company',
                          value: e.target.checked,
                          numberId: number.id,
                        });
                      }}
                    ></Checkbox>
                  </Flex>

                  <Flex w="100%">
                    <Select
                      bg="#383838"
                      borderColor="#282828"
                      value={number?.company_id}
                      onChange={e => {
                        handleUpdateValue({
                          fieldName: 'company_id',
                          value: e.target.value,
                          numberId: number.id,
                        });
                      }}
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
                    onClick={() => handleRemoveNumber(number.id)}
                  >
                    <FiTrash size={18} />
                  </PseudoBox>
                </Grid>
              ))}

              {createNumberMode && (
                <Grid templateColumns="25% 25% 30% 6%" gap="2%">
                  <Flex w="100%" borderRight="1px solid #282828" paddingY="4px">
                    <TelephoneField
                      format="## ####-####"
                      mask="_"
                      value={newNumber?.number}
                      onValueChange={(values: NumberFormatValues) => {
                        handleChangeValue({
                          fieldName: 'number',
                          value: values.formattedValue,
                        });
                      }}
                    />
                  </Flex>

                  <Flex w="100%" borderRight="1px solid #282828" paddingY="4px">
                    <Checkbox
                      name="receive_only_company_sales"
                      isChecked={newNumber?.restricted_to_especific_company}
                      onChange={e => {
                        handleChangeValue({
                          fieldName: 'restricted_to_especific_company',
                          value: e.target.checked,
                        });
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
                        handleChangeValue({
                          fieldName: 'company_id',
                          value: e?.target?.value,
                        });
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
                      onClick={handleCancelNumberCreation}
                    >
                      <FiXSquare size={18} />
                    </PseudoBox>
                  </Flex>
                </Grid>
              )}
            </Flex>

            <Flex alignItems="center" mt={8}>
              <Button
                variantColor="transparent"
                onClick={handleOpenCreateNumberMode}
              >
                <FiPlus />
              </Button>
            </Flex>

            <Flex
              alignItems="flex-end"
              justifyContent="flex-end"
              flex={1}
              mt={8}
            >
              <Button variantColor="green" onClick={handleSaveNumbers}>
                Salvar
              </Button>
            </Flex>
          </StyledStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default WhatsappNumbersDrawer;
