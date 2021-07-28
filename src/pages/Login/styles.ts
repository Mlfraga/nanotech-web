import styled from 'styled-components';

import signInBackgroundImg from '../../assets/sign-in-background-6.jpg';

export const Container = styled.div`
  height: 100vh;

  display: flex;
  align-items: stretch;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #282828;
  padding-bottom: 6%;

  width: 100%;
  max-width: 700px;

  img {
    max-width: 60%;
  }

  form {
    width: 340px;
    text-align: center;

    h1 {
      margin-bottom: 24px;
    }
  }
`;

export const Background = styled.div`
  flex: 1;
  background: url(${signInBackgroundImg}) no-repeat center;
  background-size: cover;

  filter: grayscale(85%);
`;
