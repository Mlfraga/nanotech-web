import styled from 'styled-components';

export const MenuContainer = styled.div`
  display: none;
  position: fixed;
  left: 0;
  top: 0;
  direction: column;
  width: 80px;

  @media (min-width: 900px){
    display: flex;
    flex-direction: column;
  }
`
