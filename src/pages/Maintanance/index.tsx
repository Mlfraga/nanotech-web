import React from 'react';
import { ContactInfo, Container, Message, Title } from './styles';

const MaintenanceScreen = () => {
  return (
    <Container>
      <Title>Voltaremos em breve!</Title>
      <Message>
        Nosso site está passando por manutenção programada. Pedimos desculpas
        por qualquer inconveniente e agradecemos sua paciência. Por favor, volte
        mais tarde.
      </Message>
      <ContactInfo>
        Se precisar entrar em contato conosco, envie um e-mail para
        suporte@exemplo.com.
      </ContactInfo>
    </Container>
  );
};

export default MaintenanceScreen;
