import React, { useMemo } from 'react';
import { BiBlock } from 'react-icons/bi';
import { FiCheck, FiClock, FiMinusCircle } from 'react-icons/fi';

import {
  Flex,
  Popover,
  PopoverTrigger,
  Text,
  useDisclosure,
} from '@chakra-ui/core';

import UpdateStatusPopoverContent from '../UpdateStatusPopoverContent';

interface ISaleStatusProps {
  status: 'TO_DO' | 'IN_PROGRESS' | 'DONE' | 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'FINISHED';
  sale_id: string;
  onUpdateStatus?: () => Promise<void>;
  enableUpdateStatus?: boolean;
  containerStyle?: React.CSSProperties;
}

const SaleStatus: React.FC<ISaleStatusProps> = ({
  status,
  sale_id,
  onUpdateStatus,
  enableUpdateStatus = false,
  containerStyle = {},
}) => {
  const { onOpen, onClose, isOpen } = useDisclosure();

  const displayStatusName = useMemo(() => {
    switch (status) {
      case 'TO_DO':
        return 'A fazer';
      case 'IN_PROGRESS':
        return 'Em andamento';
      case 'DONE':
        return 'Concluído';
      case 'PENDING':
        return 'Pendente';
      case 'CONFIRMED':
        return 'Confirmado';
      case 'CANCELED':
        return 'Cancelado';
      case 'FINISHED':
        return 'Finalizado';
      default:
        return 'Status não encontrado';
    }
  }, [status]);

  const displayStatusIcon = useMemo(() => {
    switch (status) {
      case 'TO_DO':
        return <FiMinusCircle color="#cacaca" />;
      case 'IN_PROGRESS':
        return <FiClock color="#417ee4" />;
      case 'DONE':
        return <FiCheck color="#94ec94" />;
      case 'PENDING':
        return <BiBlock color="#ff6f60" />;
      case 'CONFIRMED':
        return <FiCheck color="#8d83ff" />;
      case 'CANCELED':
        return <BiBlock color="#da5c4e" />;
      case 'FINISHED':
        return <FiCheck color="#6be562" />;
      default:
        return '';
    }
  }, [status]);

  return (
    <Popover
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      placement="right"
      closeOnBlur={false}
    >
      <PopoverTrigger>
        <Flex
          ml={6}
          borderRadius={8}
          border="1px solid #282828"
          paddingX={2}
          paddingY={1}
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
          style={containerStyle}
        >
          {displayStatusIcon}

          <Text ml={2} fontSize={14} fontFamily="inter" fontWeight="semibold">
            {displayStatusName.toUpperCase()}
          </Text>
        </Flex>
      </PopoverTrigger>

      {enableUpdateStatus && (
        <UpdateStatusPopoverContent
          currentStatus={status}
          close={onClose}
          sale_id={sale_id}
          onUpdateStatus={onUpdateStatus}
        />
      )}
    </Popover>
  );
};

export default SaleStatus;
