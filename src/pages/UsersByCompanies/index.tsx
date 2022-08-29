import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { FaArrowAltCircleDown, FaArrowAltCircleUp } from 'react-icons/fa';
import { FiEdit2 } from 'react-icons/fi';
import { MdPassword } from 'react-icons/md';
import { RiAddFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';

import { Button, Skeleton, Stack, Tooltip, Switch } from '@chakra-ui/core';

import Breadcrumb from '../../components/Breadcrumb';
import AlertDialog from '../../components/Dialogs/Alert';
import Menu from '../../components/Menu';
import UpdateUserModal from '../../components/Modals/UpdateUserData';
import { useToast } from '../../context/toast';
import { IUser } from '../../interfaces/users';
import api from '../../services/api';
import getUserRoleTranslated from '../../utils/getUserRoleTranslated';
import {
  Container,
  Content,
  Separator,
  List,
  Box,
  AddNewUserLinkContainer,
} from './styles';

interface IFormatRow {
  id: string;
  name: string;
  telephone: string;
  profiles: IProfile[];
}

interface IProfile {
  id: string;
  name: string;
  telephone: string;
  user: {
    id: string;
    role: string;
    telephone: string;
    enabled: boolean;
    username: string;
  };
}

interface IFormattedUser {
  id: string;
  name: string;
  telephone: string;
  role: string;
  enabled: boolean;
  user_id: string;
  username: string;
  update_button: JSX.Element;
  reset_pass_button: JSX.Element;
}

interface IFormattedCompany {
  id: string;
  name: string;
  telephone: string;
  users: IFormattedUser[];
}

interface IDisabledService {
  id: string;
  enabled: boolean;
}

const UsersByUnits = () => {
  const { addToast } = useToast();

  const [companies, setCompanies] = useState<IFormatRow[]>([]);
  const [openedCompanies, setOpenedCommpanies] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [disableUserAlertOpened, setDisableUserAlertOpened] = useState<boolean>(
    false,
  );
  const [disableUser, setDisableUser] = useState<IDisabledService>(
    {} as IDisabledService,
  );
  const [resetPassDialogOpened, setResetPassDialogOpened] = useState<boolean>(
    false,
  );
  const [userToResetPassword, setUserToResetPassword] = useState<IProfile>();

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
    getCompaniesByUsers();
  }, [getCompaniesByUsers]);

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

  const handleResetPassoword = useCallback(async () => {
    if (userToResetPassword) {
      try {
        await api.patch(`users/reset-password/${userToResetPassword.user.id}`);

        addToast({
          title: 'Senha do usuário resetada com sucesso.',
          type: 'success',
          description:
            'No próximo login, o usuário poderá informar sua nova senha.',
        });

        setResetPassDialogOpened(false);
        setUserToResetPassword(undefined);
      } catch (_err) {
        addToast({
          title:
            'Ocorreu um erro ao tentar resetar a senha, por favor entre em contato com o suporte',
          type: 'error',
        });
      }
    }
  }, [userToResetPassword, addToast]);

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
            enabled: profile.user.enabled,
            user_id: profile.user.id,
            username: profile.user.username,
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
            reset_pass_button: (
              <Tooltip
                aria-label="Resetar senha do usuário"
                label="Resetar senha do usuário"
              >
                <Button
                  onClick={() => {
                    setResetPassDialogOpened(true);
                    setUserToResetPassword(profile);
                  }}
                  _hover={{
                    backgroundColor: '#404040',
                    color: '#ccc',
                    border: 0,
                  }}
                  _focusWithin={{ border: 0 }}
                  background="#424242"
                >
                  <MdPassword />
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

  const toggleEnabled = useCallback(async () => {
    const methodType = disableUser.enabled ? 'enable' : 'disable';

    const { status } = await api.patch(`users/${methodType}/${disableUser.id}`);

    if (status === 202) {
      addToast({
        title: `Usuário ${
          methodType === 'enable' ? 'Ativado' : 'Desativado'
        } com sucesso.`,
        type: 'success',
      });
    }

    getCompaniesByUsers();
    setDisableUserAlertOpened(false);
    setDisableUser(
      {} as {
        id: string;
        enabled: boolean;
      },
    );
  }, [disableUser, addToast, getCompaniesByUsers]);

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

                    <AddNewUserLinkContainer>
                      <Link
                        className="createNewCompanyLink"
                        to={`users-register/?company=${company.id}`}
                      >
                        <RiAddFill size={18} />
                        Adicionar novo usuário a essa concessionária
                      </Link>
                    </AddNewUserLinkContainer>

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
                      <span>Login</span>
                      <span>Telefone</span>
                      <span>Cargo</span>
                      <span>Ativo</span>
                    </div>

                    {company.users.map(person => (
                      <div className="person" key={person.id}>
                        <span>{person.name}</span>

                        <span>{person.username}</span>

                        <span>{person.telephone}</span>

                        <span>{getUserRoleTranslated(person.role)}</span>

                        <Switch
                          id="enabled"
                          isChecked={person.enabled}
                          color="green"
                          onClick={_e => {
                            setDisableUserAlertOpened(true);
                            setDisableUser({
                              id: person.user_id,
                              enabled: !person.enabled,
                            });
                          }}
                        />
                        <div className="buttons">
                          {person.update_button}
                          {person.reset_pass_button}
                        </div>
                      </div>
                    ))}
                  </div>
                </Box>
              ))}
            </List>
          </>
        )}
      </Content>

      <AlertDialog
        isOpen={disableUserAlertOpened}
        onConfirm={toggleEnabled}
        setIsOpen={setDisableUserAlertOpened}
        headerText={
          disableUser.enabled ? 'Ativar Usuário' : 'Desativar Usuário'
        }
        bodyText={
          disableUser.enabled
            ? 'Tem Certeza Que Deseja Ativar Usuário?'
            : 'Tem Certeza Que Deseja Desativar Usuário?'
        }
        confirmButtonVariantColor={disableUser.enabled ? 'green' : 'red'}
        saveText={disableUser.enabled ? 'Ativar' : 'Desativar'}
      />

      <UpdateUserModal
        isOpen={!!userToUpdate}
        onClose={handleCloseUpdateUserModal}
        onSave={getCompaniesByUsers}
        user={userToUpdate}
      />
      <AlertDialog
        isOpen={resetPassDialogOpened}
        onConfirm={handleResetPassoword}
        setIsOpen={setResetPassDialogOpened}
        headerText="Resetar senha"
        bodyText={`Tem certeza que deseja resetar a senha do(a) ${userToResetPassword?.name}?`}
      />
    </Container>
  );
};

export default UsersByUnits;
