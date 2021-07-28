import React from 'react';

import { Button as ChakraButton, ButtonProps } from '@chakra-ui/core';

interface IButtonProps extends ButtonProps {
  skipButton?: boolean;
}

const Button: React.FC<IButtonProps> = ({
  onClick,
  skipButton,
  type,
  children,
  ...rest
}) => (
  <ChakraButton
    backgroundColor={skipButton ? '#222222' : '#355a9d'}
    color={skipButton ? '#fff' : '#fff'}
    height="56px"
    borderRadius="md"
    border={0}
    padding="0 16px"
    fontSize="18px"
    width="100%"
    fontWeight="bold"
    marginTop="16px"
    _hover={{
      bg: '#5580b9',
    }}
    _focusWithin={{
      border: 0,
    }}
    _disabled={{
      cursor: 'not-allowed',
      background: '#2d5181',
      color: '#ccc',
    }}
    onClick={onClick}
    type={type}
    {...rest}
  >
    {children}
  </ChakraButton>
);

export default Button;
