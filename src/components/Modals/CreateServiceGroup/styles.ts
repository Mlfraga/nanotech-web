import styled from 'styled-components'

export const Row = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  div {
    margin-top: 0px;
  }
`;

export const LinkToCompaniesContainer = styled.section`
  display: flex;
  gap: 1rem;
  flex-direction: column;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

export const LinkToCompaniesTitle = styled.h2`
    color: #cecece;
    font-size: 1rem;
    font-family: 'Ubuntu', sans-serif;
    font-weight: 600;
`;

export const CompanySelectorContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

export const SelectedCompaniesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const SelectedCompaniesHeader = styled.div`
  display: flex;
  gap: 0.5rem;
  width: 100%;
`;

export const SelectedCompaniesHeaderLabel = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  font-size: 16px;
  font-weight: 600;
`;

export const SelectedCompany = styled.div`
  display: flex;
  gap: 0.5rem;
  width: 100%;
`;

export const SelectedCompanyLabel = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  font-size: 16px;
`;

export const SelectedCompanyValueContainer = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const SelectedCompanyValueInput = styled.input`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0px;
  border-bottom: 1px solid #cecece;
  background: transparent;
  padding: 8px;
  font-size: 16px;
`;

export const RemoveCompanyButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 0px;
  color: #cecece;
  font-size: 16px;
  cursor: pointer;
  background-color: transparent;
`;
