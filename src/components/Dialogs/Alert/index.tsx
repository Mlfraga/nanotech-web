import React from 'react';

import {
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  AlertDialog,
} from '@chakra-ui/core';

interface IDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onDelete: () => void;
  headerText?: string;
  bodyText?: string;
}

const Dialog: React.FC<IDialogProps> = ({
  isOpen,
  setIsOpen,
  headerText = 'Excluir Registro',
  bodyText = 'Tem certeza que deseja excluir o registro?',
  onDelete,
}) => {
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef() as React.RefObject<HTMLElement>;

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent bg="#303030">
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {headerText}
          </AlertDialogHeader>

          <AlertDialogBody>{bodyText}</AlertDialogBody>

          <AlertDialogFooter>
            <Button
              variantColor="black"
              ref={cancelRef}
              onClick={onClose}
              bg="#3d4756"
            >
              Cancelar
            </Button>
            <Button variantColor="red" onClick={onDelete} ml={3}>
              Excluir
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default Dialog;
