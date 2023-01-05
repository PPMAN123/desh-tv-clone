import React from 'react';
import styled from 'styled-components';
import { ImCross } from 'react-icons/im';
import { faker } from '@faker-js/faker';

const PopoutWrapper = styled.nav<{ openPopout: boolean }>`
  position: fixed;
  transform: ${(p) => (p.openPopout ? 'translateX(0)' : 'translateX(-1000px)')};
  display: flex;
  left: 0px;
  top: 0px;
  width: calc(100% - 32px);
  height: 100vh;
  background-color: #dcdcdc;
  z-index: 1;
  flex-direction: column;
  padding: 16px;
  transition: 0.7s ease-out;
`;

const FirstRowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 10%;
`;

const CloseButton = styled.button`
  border: none;
  font-size: 32px;
  border-radius: 10px;
  background-color: #dcdcdc;
  transition: 0.3s ease-out;
  height: 32px;
  cursor: pointer;
  padding: 0;
  :hover {
    color: rgb(0, 140, 117);
  }
`;

const Divider = styled.hr`
  height: 3px;
  margin: 16px;
  color: black;
  background-color: black;
  border: none;
  border-radius: 50px;
`;

const CategoryButtons = styled.button`
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

const MobilePopoutMenu = ({ openPopout, changeOpenPopout }) => {
  return (
    <PopoutWrapper openPopout={openPopout}>
      <FirstRowWrapper>
        <img src={faker.image.imageUrl(120, 70)} />
        <CloseButton
          onClick={() => {
            changeOpenPopout((prev) => !prev);
          }}
        >
          <ImCross />
        </CloseButton>
      </FirstRowWrapper>
      <Divider />
      <CategoryButtons>NATIONAL</CategoryButtons>
      <CategoryButtons>POLITICS</CategoryButtons>
      <CategoryButtons>INTERNATIONAL</CategoryButtons>
      <CategoryButtons>CRICKET</CategoryButtons>
      <CategoryButtons>ENTERTAINMENT</CategoryButtons>
      <CategoryButtons>ECONOMY</CategoryButtons>
    </PopoutWrapper>
  );
};

export default MobilePopoutMenu;
