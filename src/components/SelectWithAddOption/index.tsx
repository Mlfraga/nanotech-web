import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  PseudoBoxProps as ChakraPseudoBoxProps,
  Select as ChakraSelect,
  SelectProps as ChakraSelectProps,
} from '@chakra-ui/core';
import { useField } from '@unform/core';

import { Container } from './styles';
import {
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/core';

interface ISelectProps extends ChakraSelectProps {
  name: string;
  containerProps?: ChakraPseudoBoxProps;
  addOption: (
    value: string,
  ) => Promise<{
    value: string;
    label: string;
  } | null>;
  label: string;
  entityName?: string;
}

export interface ISelectOption {
  value: string;
  label: string;
}

const SelectWithAddOption: React.FC<ISelectProps> = ({
  name,
  children,
  containerProps,
  addOption,
  label,
  entityName,
  ...rest
}) => {
  const selectRef = useRef<HTMLSelectElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const [newOption, setNewOption] = useState('');
  const [addedOptions, setAddedOptions] = useState<ISelectOption[]>([]);

  const { fieldName, defaultValue, error, registerField } = useField(name);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);

    setIsFilled(!!selectRef.current?.value);
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: selectRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  const handleChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.currentTarget.value === 'add-new') {
      event.currentTarget.value = '';
      onOpen();
    }
  };

  const handleAddOption = async () => {
    const formattedNewOption = await addOption(newOption);

    if (formattedNewOption) {
      setAddedOptions(oldValue => [...oldValue, formattedNewOption]);
    }

    setNewOption('');
    onClose();
  };

  return (
    <Container
      isFocused={isFocused}
      isFilled={isFilled}
      isErrored={!!error}
      width="100%"
      height={12}
      borderRadius="md"
      paddingLeft={4}
      onClick={() => {
        selectRef.current?.focus();
      }}
      bg="#424242"
      {...containerProps}
    >
      <ChakraSelect
        defaultValue={defaultValue}
        bg="transparent"
        color="#f4ede8"
        border={0}
        focusBorderColor="none"
        paddingLeft={0}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        ref={selectRef}
        onChange={e => handleChangeSelect(e)}
        {...rest}
      >
        <option value=" "></option>
        <option value="add-new">{`Adicionar ${
          entityName ? entityName : 'Novo Item'
        }`}</option>

        {children}

        {addedOptions.map(option => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </ChakraSelect>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          backgroundColor="#383838"
          maxWidth={600}
          borderRadius="md"
        >
          <ModalHeader>{`Adicionar ${
            entityName ? entityName : 'Novo Item'
          }`}</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <FormControl
              id="new-option"
              style={{ gap: '16px', display: 'flex', flexDirection: 'column' }}
            >
              <FormLabel>{`${
                entityName ? entityName : 'Novo Item'
              }`}</FormLabel>

              <Input
                bg="#1c1c1c"
                border={'2px solid #585858'}
                borderColor="#585858"
                color={'#f4ede8'}
                value={newOption}
                onChange={(e: any) => {
                  setNewOption(e.currentTarget.value as string);
                }}
                placeholder={'Digite o nome do novo item'}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              onClick={onClose}
              _hover={{ background: '#323232' }}
              marginRight={4}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              backgroundColor="#355a9d"
              _hover={{
                backgroundColor: '#5580b9',
              }}
              onClick={handleAddOption}
            >
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default SelectWithAddOption;
