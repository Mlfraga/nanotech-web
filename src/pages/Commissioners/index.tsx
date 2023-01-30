import React, { useCallback, useEffect, useState } from 'react';

import {
  Button as ChakraButton, Flex,
  Skeleton,
  Stack,
  Switch,
  Tooltip
} from '@chakra-ui/core';
import AlertDialog from '../../components/Dialogs/Alert';

import { FiEdit } from 'react-icons/fi';
import { useParams } from 'react-router';
import Breadcrumb from '../../components/Breadcrumb';
import Button from '../../components/Button';
import Menu from '../../components/Menu';
import CreateCommissionerModal from '../../components/Modals/CreateCommissioner';
import UpdateCommissionerModal from '../../components/Modals/UpdateCommissioner';
import { useToast } from '../../context/toast';
import api from '../../services/api';
import {
  Box, BoxTitle, ButtonArea, ButtonContainer,
  Container,
  Content,
  List,
  ListItem
} from './styles';

interface ICommissionerRouterParams {
  id: string;
}

export interface ICommissioner {
  id: string;
  name: string;
  telephone: string;
  enabled: boolean;
};

const Commissioners = () => {
  const { addToast } = useToast();
  const { id: companyId } = useParams<ICommissionerRouterParams>();

  const [createCommissionerModalOpened, setCreateCommissionerModalOpened] = useState<boolean>(false);
  const [updateCommissionerModalOpened, setUpdateCommissionerModalOpened] = useState<boolean>(false);
  const [commissionerToUpdate, setCommissionerToUpdate] = useState<ICommissioner>({} as ICommissioner);
  const [loading, setLoading] = useState<boolean>(false);
  const [disableCommissionerAlertOpened, setDisableCommissionerAlertOpened] = useState<boolean>(false);
  const [userToToggleEnable, setUserToToggleEnable] = useState<ICommissioner>({} as ICommissioner);
  const [commissioners, setCommissioners] = useState<ICommissioner[]>([]);

  useEffect(() => {
    fetchCommissioners()
  }, []);

  const fetchCommissioners = useCallback(async (): Promise<void> => {
    setLoading(true);

    const response = await api.get<ICommissioner[]>(`/commissioners/${companyId}`);

    setCommissioners(response.data);

    setLoading(false);
  }, []);

  const handleOpenCreateCommissionerModal = useCallback(() => {
    setCreateCommissionerModalOpened(true);
  }, []);

  const handleOpenUpdateCommissionerModal = useCallback((commissioner: ICommissioner) => {
    setUpdateCommissionerModalOpened(true);

    setCommissionerToUpdate(commissioner);
  }, []);

  const handleOpenToggleEnabledDialog = (event: React.MouseEvent<any, MouseEvent>, commissioner: ICommissioner) => {
    event.preventDefault();

    setDisableCommissionerAlertOpened(true);
    setUserToToggleEnable(commissioner);
  };

  const toggleEnabled = useCallback(async () => {
    try {
      await api.patch(`/commissioners/${userToToggleEnable.id}/toggle-enabled`, {enabled: !userToToggleEnable.enabled});

      fetchCommissioners();

      addToast({
        type: 'success',
        title: 'Sucesso',
        description: 'Comissionário atualizado com sucesso',
      });
    }
    catch (err) {
      addToast({
        type: 'error',
        title: 'Erro',
        description: 'Ocorreu um erro ao atualizar o comissionário',
      });
    }

    setDisableCommissionerAlertOpened(false);
  }, [userToToggleEnable]);

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
        <Breadcrumb text="Comissionários cadastrados" />

        <Content
          marginLeft="auto"
          marginRight="auto"
          width="100%"
          marginTop={4}
          maxWidth="90vw"
          overflowX="auto"
        >
          <BoxTitle>
            <span>Nome</span>
            <span>Telefone</span>
            <span>Ativo</span>
          </BoxTitle>

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
                {commissioners.map(commissioner => (
                  <Box key={commissioner.id}>
                    <ListItem>
                      <span>{commissioner.name}</span>
                      <span>{commissioner.telephone}</span>
                      <Switch
                        id="enabled"
                        isChecked={commissioner.enabled}
                        color="green"
                        onClick={e => handleOpenToggleEnabledDialog(e, commissioner)}
                      />
                      <ButtonArea>
                        <Tooltip
                          aria-label="Alterar dados do comissionário"
                          label="Alterar dados do comissionário"
                        >
                          <ChakraButton
                            onClick={() => handleOpenUpdateCommissionerModal(commissioner)}
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
                      </ButtonArea>
                    </ListItem>
                  </Box>
                ))}
              </List>
            </>
          )}
        </Content>
      </Flex>

      <ButtonContainer>
        <Button maxW="300px" onClick={handleOpenCreateCommissionerModal}>
          Registrar novo comissionário
        </Button>
      </ButtonContainer>

      <CreateCommissionerModal
        isOpen={createCommissionerModalOpened}
        company_id={companyId}
        onClose={() => setCreateCommissionerModalOpened(false)}
        onSave={() => {fetchCommissioners()}}
      />

      <UpdateCommissionerModal
        isOpen={updateCommissionerModalOpened}
        commissioner={commissionerToUpdate}
        onClose={() => setUpdateCommissionerModalOpened(false)}
        onSave={() => {fetchCommissioners()}}
      />

      <AlertDialog
        isOpen={disableCommissionerAlertOpened}
        onConfirm={toggleEnabled}
        setIsOpen={setDisableCommissionerAlertOpened}
        headerText={
          userToToggleEnable.enabled ? 'Ativar Comissionário' : 'Desativar Comissionário'
        }
        bodyText={
          userToToggleEnable.enabled
            ? 'Tem Certeza Que Deseja Ativar Comissionário?'
            : 'Tem Certeza Que Deseja Desativar Comissionário?'
        }
      />
    </Container>
  );
};

export default Commissioners;
