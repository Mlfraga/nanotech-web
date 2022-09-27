import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { FiEdit2 } from 'react-icons/fi';
import { MdPassword } from 'react-icons/md';

import {
  Button as ChakraButton,
  Skeleton,
  Stack,
  Tooltip,
  Switch,
} from '@chakra-ui/core';

import Breadcrumb from '../../components/Breadcrumb';
import Button from '../../components/Button';
import AlertDialog from '../../components/Dialogs/Alert';
import Menu from '../../components/Menu';
import CreateUserModal from '../../components/Modals/CreateUser';
import UpdateUserModal from '../../components/Modals/UpdateUserData';
import { useToast } from '../../context/toast';
import { IUser } from '../../interfaces/users';
import api from '../../services/api';
import getUserRoleTranslated from '../../utils/getUserRoleTranslated';
import {
  Container,
  Content,
  ButtonContainer,
  List,
  Box,
  CellContainer,
} from './styles';

interface IFetchedUser {
  id: string;
  email: string;
  enabled: boolean;
  role: string;
  telephone: string;
  username: string;
  profile: {
    id: string;
    name: string;
    company: { name: string; id: string };
  };
}

interface IFormattedUser {
  id: string;
  name: string;
  telephone: string;
  role: string;
  companyName?: string;
  enabled: boolean;
  login: string;
  update_user_button: JSX.Element;
  reset_pass_button: JSX.Element;
}

interface IDisabledService {
  id: string;
  enabled: boolean;
}

const UsersByUnits = () => {
  const { addToast } = useToast();

  const [users, setUsers] = useState<IFetchedUser[]>([]);
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
  const [openCreateUserModal, setOpenCreateUserModal] = useState<boolean>(
    false,
  );
  const [userToResetPassword, setUserToResetPassword] = useState<IUser>();

  const [userToUpdate, setUserToUpdate] = useState<IUser | undefined>(
    undefined,
  );

  const fetchUsers = useCallback(() => {
    setLoading(true);

    api.get('users').then(response => {
      const fetchedProfiles: IFetchedUser[] = response.data;

      setUsers(fetchedProfiles);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenUpdateUserData = useCallback((user: IUser) => {
    setUserToUpdate(user);
  }, []);

  const handleCloseUpdateUserModal = useCallback(() => {
    setUserToUpdate(undefined);
  }, []);

  const handleResetPassoword = useCallback(async () => {
    if (userToResetPassword) {
      try {
        await api.patch(`users/reset-password/${userToResetPassword.id}`);

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

  const formattedUsers: IFormattedUser[] = useMemo(
    () =>
      users.map(user => ({
        id: user.id,
        name: user.profile.name,
        login: user.username,
        companyName: user.profile?.company?.name,
        role: getUserRoleTranslated(user.role),
        enabled: user.enabled,
        telephone: user.telephone,
        update_user_button: (
          <Tooltip
            aria-label="Alterar dados do usuário"
            label="Alterar dados do usuário"
          >
            <ChakraButton
              onClick={() =>
                handleOpenUpdateUserData({
                  id: user.profile.id,
                  name: user.profile.name,
                  user,
                })
              }
              _hover={{
                backgroundColor: '#404040',
                color: '#ccc',
                border: 0,
              }}
              _focusWithin={{ border: 0 }}
              background="#424242"
            >
              <FiEdit2 />
            </ChakraButton>
          </Tooltip>
        ),
        reset_pass_button: (
          <Tooltip
            aria-label="Resetar senha do usuário"
            label="Resetar senha do usuário"
          >
            <ChakraButton
              onClick={() => {
                setResetPassDialogOpened(true);
                setUserToResetPassword({
                  id: user.id,
                  name: user.profile.name,
                  user,
                });
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
            </ChakraButton>
          </Tooltip>
        ),
      })),
    [users, handleOpenUpdateUserData],
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

    fetchUsers();
    setDisableUserAlertOpened(false);
    setDisableUser(
      {} as {
        id: string;
        enabled: boolean;
      },
    );
  }, [disableUser, addToast, fetchUsers]);

  return (
    <Container>
      <Menu />

      <Breadcrumb text="Usuários" />
      <Content
        marginLeft="auto"
        marginRight="auto"
        width="100%"
        marginTop="26px"
        maxWidth="90vw"
      >
        <div className="boxTitle">
          <span>Nome</span>
          <span>Login</span>
          <span>Concessionária</span>
          <span>Cargo</span>
          <span>Ativo</span>
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
              {formattedUsers.map(user => (
                <Box key={user.id}>
                  <div className="header" style={{ borderRadius: 15 }}>
                    <CellContainer>
                      <span>{user.name}</span>
                    </CellContainer>

                    <CellContainer>
                      <span>{user.login}</span>
                    </CellContainer>

                    <CellContainer>
                      <span>{user.companyName}</span>
                    </CellContainer>

                    <CellContainer>
                      <span>{user.role}</span>
                    </CellContainer>

                    <Switch
                      id="enabled"
                      isChecked={user.enabled}
                      color="green"
                      onClick={_e => {
                        setDisableUserAlertOpened(true);
                        setDisableUser({
                          id: user.id,
                          enabled: !user.enabled,
                        });
                      }}
                    />

                    <CellContainer>{user.update_user_button}</CellContainer>

                    <CellContainer>{user.reset_pass_button}</CellContainer>
                  </div>
                </Box>
              ))}
            </List>
          </>
        )}

        <ButtonContainer>
          <Button
            onClick={() => {
              setOpenCreateUserModal(true);
            }}
          >
            Adicionar Novo Usuário
          </Button>
        </ButtonContainer>
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

      <CreateUserModal
        isOpen={openCreateUserModal}
        onClose={() => setOpenCreateUserModal(false)}
        onSave={() => {
          fetchUsers();

          setOpenCreateUserModal(false);
        }}
      />
      <UpdateUserModal
        isOpen={!!userToUpdate}
        onClose={handleCloseUpdateUserModal}
        onSave={fetchUsers}
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
