import React, { useCallback, useRef } from 'react';
import { FiDollarSign } from 'react-icons/fi';

import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/core';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { useToast } from '../../../context/toast';
import { ICompanyPrices } from '../../../pages/CompaniesPrices';
import api from '../../../services/api';
import getValidationErrors from '../../../utils/getValidationError';
import { currencyMasker } from '../../../utils/masks';
import Input from '../../Input';

interface IFormData {
  company_price: number;
}

export interface ICompanyService {
  id: string;
  price: number;
  company_price: number;
  name: string;
}

interface IUpdateCompanyServicePriceModalProps {
  isOpen: boolean;
  onClose: (
    event: React.MouseEvent | React.KeyboardEvent,
    reason?: 'pressedEscape' | 'clickedOverlay',
  ) => void;
  onSave: () => void | undefined;
  selectedCompanyService: ICompanyService;
}

const UpdateCompanyServicePriceModal: React.FC<IUpdateCompanyServicePriceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  selectedCompanyService,
}) => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const handleKeyUp = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      event.preventDefault();
      currencyMasker(event);
    },
    [],
  );

  const handleSubmit = useCallback(
    async (data: IFormData, event) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          company_price: Yup.number().required('Preço obrigatório'),
        });

        await schema.validate(data, { abortEarly: false });

        const response = await api.put(
          `services/${selectedCompanyService.id}`,
          {
            company_price: data.company_price,
          },
        );

        addToast({
          type: 'success',
          title: 'Serviço alterado com sucesso',
        });

        onClose(event);

        onSave();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro ao atualizar o serviço',
          description:
            'Ocorreu um erro ao atualizar dados do serviço, tente novamente.',
        });
      }
    },
    [selectedCompanyService, onClose, onSave, addToast],
  );

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          backgroundColor="#383838"
          maxWidth={900}
          borderRadius="md"
        >
          <ModalHeader>Alterar preço do serviço</ModalHeader>
          <ModalCloseButton />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <ModalBody paddingBottom={4}>
              <Flex direction="column">
                <Input
                  placeholder="Preço Nanotech"
                  name="price"
                  icon={FiDollarSign}
                  defaultValue={Number(selectedCompanyService.price).toFixed(2)}
                  disabled
                />

                <Input
                  placeholder="Preço a ser cobrado"
                  onKeyUp={handleKeyUp}
                  name="company_price"
                  icon={FiDollarSign}
                  defaultValue={Number(
                    selectedCompanyService.company_price,
                  ).toFixed(2)}
                />
              </Flex>
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
              >
                Salvar
              </Button>
            </ModalFooter>
          </Form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateCompanyServicePriceModal;
