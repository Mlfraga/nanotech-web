import React, { useCallback, useState } from 'react';
import { FiPower } from 'react-icons/fi';
import MediaQuery from 'react-responsive';
import { useHistory } from 'react-router-dom';

import { Button, Flex, Image, Tooltip } from '@chakra-ui/core';

import Logo from '../../assets/Nanotech/SmallLogo.png';
import { useAuth } from '../../context/auth';
import Header from '../Header';

// import { Container } from './styles';

interface IButton {
  name: string;
  enable: boolean;
  route: string;
  icon?: JSX.Element;
}
interface ISidebarProps {
  disableButton?: boolean;
}

const Sidebar: React.FC<ISidebarProps> = ({ disableButton = false }) => {
  const history = useHistory();
  const initialSelectedButton = history.location.pathname;
  const [selected, setSelected] = useState(initialSelectedButton);
  const { signOut, buttons } = useAuth();

  const handleClickMenuButon = useCallback(
    (button: IButton) => {
      history.push(button.route);

      setSelected(button.route);
    },
    [history],
  );

  const handleSignout = useCallback(() => {
    history.push('/');

    signOut();
  }, [history, signOut]);

  return (
    <>
      <MediaQuery maxDeviceWidth={1224}>
        <Header disableButtons={disableButton} />
      </MediaQuery>

      <MediaQuery minDeviceWidth={1224}>
        <Flex position="fixed" left={0} top={0} direction="column" width="80px">
          <Flex
            paddingTop={0}
            width="100%"
            alignItems="center"
            justifyContent="center"
            height="8.3vh"
            background="#282828"
            borderBottom="1px solid #545454"
          >
            <Image width={20} src={Logo}></Image>
          </Flex>
          <Flex
            background="#282828"
            direction="column"
            width="100%"
            justifyContent="center"
            alignItems="center"
            height="83.4vh"
          >
            {buttons.map(button => (
              <Tooltip
                key={button.name}
                label={button.name}
                aria-label={button.name}
              >
                <Button
                  isDisabled={disableButton}
                  borderRadius="50%"
                  padding={0}
                  marginBottom={4}
                  background="#323232"
                  _hover={{
                    background: '#454545',
                  }}
                  borderBottom={
                    selected === button.route ? '2px solid #355a9d' : '#323232'
                  }
                  onClick={() => {
                    handleClickMenuButon(button);
                  }}
                >
                  {button?.icon}
                </Button>
              </Tooltip>
            ))}
          </Flex>

          <Flex
            borderTop="1px solid #545454"
            background="#282828"
            width="100%"
            height="8.3vh"
            alignItems="center"
            justifyContent="center"
          >
            <Tooltip label="Sair" aria-label="Sair">
              <Button
                onClick={handleSignout}
                background="transparent"
                _hover={{ background: 'transparent' }}
              >
                <FiPower size={20} color="#fff" />
              </Button>
            </Tooltip>
          </Flex>
        </Flex>
      </MediaQuery>
    </>
  );
};

export default Sidebar;
