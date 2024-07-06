import React, { useEffect } from 'react';
import { ContactInfo, Container, Message, RedirectLink, Title } from './styles';
import { Link } from 'react-router-dom';

const V2RedirectionScreen = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = 'https://nanotech-web-v2.vercel.app/';
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Container>
      <Title>Versão Descontinuada</Title>

      <Message>
        Esta versão do sistema foi descontinuada. Você será redirecionado para a
        nova versão em breve.
      </Message>

      <ContactInfo>
        Se precisar entrar em contato conosco, envie um e-mail para
        operacao@nanotechcardetail.com.br
      </ContactInfo>

      <RedirectLink href="https://nanotech-web-v2.vercel.app/">
        Clique aqui se você não for redirecionado automaticamente.
      </RedirectLink>
    </Container>
  );
};

export default V2RedirectionScreen;
