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
  ModalOverlay
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
  name: string;
  price: number;
  commission_amount: number;
}

interface IUpdateServicePriceModalProps {
  isOpen: boolean;
  onClose: (
    event: React.MouseEvent | React.KeyboardEvent,
    reason?: 'pressedEscape' | 'clickedOverlay',
  ) => void;
  onSave: () => void | undefined;
  service: ICompanyPrices;
}

const UpdateServicePriceModal: React.FC<IUpdateServicePriceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  service,
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
          name: !data.price
            ? Yup.string().required('Nome obrigatório')
            : Yup.string(),
          price: !data.name
            ? Yup.number().required('Preço obrigatório')
            : Yup.string(),
          commission_amount: Yup.number(),
        });

        await schema.validate(data, { abortEarly: false });

        await api.put(`services/${service.id}`, {
          ...(data.name && { name: data.name }),
          ...(data.price && { price: data.price }),
          commission_amount: data.commission_amount,
        });

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
    [service, onClose, onSave, addToast],
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
          <ModalHeader>Alterar dados do serviço</ModalHeader>
          <ModalCloseButton />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <ModalBody paddingBottom={4}>
              <Flex direction="column">
                <Input
                  placeholder="Nome"
                  name="name"
                  defaultValue={service.name}
                />

                <Input
                  placeholder="Preço Nanotech"
                  onKeyUp={handleKeyUp}
                  name="price"
                  icon={FiDollarSign}
                  defaultValue={Number(service.price).toFixed(2)}
                />

                <Input
                  placeholder="Valor da Comissāo"
                  onKeyUp={handleKeyUp}
                  name="commission_amount"
                  icon={FiDollarSign}
                  defaultValue={Number(service.commission_amount).toFixed(2)}
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

export default UpdateServicePriceModal;
