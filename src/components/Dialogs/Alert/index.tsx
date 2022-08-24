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
  onConfirm: () => void;
  headerText?: string;
  bodyText?: string;
  cancelText?: string;
  saveText?: string;
  confirmButtonVariantColor?: string;
}

const Dialog: React.FC<IDialogProps> = ({
  isOpen,
  setIsOpen,
  headerText = 'Excluir Registro',
  bodyText = 'Tem certeza que deseja excluir o registro?',
  cancelText = 'Cancelar',
  saveText = 'Confirmar',
  onConfirm,
  confirmButtonVariantColor = 'red',
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
              {cancelText}
            </Button>
            <Button
              variantColor={confirmButtonVariantColor}
              onClick={onConfirm}
              ml={3}
            >
              {saveText}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default Dialog;
