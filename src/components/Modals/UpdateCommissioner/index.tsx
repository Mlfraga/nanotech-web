import React, { useCallback, useRef, useState } from 'react';
import { FiPhone } from 'react-icons/fi';

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

import { useEffect } from 'react';
import { useToast } from '../../../context/toast';
import { ICommissioner } from '../../../pages/Commissioners';
import api from '../../../services/api';
import pixKeyTypes from '../../../static/PixKeyTypes';
import getValidationsErrors from '../../../utils/getValidationError';
import FormattedInput from '../../FormattedInput';
import Input from '../../Input';
import Select from '../../Select';

interface IUpdateCommissionerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void | undefined;
  commissioner: ICommissioner;
}

interface IFormData {
  name: string;
  telephone: string;
  pixKeyType: 'RANDOM' | 'CPF' | 'PHONE' | 'EMAIL';
  phonePixKey: string;
  cpfPixKey: string;
  emailPixKey: string;
  randomPixKey: string;
}

const UpdateCommissionerModal: React.FC<IUpdateCommissionerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  commissioner,
}) => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const [pixKeyType, setPixKeyType] = useState<'RANDOM' | 'CPF' | 'PHONE' | 'EMAIL'>();

  useEffect(() => {
    setPixKeyType(commissioner.pix_key_type as 'RANDOM' | 'CPF' | 'PHONE' | 'EMAIL');
  }, [commissioner])

  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(
    async (data: IFormData, { reset }) => {
      setLoading(true);

      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required(
            'Nome do comissionário obrigatório',
          ),
          telephone: Yup.string()
            .required('Telefone do comissionário obrigatório')
            .min(9, 'O telefone deve ter no mínimo 9 dígitos')
            .max(11, 'O telefone deve ter no máximo 11 dígitos'),
            pixKeyType: Yup.string().required('Tipo de chave do PIX do comissionário obrigatório'),
          ...(data.pixKeyType === 'PHONE' && {
            phonePixKey: Yup.string()
            .min(9, 'O telefone deve ter no mínimo 9 dígitos')
            .max(13, 'O telefone deve ter no máximo 11 dígitos').required('Tipo da chave PIX do comissionário obrigatório'),
          }),
          ...(data.pixKeyType === 'CPF' && {
            cpfPixKey: Yup.string().length(11, 'A chave PIX CPF deve ter 11 dígitos').required('Chave PIX do comissionário obrigatório'),
          }),
          ...(data.pixKeyType === 'EMAIL' && {
            emailPixKey: Yup.string().email('A chave PIX email deve ser um email válido').required('Chave PIX do comissionário obrigatório'),
          }),
          ...(data.pixKeyType === 'RANDOM' && {
            randomPixKey: Yup.string().uuid('A chave PIX email deve ser um código válido').required('Chave PIX do comissionário obrigatório'),
          }),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const pix_key = () => {
          switch(data.pixKeyType) {
            case 'CPF':
              return data.cpfPixKey;
            case 'EMAIL':
              return data.emailPixKey;
            case 'PHONE':
              return data.phonePixKey;
            case 'RANDOM':
              return data.randomPixKey;
          }
        }

        const response = await api.patch(`commissioners/${commissioner.id}`, {
          name: data.name,
          pix_key: pix_key(),
          pix_key_type: data.pixKeyType,
          telephone: data.telephone,
          enabled: commissioner.enabled,
        });

        if (response.status === 200) {
          addToast({
            title: 'Atualização realizada com sucesso.',
            type: 'success',
          });

          setLoading(false);
          onClose();
          onSave();
          reset();
        }
      } catch (err) {
        setLoading(false);

        if (err instanceof Yup.ValidationError) {
          const errors = getValidationsErrors(err);

          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          title: 'Não foi possível realizar a atualização.',
          description: 'Tente novamente mais tarde.',
          type: 'error',
        });
      }
    },
    [addToast, onSave, onClose, commissioner.enabled, commissioner.id],
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent backgroundColor="#383838" maxWidth="70%" borderRadius="md">
        <ModalHeader>{`Atualizar informaçōes do comissionário ${commissioner.name}`}</ModalHeader>
        <ModalCloseButton />

        <Form ref={formRef} onSubmit={handleSubmit}>
          <ModalBody paddingBottom={4}>
            <Flex direction="column">
              <Input placeholder="Nome" name="name" defaultValue={commissioner.name} />

              <FormattedInput
                className="commissionerInput"
                id="telephone"
                defaultValue={commissioner.telephone}
                placeholder="Telefone"
                name="telephone"
                format="## #####-####"
                mask="_"
                icon={FiPhone}
              />

              <Select
                fontSize={16}
                height="48px"
                backgroundColor="#1c1c1c"
                color="White"
                defaultValue={commissioner.pix_key_type}
                name="pixKeyType"
                onChange={event => {
                  setPixKeyType(event.target.value as 'RANDOM' | 'CPF' | 'PHONE' | 'EMAIL')
                }}
                placeholder="Selecione o tipo da chave PIX"
                containerProps={{
                  height: '52px',
                  marginBottom: '8px',
                  background: '#1c1c1c',
                }}
              >
                {pixKeyTypes.map(opt => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
              </Select>

              {pixKeyType === 'PHONE' && (
                <FormattedInput
                  id="phonePixKey"
                  placeholder="Chave PIX"
                  name="phonePixKey"
                  format="## #####-####"
                  defaultValue={commissioner.pix_key_type === 'PHONE' ? commissioner.pix_key : undefined}
                  mask="_"
                />
              )}

              {pixKeyType === 'CPF' && (
                <FormattedInput
                  id="cpfPixKey"
                  placeholder="Chave PIX"
                  defaultValue={commissioner.pix_key_type === 'CPF' ? commissioner.pix_key : undefined}
                  name="cpfPixKey"
                  format="###.###.###-##"
                  mask="_"
                />
              )}

              {pixKeyType === 'EMAIL' && (
                <Input
                  disabled={loading}
                  className="input"
                  placeholder="Chave PIX"
                  defaultValue={commissioner.pix_key_type === 'EMAIL' ? commissioner.pix_key : undefined}
                  id="emailPixKey"
                  type="emailPixKey"
                  name="emailPixKey"
                />
              )}

              {pixKeyType === 'RANDOM' && (
                <Input
                  disabled={loading}
                  className="input"
                  placeholder="Chave PIX"
                  id="randomPixKey"
                  defaultValue={commissioner.pix_key_type === 'RANDOM' ? commissioner.pix_key : undefined}
                  type="randomPixKey"
                  name="randomPixKey"
                />
              )}
            </Flex>
          </ModalBody>

          <ModalFooter mt={16}>
            <Button
              variant="ghost"
              onClick={onClose}
              _hover={{ background: '#323232' }}
              marginRight={4}
            >
              Cancelar
            </Button>

            <Button
              isLoading={loading}
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
  );
};

export default UpdateCommissionerModal;
