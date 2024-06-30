import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FiDollarSign, FiTool, FiX } from 'react-icons/fi';

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
import api from '../../../services/api';
import getValidationsErrors from '../../../utils/getValidationError';
import { currencyMasker } from '../../../utils/masks';
import Input from '../../Input';
import { ICompany } from '../../../interfaces/companies';
import Select from '../../Select';
import Textarea from '../../Textarea';
import {
  LinkToCompaniesContainer,
  LinkToCompaniesTitle,
  RemoveCompanyButton,
  Row,
  SelectedCompaniesContainer,
  SelectedCompaniesHeader,
  SelectedCompaniesHeaderLabel,
  SelectedCompany,
  SelectedCompanyLabel,
  SelectedCompanyValueContainer,
  SelectedCompanyValueInput,
} from './styles';

interface IFormData {
  name: string;
  description: string;
  default_nanotech_price?: number;
}

interface ICompanyToLink {
  id: string;
  name: string;
  price: number;
  commission: number;
}

interface ICreateServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void | undefined;
}

const CreateServiceModal: React.FC<ICreateServiceModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const hasAlreadyExecuted = useRef<boolean>(false);
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const [loading, setLoading] = useState<boolean>(false);
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [companiesToLink, setCompaniesToLink] = useState<ICompanyToLink[]>([]);

  useEffect(() => {
    const fethCompanies = async () => {
      const { data: newCompaniesOptions } = await api.get<ICompany[]>(
        '/companies',
      );

      setCompanies(newCompaniesOptions);
    };

    if (!hasAlreadyExecuted.current) {
      fethCompanies();

      hasAlreadyExecuted.current = true;
    }
  }, []);

  const formatCurrencyValue = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      event.preventDefault();
      currencyMasker(event);
    },
    [],
  );

  const handleSubmit = useCallback(
    async (data: IFormData) => {
      setLoading(true);

      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome do serviço.'),
          price: Yup.number().required('O valor do serviço é obrigatório.'),
          commission_amount: Yup.number(),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const response = await api.post('service-groups', {
          name: data.name,
          description: data.description,
          default_nanotech_price: data.default_nanotech_price,
          companiesToLink: companiesToLink,
        });

        addToast({
          title: 'Cadastro realizado com sucesso.',
          type: 'success',
          description: 'O serviço foi cadastrado com sucesso.',
        });

        onClose();
        onSave();
        setLoading(false);
      } catch (err) {
        setLoading(false);

        if (err instanceof Yup.ValidationError) {
          const errors = getValidationsErrors(err);

          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          title: 'Não foi possível realizar o caadastro.',
          description:
            'Esse serviço já foi criado ou ocorreu um erro, tente novamente.',
          type: 'error',
        });
      }
    },
    [addToast, companiesToLink],
  );

  const handleSelectCompany = (e: any) => {
    const company = companies.find(c => c.id === e.target.value);

    if (!company) {
      return;
    }

    const companiesList = [
      ...companiesToLink,
      {
        id: company.id,
        name: company.name,
        price: formRef.current?.getFieldValue('price') || 0,
        commission: 0,
      },
    ].sort((a, b) => a.name.localeCompare(b.name));

    setCompaniesToLink(companiesList);
  };

  const handleRemoveCompany = (companyId: string) => {
    const company = companiesToLink.find(c => c.id === companyId);

    if (!company) {
      return;
    }

    setCompaniesToLink(companiesToLink.filter(c => c.id !== company.id));
  };

  const handleUpdateCompanyPrice = (
    e: React.FormEvent<HTMLInputElement>,
    companyId: string,
  ) => {
    formatCurrencyValue(e);

    const updatedCompanies = companiesToLink.map(c => {
      if (c.id === companyId) {
        c.price = Number(e.currentTarget.value);
      }

      return c;
    });

    setCompaniesToLink(updatedCompanies);
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
          <ModalHeader>{`Criar Serviço`}</ModalHeader>
          <ModalCloseButton />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <ModalBody paddingBottom={4}>
              <Flex direction="column" style={{ gap: '1rem' }}>
                <Row>
                  <Input
                    placeholder="Nome do serviço"
                    name="name"
                    icon={FiTool}
                  />

                  <Input
                    placeholder="Preço Sugerido Nanotech"
                    onKeyUp={formatCurrencyValue}
                    name="price"
                    icon={FiDollarSign}
                  />
                </Row>

                <Textarea
                  background={'#1c1c1c'}
                  name="description"
                  style={{ width: '100%' }}
                />
              </Flex>

              <LinkToCompaniesContainer>
                <LinkToCompaniesTitle>
                  Vincular serviço a concessionárias
                </LinkToCompaniesTitle>

                <Select
                  name="serviceGroup"
                  placeholder="Selecione as concessionárias"
                  onSelect={handleSelectCompany}
                  onChange={handleSelectCompany}
                  backgroundColor="#1c1c1c"
                  color="White"
                  containerProps={{
                    height: '52px',
                    marginBottom: '8px',
                    background: '#1c1c1c',
                  }}
                >
                  {companies
                    .filter(c => !companiesToLink.some(ctl => ctl.id === c.id))
                    .map(company => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                </Select>

                <SelectedCompaniesContainer>
                  <SelectedCompaniesHeader>
                    <SelectedCompaniesHeaderLabel>
                      Concessionária
                    </SelectedCompaniesHeaderLabel>

                    <SelectedCompaniesHeaderLabel>
                      Preço Nanotech
                    </SelectedCompaniesHeaderLabel>

                    <SelectedCompaniesHeaderLabel>
                      Comissāo
                    </SelectedCompaniesHeaderLabel>
                  </SelectedCompaniesHeader>

                  {companiesToLink.map(company => (
                    <SelectedCompany key={company.id}>
                      <SelectedCompanyLabel>
                        {company.name}
                      </SelectedCompanyLabel>

                      <SelectedCompanyValueContainer>
                        <SelectedCompanyValueInput
                          type="text"
                          defaultValue={company.price}
                          onChange={e =>
                            handleUpdateCompanyPrice(e, company.id)
                          }
                        ></SelectedCompanyValueInput>
                      </SelectedCompanyValueContainer>

                      <SelectedCompanyValueContainer>
                        <SelectedCompanyValueInput
                          type="text"
                          defaultValue={company.price}
                          onChange={e =>
                            handleUpdateCompanyPrice(e, company.id)
                          }
                        ></SelectedCompanyValueInput>

                        <RemoveCompanyButton
                          onClick={() => handleRemoveCompany(company.id)}
                        >
                          <FiX />
                        </RemoveCompanyButton>
                      </SelectedCompanyValueContainer>
                    </SelectedCompany>
                  ))}
                </SelectedCompaniesContainer>
              </LinkToCompaniesContainer>
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
                isLoading={loading}
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

export default CreateServiceModal;
