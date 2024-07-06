import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
  color: #333;
  text-align: center;
  padding: 20px;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
`;

export const Message = styled.p`
  font-size: 1.2rem;
  margin-bottom: 40px;
  max-width: 600px;
`;

export const ContactInfo = styled.p`
  font-size: 1rem;
`;

export const RedirectLink = styled.a`
  font-size: 1.2rem;
  margin-top: 20px;
  color: #355a9d;
  text-decoration: underline;
`;
