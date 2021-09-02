import React, { useEffect } from 'react';
import {
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiXCircle,
} from 'react-icons/fi';

import { IToastMessage, useToast } from '../../../context/toast';
import { Container } from './styles';

interface IToastProps {
  message: IToastMessage;
  style: object;
}

const icons = {
  info: <FiInfo size={24} />,
  error: <FiAlertCircle size={24} />,
  success: <FiCheckCircle size={24} />,
};

const Toast: React.FC<IToastProps> = ({ message, style }) => {
  const { removeToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(message.id);
    }, 6000);

    return () => {
      clearTimeout(timer);
    };
  }, [message.id, removeToast]);

  return (
    <Container
      type={message.type}
      hasdescription={!!message.description}
      style={{
        width: '360px',
        position: 'relative',
        padding: '16px 30px 16px 16px',
        borderRadius: '10px',
        boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        alignItems: 'center',
        ...style,
      }}
    >
      {icons[message.type || 'info']}

      <div
        style={{
          flex: 1,
        }}
      >
        <strong>{message.title}</strong>
        {message.description && (
          <p
            style={{
              marginTop: '4px',
              fontSize: '14px',
              opacity: '0.8',
              lineHeight: '20px',
            }}
          >
            {message.description}
          </p>
        )}
      </div>

      <button
        style={{
          position: 'absolute',
          right: '16px',
          top: '19px',
          opacity: '0.6',
          border: '0',
          background: 'transparent',
          color: 'inherit',
        }}
        type="button"
        onClick={() => removeToast(message.id)}
      >
        <FiXCircle size={18} />
      </button>
    </Container>
  );
};

export default Toast;
