import React, { useState } from 'react';

import {
  PopoverCloseButton,
  PopoverContent,
  PopoverBody,
  Stack,
  Select,
  Text,
  ButtonGroup,
  Button,
} from '@chakra-ui/core';

import api from '../../../../services/api';

interface IUpdateStatusPopoverContentProps {
  sale_id: string;
  currentStatus: string;
  close: () => void;
  onUpdateStatus?: () => Promise<void>;
}

const UpdateStatusPopoverContent: React.FC<IUpdateStatusPopoverContentProps> = ({
  sale_id,
  currentStatus,
  close,
  onUpdateStatus,
}) => {
  const [newStatus, setNewStatus] = useState(currentStatus);

  const handleStatusChange = () => {
    api
      .patch('sales/production-status', {
        status: newStatus,
        sale_ids: [sale_id],
      })
      .then(() => {
        if (onUpdateStatus) {
          onUpdateStatus();
          close();
        }
      });
  };

  return (
    <PopoverContent zIndex={1000} p={5} bg="#282828" borderColor="#282828">
      <PopoverCloseButton />

      <Stack spacing={4}>
        <Text fontSize={16} fontWeight="semibold">
          ATUALIZAR STATUS
        </Text>

        <PopoverBody padding={0}>
          <Select
            placeholder="Selecione o status"
            backgroundColor="#353535"
            borderColor="#353535"
            size="md"
            name="listFrom"
            value={newStatus}
            onChange={e => setNewStatus(e.target.value)}
          >
            <option value="IN_PROGRESS">Em andamento</option>
            <option value="DONE">Concluído</option>
            <option value="PENDING">Pendente</option>
          </Select>
        </PopoverBody>

        <ButtonGroup display="flex" justifyContent="flex-end">
          <Button
            onClick={() => close()}
            variant="outline"
            _hover={{ background: 'transparent' }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleStatusChange()}
            backgroundColor="#355a9d"
            _hover={{
              backgroundColor: '#5580b9',
            }}
          >
            Salvar
          </Button>
        </ButtonGroup>
      </Stack>
    </PopoverContent>
  );
};

export default UpdateStatusPopoverContent;
