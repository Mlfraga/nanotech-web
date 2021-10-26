import React, { useRef } from 'react';

import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/core';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import * as Yup from 'yup';

import { ISale } from '../../../interfaces/sales';
import api from '../../../services/api';
import getValidationErrors from '../../../utils/getValidationError';
import Datetime from '../../Datetime';
import Input from '../../Input';
import Select from '../../Select';
import { InputContainer, Label, Row } from './styles';

interface IFormData {
  car: string;
  carPlate: string;
  carModel: string;
  carColor: string;
  comments: string;
  source: string;
  availabilityDate: Date;
  deliveryDate: Date;
}

interface IUpdateSalesModalProps {
  isOpen: boolean;
  onClose: (
    event: React.MouseEvent | React.KeyboardEvent,
    reason?: 'pressedEscape' | 'clickedOverlay',
  ) => void;
  onSave: () => Promise<void>;
  sale?: ISale;
}

const UpdateSalesModal: React.FC<IUpdateSalesModalProps> = ({
  isOpen,
  onClose,
  onSave,
  sale,
}) => {
  const formRef = useRef<FormHandles>(null);
  const toast = useToast();

  const selectOptions: Array<{ value: string; label: string }> = [
    { value: 'NEW', label: '0 KM' },
    { value: 'USED', label: 'Semi-novo' },
    { value: 'WORKSHOP', label: 'Oficina' },
  ];

  console.log(sale?.availability_date, 'data');
  const handleSubmit = async (data: IFormData, event: any) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        car: Yup.string().required('Carro obrigatório'),
        carColor: Yup.string().required('Cor do carro obrigatório'),
        carModel: Yup.string().required('Modelo do carro obrigatório'),
        carPlate: Yup.string()
          .required('Chassi do carro obrigatório')
          .length(7, 'O Chassi deve ter 7 dígitos'),
        source: Yup.string().required('Origem do carro obrigatório'),
        deliveryDate: Yup.string().required('Data de entrega obrigatória'),
        comments: Yup.string(),
        availabilityDate: Yup.string().required(
          'Data de disponibilidade obrigatória',
        ),
      });

      await schema.validate(data, { abortEarly: false });

      await api.put(`sales/${sale?.id}`, {
        ...data,
        deliveryDate: new Date(data.deliveryDate).toISOString(),
        availabilityDate: new Date(data.availabilityDate).toISOString(),
        comments: data.comments.length < 1 ? null : data.comments,
      });

      toast({
        status: 'success',
        title: 'Dados da venda alterados com sucesso',
        position: 'top',
        duration: 3000,
      });

      onClose(event);

      onSave();
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);

        return;
      }

      toast({
        status: 'error',
        title: 'Erro ao atualizar os dados da venda',
        description:
          'Ocorreu um erro ao atualizar os dados da venda, tente novamente.',
        position: 'top',
        duration: 5000,
      });
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          backgroundColor="#383838"
          maxWidth={900}
          borderRadius="md"
        >
          <ModalHeader>
            {`Alterar dados da venda ${`${sale?.seller?.company?.client_identifier}${sale?.unit?.client_identifier}${sale?.client_identifier}`}`}
          </ModalHeader>
          <ModalCloseButton />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <ModalBody paddingBottom={4}>
              <Row>
                <InputContainer>
                  <Label>Carro:</Label>
                  <Input
                    defaultValue={sale?.car?.brand || ''}
                    placeholder="Carro"
                    name="car"
                  />
                </InputContainer>

                <InputContainer>
                  <Label>Placa ou Chassi do Carro:</Label>
                  <Input
                    defaultValue={sale?.car?.plate || ''}
                    placeholder="Placa ou Chassi do Carro"
                    name="carPlate"
                  />
                </InputContainer>

                <InputContainer>
                  <Label>Modelo ou Chassi do Carro:</Label>
                  <Input
                    defaultValue={sale?.car?.model || ''}
                    placeholder="Modelo ou Chassi do Carro"
                    name="carModel"
                  />
                </InputContainer>

                <InputContainer>
                  <Label>Cor do Carro:</Label>
                  <Input
                    defaultValue={sale?.car?.color || ''}
                    placeholder="Cor do Carro"
                    name="carColor"
                  />
                </InputContainer>

                <InputContainer>
                  <Label>Observações:</Label>
                  <Input
                    defaultValue={sale?.comments || ''}
                    placeholder="Observações"
                    name="comments"
                  />
                </InputContainer>

                <InputContainer>
                  <Label>Origem:</Label>
                  <Select
                    height="2.6rem"
                    backgroundColor="#1c1c1c"
                    color="White"
                    name="source"
                    containerProps={{
                      paddingTop: '3px',
                      background: '#1c1c1c',
                      width: '100%',
                      border: '2px solid',
                      borderColor: '#585858',
                    }}
                  >
                    {selectOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Select>
                </InputContainer>

                <InputContainer>
                  <Label>Data de disponibilidade:</Label>
                  <Datetime
                    defaultValue={format(
                      sale?.delivery_date
                        ? new Date(sale?.availability_date)
                        : new Date(),
                      "yyyy'-'MM'-'dd'T'HH:mm",
                      { locale: ptBR },
                    )}
                    name="availabilityDate"
                  />
                </InputContainer>

                <InputContainer>
                  <Label>Data de entrega:</Label>
                  <Datetime
                    defaultValue={format(
                      sale?.delivery_date
                        ? new Date(sale?.delivery_date)
                        : new Date(),
                      "yyyy'-'MM'-'dd'T'HH:mm",
                      { locale: ptBR },
                    )}
                    name="deliveryDate"
                  />
                </InputContainer>
              </Row>
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

export default UpdateSalesModal;
