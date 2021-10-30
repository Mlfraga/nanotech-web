import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { FaArrowAltCircleDown, FaArrowAltCircleUp } from 'react-icons/fa';
import { FiEdit2 } from 'react-icons/fi';
import { RiAddFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';

import { Button, Skeleton, Stack, Tooltip } from '@chakra-ui/core';

import Breadcrumb from '../../components/Breadcrumb';
import Menu from '../../components/Menu';
import UpdateUserModal from '../../components/Modals/UpdateUserData';
import { IUser } from '../../interfaces/users';
import api from '../../services/api';
import getUserRoleTranslated from '../../utils/getUserRoleTranslated';
import { Container, Content, Separator, List, Box } from './styles';

interface IFormatRow {
  id: string;
  name: string;
  telephone: string;
  profiles: [
    {
      id: string;
      name: string;
      telephone: string;
      user: {
        id: string;
        role: string;
        telephone: string;
      };
    },
  ];
}

interface IFormattedUser {
  id: string;
  name: string;
  telephone: string;
  role: string;
  update_button: JSX.Element;
}

interface IFormattedCompany {
  id: string;
  name: string;
  telephone: string;
  users: IFormattedUser[];
}

const UsersByUnits = () => {
  const [companies, setCompanies] = useState<IFormatRow[]>([]);
  const [openedCompanies, setOpenedCommpanies] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [userToUpdate, setUserToUpdate] = useState<IUser | undefined>(
    undefined,
  );

  const getCompaniesByUsers = useCallback(() => {
    setLoading(true);

    api.get('companies').then(response => {
      const newCompanies: IFormatRow[] = response.data;

      setCompanies(newCompanies);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setLoading(true);

    api.get('companies').then(response => {
      const newCompanies: IFormatRow[] = response.data;

      setCompanies(newCompanies);
      setLoading(false);
    });
  }, []);

  const handleOpenUnities = useCallback(
    (id: string) => {
      setOpenedCommpanies([...openedCompanies, id]);
    },
    [openedCompanies],
  );

  const handleCloseUnities = useCallback(
    (id: string) => {
      const newOpenedUnities = openedCompanies.filter(unitId => unitId !== id);

      setOpenedCommpanies(newOpenedUnities);
    },
    [openedCompanies],
  );

  const handleOpenUpdateUserData = useCallback((user: IUser) => {
    setUserToUpdate(user);
  }, []);

  const handleCloseUpdateUserModal = useCallback(() => {
    setUserToUpdate(undefined);
  }, []);

  const formattedUsersByCompanies: IFormattedCompany[] = useMemo(
    () =>
      companies.map(company => {
        const users: IFormattedUser[] = [];

        company.profiles.forEach(profile => {
          users.push({
            id: profile.id,
            name: profile.name,
            telephone: profile.user.telephone,
            role: profile.user.role,
            update_button: (
              <Tooltip
                aria-label="Alterar dados do usuário"
                label="Alterar dados do usuário"
              >
                <Button
                  onClick={() => handleOpenUpdateUserData(profile)}
                  _hover={{
                    backgroundColor: '#404040',
                    color: '#ccc',
                    border: 0,
                  }}
                  _focusWithin={{ border: 0 }}
                  background="#424242"
                >
                  <FiEdit2 />
                </Button>
              </Tooltip>
            ),
          });
        });

        return {
          id: company.id,
          name: company.name,
          telephone: company.telephone,
          users,
        };
      }),
    [companies, handleOpenUpdateUserData],
  );

  return (
    <Container>
      <Menu />

      <Breadcrumb text="Usuários por concessionária" />
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
          <h3>Concessionária</h3>
          <h3>Telephone</h3>
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
          </Stack>
        ) : (
          <>
            <List height={{ lg: '40vh', xl: '55vh' }}>
              {formattedUsersByCompanies.map(company => (
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
                    <Link
                      className="createNewCompanyLink"
                      to={`users-register/?company=${company.id}`}
                    >
                      <RiAddFill size={18} /> Adicionar novo usuário a essa
                      concessionária
                    </Link>
                    {openedCompanies.includes(company.id) ? (
                      <FaArrowAltCircleUp
                        onClick={() => handleCloseUnities(company.id)}
                        style={{ cursor: 'pointer' }}
                        size={26}
                      />
                    ) : (
                      <FaArrowAltCircleDown
                        onClick={() => handleOpenUnities(company.id)}
                        style={{ cursor: 'pointer' }}
                        size={26}
                      />
                    )}
                  </div>

                  <div
                    className="dropDown"
                    hidden={!openedCompanies.includes(company.id)}
                  >
                    <Separator className="separator">
                      <span>Usuários dessa concessionária</span>
                      <div />
                    </Separator>

                    <div className="title">
                      <span>Nome</span>
                      <span>Telefone</span>
                      <span>Cargo</span>
                    </div>

                    {company.users.map(person => (
                      <div className="person" key={person.id}>
                        <span>{person.name}</span>
                        <span>{person.telephone}</span>
                        <span>{getUserRoleTranslated(person.role)}</span>
                        {person.update_button}
                      </div>
                    ))}
                  </div>
                </Box>
              ))}
            </List>
          </>
        )}
      </Content>

      <UpdateUserModal
        isOpen={!!userToUpdate}
        onClose={handleCloseUpdateUserModal}
        onSave={getCompaniesByUsers}
        user={userToUpdate}
      />
    </Container>
  );
};

export default UsersByUnits;
