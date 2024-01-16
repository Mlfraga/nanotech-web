import React, { useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';

import { Image } from '@chakra-ui/core';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Logo from '../../assets/Nanotech/Logo.png';
import { useAuth } from '../../context/auth';
import { Container, Buttons } from './styles';

interface IHeaderProp {
  disableButtons?: boolean;
}

const Header: React.FC<IHeaderProp> = ({ disableButtons = false }) => {
  const history = useHistory();
  const initialSelectedButton = history.location.pathname;
  const [, setSelected] = useState(initialSelectedButton);
  const { buttons, signOut } = useAuth();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Container>
      <Image width={40} src={Logo}></Image>

      <Buttons direction="row-reverse">
        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <FiMenu size={25} color="#fff" />
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {buttons?.map(button => (
            <Link
              key={button.route}
              to={disableButtons ? '#' : `${button.route}`}
              onClick={() => setSelected(button.route)}
            >
              <MenuItem onClick={() => setSelected(button.route)}>
                {button.name}
              </MenuItem>
            </Link>
          ))}
          <Link to="/" onClick={signOut}>
            <MenuItem onClick={signOut}>Sair</MenuItem>
          </Link>
        </Menu>
      </Buttons>
    </Container>
  );
};

export default Header;
