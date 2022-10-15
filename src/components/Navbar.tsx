import React from 'react';
import styled from 'styled-components';

const NavWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  background-color: #dcdcdc;
`;

const NavContentWrapper = styled.div`
  height: 60px;
  width: 100vw;
  display: flex;
  margin: 0 400px;
  justify-content: space-between;
  align-items: center;
`;

const NavButtons = styled.button`
  border: none;
  font-size: 32px;
  font-family: Teko;
  font-weight: 400;
  padding: 8px 10px;
  border-radius: 10px;
  background-color: #dcdcdc;
  transition: 0.3s ease-out;
  cursor: pointer;
  :hover {
    color: rgb(0, 140, 117);
  }
`;

const Navbar = () => {
  return (
    <NavWrapper>
      <NavContentWrapper>
        <NavButtons>NATIONAL</NavButtons>
        <NavButtons>POLITICS</NavButtons>
        <NavButtons>INTERNATIONAL</NavButtons>
        <NavButtons>CRICKET</NavButtons>
        <NavButtons>ENTERTAINMENT</NavButtons>
        <NavButtons>ECONOMY</NavButtons>
      </NavContentWrapper>
    </NavWrapper>
  );
};

export default Navbar;
