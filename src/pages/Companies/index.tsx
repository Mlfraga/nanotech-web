import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AiOutlineTool } from 'react-icons/ai';
import { FaArrowAltCircleDown, FaArrowAltCircleUp } from 'react-icons/fa';
import { FiEdit } from 'react-icons/fi';
import { RiAddFill } from 'react-icons/ri';
import { useHistory } from 'react-router-dom';

import {
  Button as ChakraButton,
  Flex as ChakraFlex,
  Flex,
  Skeleton,
  Stack,
  Tooltip,
} from '@chakra-ui/core';

import Breadcrumb from '../../components/Breadcrumb';
import CreateCompanyModal from '../../components/Modals/CreateCompany';
import CreateUnitModal from '../../components/Modals/CreateUnit';
import UpdateCompanyModal from '../../components/Modals/UpdateCompany';
import UpdateUnitModal from '../../components/Modals/UpdateUnit';
import { ICompany, IFormattedCompany } from '../../interfaces/companies';
import { IUnit } from '../../interfaces/unit';
import api from '../../services/api';
import { Box, ButtonArea, Content, List, Separator } from './styles';

const Companies = () => {
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [openedCompanies, setOpenedCompanies] = useState<string[]>([]);
  const [
    createCompanyModalIsOpen,
    setCreateCompanyModalIsOpen,
  ] = useState<boolean>(false);

  const [companyToUpdate, setCompanyToUpdate] = useState<ICompany | undefined>(
    undefined,
  );
  const [createUnitModalIsOpen, setCreateUnitModalIsOpen] = useState<boolean>(
    false,
  );
  const [companyToCreateUnit, setCompanyToCreateUnit] = useState<
    IFormattedCompany | undefined
  >(undefined);

  const [unitToUpdate, setUnitToUpdate] = useState<IUnit | undefined>(
    undefined,
  );

  const history = useHistory();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    api.get('companies').then(response => {
      const newCompanies: ICompany[] = response.data;

      setCompanies(newCompanies);
      setLoading(false);
    });
  }, []);

  const getCompanies = useCallback(() => {
    setLoading(true);

    api.get('companies').then(response => {
      const newCompanies: ICompany[] = response.data;

      setCompanies(newCompanies);
      setLoading(false);
    });
  }, []);

  const handleOpenUpdateCompanyModal = useCallback((company: ICompany) => {
    setCompanyToUpdate(company);
  }, []);

  const handleCloseUpdateCompanyModal = useCallback(() => {
    setCompanyToUpdate(undefined);
  }, []);

  const handleOpenCompanies = useCallback(
    (id: string) => {
      setOpenedCompanies([...openedCompanies, id]);
    },
    [openedCompanies],
  );

  const handleCloseCompanies = useCallback(
    (id: string) => {
      const newOpenedCompanies = openedCompanies.filter(
        companyId => companyId !== id,
      );

      setOpenedCompanies(newOpenedCompanies);
    },
    [openedCompanies],
  );

  const handleOpenUpdateUnitData = useCallback((unit: IUnit) => {
    setUnitToUpdate(unit);
  }, []);

  const handleCloseUpdateUnitData = useCallback(() => {
    setUnitToUpdate(undefined);
  }, []);

  const handleCloseCreateCompanyModal = useCallback(
    () => setCreateCompanyModalIsOpen(false),
    [],
  );

  const handleCloseCreateUnitModal = useCallback(
    () => setCreateUnitModalIsOpen(false),
    [],
  );

  const handleOpenCreateCompanyModal = useCallback(() => {
    setCreateCompanyModalIsOpen(true);
  }, []);

  const handleOpenCreateUnitModal = useCallback(
    (company: IFormattedCompany) => {
      setCompanyToCreateUnit(company);
      setCreateUnitModalIsOpen(true);
    },
    [],
  );

  const formattedCompanies: IFormattedCompany[] = useMemo(
    () =>
      companies.map<IFormattedCompany>(company => ({
        id: company.id,
        name: company.name,
        telephone: company.telephone,
        cnpj: company.cnpj.replace(
          /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
          '$1 $2 $3/$4-$5',
        ),
        client_identifier: company.client_identifier,
        buttons: (
          <ButtonArea>
            <Tooltip
              aria-label="Alterar dados da concessionária"
              label="Alterar dados da concessionária"
            >
              <ChakraButton
                onClick={() => handleOpenUpdateCompanyModal(company)}
                _hover={{ background: '#353535', border: 0 }}
                _focusWithin={{ border: 0 }}
                background="#282828"
                flex={1}
                display="flex"
                maxW="50px"
              >
                <FiEdit />
              </ChakraButton>
            </Tooltip>

            <Tooltip
              aria-label="Serviços da concessionária"
              label="Serviços da concessionária"
            >
              <ChakraButton
                onClick={() => history.push(`company/prices/${company.id}`)}
                _hover={{
                  background: '#353535',
                  border: 0,
                }}
                marginLeft="12px"
                _focusWithin={{ border: 0 }}
                background="#282828"
                flex={1}
                display="flex"
                maxW="50px"
              >
                <AiOutlineTool color="#fff" />
              </ChakraButton>
            </Tooltip>
          </ButtonArea>
        ),
        units: company.unities.map(unit => ({
          id: unit.id,
          name: unit.name,
          telephone: unit.telephone,
          client_identifier: unit.client_identifier,
          button: (
            <Flex alignItems="center" justifyContent="center">
              <Tooltip
                aria-label="Alterar dados da unidade"
                label="Alterar dados da unidade"
              >
                <ChakraButton
                  onClick={() => handleOpenUpdateUnitData(unit)}
                  _hover={{
                    backgroundColor: '#404040',
                    color: '#ccc',
                    border: 0,
                  }}
                  w="20px"
                  h="20px"
                  _focusWithin={{ border: 0 }}
                  background="#424242"
                >
                  <FiEdit />
                </ChakraButton>
              </Tooltip>
            </Flex>
          ),
        })),
      })),
    [
      companies,
      history,
      handleOpenUpdateUnitData,
      handleOpenUpdateCompanyModal,
    ],
  );

  return (
    <Flex direction="column" flex={1} w="100%">
      <Breadcrumb
        text="Concessionárias cadastradas"
        filterButton={
          <ChakraButton
            _hover={{
              bg: '#5580b9',
              color: '#fff',
            }}
            _focusWithin={{
              border: 0,
            }}
            backgroundColor="#355a9d"
            style={{ padding: 24 }}
            onClick={handleOpenCreateCompanyModal}
          >
            Registrar nova concessionária
          </ChakraButton>
        }
      />

      <Content width="100%" marginTop={4} maxWidth="90vw" overflowX="auto">
        <div className="boxTitle">
          <span>Nome</span>
          <span>Contato</span>
          <span>CNPJ</span>
          <span>Id</span>
        </div>

        {loading ? (
          <Stack marginTop="16px">
            <Skeleton
              height="60px"
              borderRadius="md"
              colorStart="#505050"
              colorEnd="#404040"
              marginTop="8px"
            />
            <Skeleton
              height="60px"
              borderRadius="md"
              colorStart="#505050"
              colorEnd="#404040"
              marginTop="8px"
            />
            <Skeleton
              height="60px"
              borderRadius="md"
              colorStart="#505050"
              colorEnd="#404040"
              marginTop="8px"
            />
            <Skeleton
              height="60px"
              borderRadius="md"
              colorStart="#505050"
              colorEnd="#404040"
              marginTop="8px"
            />
            <Skeleton
              height="60px"
              borderRadius="md"
              colorStart="#505050"
              colorEnd="#404040"
              marginTop="8px"
            />
            <Skeleton
              height="60px"
              borderRadius="md"
              colorStart="#505050"
              colorEnd="#404040"
              marginTop="8px"
            />
            <Skeleton
              height="60px"
              borderRadius="md"
              colorStart="#505050"
              colorEnd="#404040"
              marginTop="8px"
            />
          </Stack>
        ) : (
          <List height={{ lg: '40vh', xl: '55vh' }}>
            {formattedCompanies.map(company => (
              <Box key={company.id}>
                <div
                  className="header"
                  style={
                    openedCompanies.includes(company.id)
                      ? { borderRadius: '15px 15px 0 0' }
                      : { borderRadius: 15 }
                  }
                >
                  <span>{company.name}</span>
                  <span>{company.telephone}</span>
                  <span>{company.cnpj}</span>
                  <span>{company.client_identifier}</span>
                  {company.buttons}

                  <ChakraFlex marginRight={8} justifyContent="flex-end">
                    {openedCompanies.includes(company.id) ? (
                      <FaArrowAltCircleUp
                        onClick={() => handleCloseCompanies(company.id)}
                        style={{ cursor: 'pointer', alignContent: 'right' }}
                        size={26}
                      />
                    ) : (
                      <FaArrowAltCircleDown
                        onClick={() => handleOpenCompanies(company.id)}
                        style={{ cursor: 'pointer', alignSelf: 'right' }}
                        size={26}
                      />
                    )}
                  </ChakraFlex>
                </div>

                <div
                  className="dropDown"
                  hidden={!openedCompanies.includes(company.id)}
                >
                  <Separator className="separator">
                    <span>Unidades</span>
                    <div />
                  </Separator>

                  <div className="title">
                    <span>Nome</span>
                    <span>Telefone</span>
                    <span>Identificador</span>
                  </div>

                  {company.units.map(unit => (
                    <div className="unit" key={unit.id}>
                      <span>{unit.name}</span>
                      <span>{unit.telephone}</span>
                      <span>{unit.client_identifier}</span>
                      {unit.button}
                    </div>
                  ))}

                  <button
                    className="createNewCompanyLink"
                    onClick={() => handleOpenCreateUnitModal(company)}
                  >
                    <RiAddFill size={18} /> Adicionar nova unidade
                  </button>
                </div>
              </Box>
            ))}
          </List>
        )}
      </Content>

      <CreateCompanyModal
        isOpen={!!createCompanyModalIsOpen}
        onClose={handleCloseCreateCompanyModal}
        onSave={getCompanies}
      />

      <CreateUnitModal
        isOpen={!!createUnitModalIsOpen}
        onClose={handleCloseCreateUnitModal}
        onSave={getCompanies}
        company={companyToCreateUnit}
      />

      <UpdateUnitModal
        isOpen={!!unitToUpdate}
        onClose={handleCloseUpdateUnitData}
        onSave={getCompanies}
        unit={unitToUpdate}
      />

      <UpdateCompanyModal
        isOpen={!!companyToUpdate}
        onClose={handleCloseUpdateCompanyModal}
        onSave={getCompanies}
        company={companyToUpdate}
      />
    </Flex>
  );
};

export default Companies;
