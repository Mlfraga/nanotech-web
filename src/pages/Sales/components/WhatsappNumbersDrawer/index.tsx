import React, { useEffect, useRef, useState } from 'react';
import { FiTrash } from 'react-icons/fi';

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
} from '@chakra-ui/core';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import { ISelectOption } from '../../../../components/Select';
import { ICompany } from '../../../../interfaces/companies';
import api from '../../../../services/api';
import { TelephoneField, StyledStack } from './styles';

interface INumber {
  id: string;
  number: string;
  company: ICompany;
  restricted_to_especific_company: boolean;
}

type IWhatsappNumbersDrawerProps = Omit<IDrawer, 'children'>;

const WhatsappNumbersDrawer: React.FC<IWhatsappNumbersDrawerProps> = ({
  ...rest
}) => {
  const formRef = useRef<FormHandles>(null);

  const [companiesOptions, setCompaniesOptions] = useState<ISelectOption[]>([]);
  const [numbers, setNumbers] = useState<INumber[]>([]);

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
      console.log(response.data);
      setNumbers(response.data);
    });
  }, []);

  return (
    <Drawer {...rest}>
      <DrawerOverlay />
      <DrawerContent bg="#383838" minW={800}>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">
          Números a receber vendas por Whatsapp
        </DrawerHeader>

        <Form
          style={{ display: 'flex', flex: 1, flexDirection: 'column' }}
          ref={formRef}
          onSubmit={data => console.log('data', data)}
        >
          <DrawerBody mt={6}>
            <StyledStack paddingX={2}>
              <Grid templateColumns="15% 25% 20% 30%" gap="2%" pr={4}>
                <Text> </Text>
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
              </Grid>

              <Grid
                className="numbers-list"
                mt="16px"
                pr={2}
                templateColumns="15% 25% 20% 30%"
                gap="2%"
                overflowY="scroll"
                maxH="70vh"
              >
                {numbers.map(number => (
                  <>
                    <PseudoBox
                      cursor="pointer"
                      _hover={{ color: 'red.500' }}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <FiTrash size={16} />
                    </PseudoBox>
                    <Flex
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

                    <Flex
                      w="100%"
                      borderRight="1px solid #282828"
                      paddingY="4px"
                    >
                      <Checkbox
                        name="receive_only_company_sales"
                        isChecked={number.restricted_to_especific_company}
                      ></Checkbox>
                    </Flex>

                    <Flex w="100%">
                      <Select
                        bg="#383838"
                        borderColor="#282828"
                        value={number?.company?.id}
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
                  </>
                ))}
              </Grid>
            </StyledStack>
          </DrawerBody>
        </Form>
      </DrawerContent>
    </Drawer>
  );
};

export default WhatsappNumbersDrawer;
