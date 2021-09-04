import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FaArrowAltCircleDown, FaArrowAltCircleUp } from 'react-icons/fa';
import { FiEdit, FiTag } from 'react-icons/fi';
import { RiAddFill } from 'react-icons/ri';
import { useHistory, Link } from 'react-router-dom';

import {
  Flex as ChakraFlex,
  Button as ChakraButton,
  Tooltip,
  Skeleton,
  Stack,
  Flex,
} from '@chakra-ui/core';

import Breadcrumb from '../../components/Breadcrumb';
import Button from '../../components/Button';
import Menu from '../../components/Menu';
import UpdateCompanyModal from '../../components/Modals/UpdateCompany';
import UpdateUnitModal from '../../components/Modals/UpdateUnit';
import { ICompany, IFormattedCompany } from '../../interfaces/companies';
import { IUnit } from '../../interfaces/unit';
import api from '../../services/api';
import { Container, Content, Separator, List, Box } from './styles';

const Companies = () => {
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [openedCompanies, setOpenedCompanies] = useState<number[]>([]);

  const [companyToUpdate, setCompanyToUpdate] = useState<ICompany | undefined>(
    undefined,
  );

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
    (id: number) => {
      setOpenedCompanies([...openedCompanies, id]);
    },
    [openedCompanies],
  );

  const handleCloseCompanies = useCallback(
    (id: number) => {
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
          <Flex justifyContent="space-between">
            <Tooltip
              aria-label="Alterar dados da concessionária"
              label="Alterar dados da concessionária"
            >
              <ChakraButton
                onClick={() => handleOpenUpdateCompanyModal(company)}
                _hover={{ background: '#353535', border: 0 }}
                _focusWithin={{ border: 0 }}
                background="#282828"
              >
                <FiEdit />
              </ChakraButton>
            </Tooltip>
            <Tooltip
              aria-label="Visualizar preços da concessionária"
              label="Visualizar preços da concessionária"
            >
              <ChakraButton
                onClick={() => history.push(`company/prices/${company.id}`)}
                _hover={{
                  background: '#353535',
                  border: 0,
                  marginLeft: '12px',
                }}
                _focusWithin={{ border: 0 }}
                background="#282828"
              >
                <FiTag color="#fff" />
              </ChakraButton>
            </Tooltip>
          </Flex>
        ),
        units: company.unities.map(unit => ({
          id: unit.id,
          name: unit.name,
          telephone: unit.telephone,
          client_identifier: unit.client_identifier,
          button: (
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
                _focusWithin={{ border: 0 }}
                background="#424242"
              >
                <FiEdit />
              </ChakraButton>
            </Tooltip>
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
    <Container>
      <Menu />
      <Breadcrumb text="Concessionárias cadastradas" />
      <Content
        marginLeft="auto"
        marginRight="auto"
        width="100%"
        marginTop="26px"
        maxWidth={{
          xs: '90vw',
          sm: '90vw',
          md: '80vw',
          lg: '78vw',
          xl: '90vw',
        }}
      >
        <Separator>
          <span>Concessionárias</span>
          <div />
        </Separator>

        <div className="boxTitle">
          <span>Nome</span>
          <span>Contato</span>
          <span>CNPJ</span>
          <span>Identificador</span>
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
          <>
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
                    <Link
                      className="createNewCompanyLink"
                      to={`unities-register/?company=${company.id}`}
                    >
                      <RiAddFill size={18} /> Adicionar nova unidade
                    </Link>
                  </div>
                </Box>
              ))}
            </List>
          </>
        )}
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

        <div className="button">
          <Button
            onClick={() => {
              history.push('companies-register');
            }}
          >
            Registrar nova concessionária
          </Button>
        </div>
      </Content>
    </Container>
  );
};

export default Companies;
