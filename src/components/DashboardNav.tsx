import React from 'react';
import styled from 'styled-components';

const NavWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100px;
  background-color: #dcdcdc;
  width: 80%;
  padding: 16px 10%;
`;

const Logo = styled.img`
  align-self: center;
  justify-self: center;
  cursor: pointer;
  z-index: 1;
  height: 80%;
`;

const Annotations = styled.div`
  font-family: Teko;
  font-size: 56px;
`;

const DashboardNav = ({ annotations }) => {
  return (
    <NavWrapper>
      <Logo src="/logo.svg" />
      <Annotations>{annotations}</Annotations>
    </NavWrapper>
  );
};

export default DashboardNav;
