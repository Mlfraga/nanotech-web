import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FiEdit2, FiFilter } from 'react-icons/fi';

import {
  Button as ChakraButton, Flex,
  Skeleton, Stack, Switch, Tooltip
} from '@chakra-ui/core';
import AlertDialog from '../../components/Dialogs/Alert';

import { MdPassword } from 'react-icons/md';
import Breadcrumb from '../../components/Breadcrumb';
import Menu from '../../components/Menu';
import CreateUserModal from '../../components/Modals/CreateUser';
import UpdateUserModal from '../../components/Modals/UpdateUserData';
import { useToast } from '../../context/toast';
import { IUser } from '../../interfaces/users';
import api from '../../services/api';
import getUserRoleTranslated from '../../utils/getUserRoleTranslated';
import FilterUserModal, { IUserFilters } from './components/FilterDrawer';
import {
  Container,
  Content,
  List,
  Row
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

const Users = () => {
  const { addToast } = useToast();

  const [users, setUsers] = useState<IFetchedUser[]>([]);
  const [filterDrawerOpened, setFilterDrawerOpened] = useState<boolean>(false);
  const [filterValues, setFilterValues] = useState<IUserFilters>({} as IUserFilters);
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

  const fetchUsers = useCallback((filters: IUserFilters) => {
    setLoading(true);

    api.get('users', {
      params: {
        ...(filters?.name && { name: filters.name }),
        ...(filters?.role && { role: filters.role }),
        ...(filters?.telephone && { telephone: filters.telephone }),
        ...(filters?.company_id && { company_id: filters.company_id }),
        ...(filters?.enabled !== undefined && filters.enabled.length > 0 && { enabled: filters.enabled === 'true' ? true : false }),
      }
    }).then(response => {
      const fetchedProfiles: IFetchedUser[] = response.data;

      setUsers(fetchedProfiles);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    fetchUsers({});
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
              mr={2}
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

    fetchUsers({});
    setDisableUserAlertOpened(false);
  }, [disableUser, addToast, fetchUsers]);

  const handleApplyFilters = useCallback((filters: IUserFilters) => {
    setFilterValues(filters);

    fetchUsers(filters);
  }, [fetchUsers]);

  return (
    <Container>
      <Menu />

      <Flex
        direction="column"
        w={{
          xs: '100%',
          sm: '100%',
          md: '100% ',
          lg: 'calc(100% - 80px)',
          xl: '100%',
        }}
        ml={{
          xs: '0px',
          sm: '0px',
          md: '0px',
          lg: '80px',
          xl: '0px',
        }}
        paddingX={8}
      >
        <Breadcrumb text="Usuários" filterButton={
          <Flex>
          <Tooltip label="Filtros" aria-label="Filtros">
            <ChakraButton
              onClick={() => {
                setFilterDrawerOpened(true);
              }}
              mr={2}
              background="#2f5b9c"
              _hover={{
                bg: "#3d65a0"
              }}
            >
              <FiFilter size={20} />
            </ChakraButton>
          </Tooltip>

          <Tooltip label="Criar Novo Contato" aria-label="Criar Novo Contato">
            <ChakraButton
              onClick={() => {
                setOpenCreateUserModal(true);
              }}
              background="#2f5b9c"
              _hover={{
                bg: "#3d65a0"
              }}
            >
              Novo Usuário
            </ChakraButton>
          </Tooltip>
        </Flex>
        } />

        <Content
          marginLeft="auto"
          marginRight="auto"
          width="100%"
          marginTop={4}
          maxWidth="90vw"
          overflowX="auto"
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
              {formattedUsers.map(user => (
                <Row>
                  <span>{user.name}</span>
                  <span>{user.login}</span>
                  <span>{user.companyName}</span>
                  <span>{user.role}</span>

                  <Flex style={{ justifyContent: 'space-between' }}>
                    <Switch
                      id="enabled"
                      isChecked={user.enabled}
                      color="green"
                      onClick={e => {
                        e.preventDefault();

                        setDisableUserAlertOpened(true);
                        setDisableUser({
                          id: user.id,
                          enabled: !user.enabled,
                        });
                      }}
                    />
                  </Flex>

                  <Flex style={{ justifyContent: 'center', marginTop: '0px' }}>
                    {user.update_user_button}
                    {user.reset_pass_button}
                  </Flex>
                </Row>
              ))}
            </List>
          )}
        </Content>
      </Flex>

      <CreateUserModal
        isOpen={openCreateUserModal}
        onClose={() => setOpenCreateUserModal(false)}
        onSave={() => {
          fetchUsers({});

          setOpenCreateUserModal(false);
        }}
      />
      <FilterUserModal
        isOpen={filterDrawerOpened}
        onClose={() => setFilterDrawerOpened(false)}
        close={() => setFilterDrawerOpened(false)}
        initialValues={filterValues}
        applyFilter={handleApplyFilters}
        cleanFilter={() => setFilterValues({} as IUserFilters)}
      />
      <UpdateUserModal
        isOpen={!!userToUpdate}
        onClose={handleCloseUpdateUserModal}
        onSave={() => fetchUsers({})}
        user={userToUpdate}
      />

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

export default Users;
