import Link from 'next/link';
import React, { CSSProperties } from 'react';
import styled from 'styled-components';
import { categoryList } from '../constants';
import _ from 'lodash';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';

const NavWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 120px;
  background-color: #dcdcdc;
  width: 100%;
  padding: 16px 0 0 0;
`;

const NavTopContentWrapper = styled.div`
  height: 50%;
  display: flex;
  justify-content: space-between;
`;

const NavContentWrapper = styled.div`
  height: 50%;
  display: flex;
  margin: 0;
  justify-content: space-between;
  align-items: center;
  width: 100%;
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
  height: 100%;
`;

const ScrollingArea = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  height: 100%;
`;

const LeftRightButtons = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 40px;
  margin: 0 14%;
  padding: 0;
  background-color: #c6c6c6;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  transition: 0.3s ease-out;
  cursor: pointer;
  z-index: 1;
  :hover {
    background-color: #b0b0b0;
  }
  display: block;
  @media (max-width: 1200px) {
    margin: 0 2%;
  }
`;

const GroupWrapper = styled.div<{
  showGroup: boolean;
  prevListNumber: number;
  listNumber: number;
  hasNotScrolled: boolean;
  groupNumber: number;
}>`
  ${(p) => {
    if (p.showGroup) {
      return 'justify-self: center; z-index: 0; display: block;';
    } else {
      if (p.prevListNumber < p.listNumber) {
        if (p.groupNumber > p.listNumber) {
          return 'transform: translateX(2000px); content-visibility:hidden;';
        }
        return 'transform: translateX(-2000px); content-visibility:hidden;';
      } else if (p.prevListNumber > p.listNumber) {
        if (p.groupNumber < p.listNumber) {
          return 'transform: translateX(-2000px); content-visibility:hidden;';
        }
        return 'transform: translateX(2000px); content-visibility:hidden;';
      } else if (p.prevListNumber == p.listNumber) {
        if (p.listNumber == 2) {
          return 'transform: translateX(-2000px); content-visibility:hidden;';
        } else {
          return 'transform: translateX(2000px); content-visibility:hidden;';
        }
      }
    }
  }}

  white-space: nowrap;
  position: absolute;
  top: 0;
  height: 100%;
  transition: 0.3s ease-out;
  width: auto;
`;

const Logo = styled.img`
  align-self: center;
  justify-self: center;
  margin: 0 50px;
  cursor: pointer;
  z-index: 1;
  height: 100%;
`;

const handleLeftArrow = (setListNumber, setPrevListNumber) => {
  setListNumber((prevListNumber) => {
    setPrevListNumber(() => prevListNumber);
    if (prevListNumber - 1 != 0) {
      return Math.max(prevListNumber - 1, 0);
    } else {
      return 0;
    }
  });
};

const handleRightArrow = (
  setListNumber,
  setPrevListNumber,
  setHasNotScrolled
) => {
  setListNumber((prevListNumber) => {
    setPrevListNumber(() => prevListNumber);
    if (prevListNumber + 1 != 2) {
      return Math.min(prevListNumber + 1, 2);
    } else {
      return 2;
    }
  });
  setHasNotScrolled(() => false);
};

const handleLeftButtonStyle = (listNumber): CSSProperties => {
  if (listNumber == 0) {
    return { visibility: 'hidden' };
  }
  return;
};

const handleRightButtonStyle = (listNumber): CSSProperties => {
  if (listNumber == 2) {
    return { visibility: 'hidden' };
  }
  return;
};

const Navbar = () => {
  const [listNumber, setListNumber] = React.useState(0);
  const [prevListNumber, setPrevListNumber] = React.useState(0);
  const [hasNotScrolled, setHasNotScrolled] = React.useState(true);
  const firstCategoryList = categoryList.slice(0, 6);
  const secondCategoryList = categoryList.slice(7, 14);
  const thirdCategoryList = categoryList.slice(15);
  const categoryLists = [
    firstCategoryList,
    secondCategoryList,
    thirdCategoryList,
  ];
  return (
    <NavWrapper>
      <NavTopContentWrapper>
        <Link href="/">
          <Logo src="/logo.svg" />
        </Link>
      </NavTopContentWrapper>
      <NavContentWrapper>
        <LeftRightButtons
          onClick={() => handleLeftArrow(setListNumber, setPrevListNumber)}
          style={handleLeftButtonStyle(listNumber)}
        >
          <AiFillCaretLeft />
        </LeftRightButtons>
        <ScrollingArea>
          {categoryLists.map((categoryList, categoryListNumber) => {
            return (
              <GroupWrapper
                showGroup={categoryListNumber == listNumber ? true : false}
                prevListNumber={prevListNumber}
                listNumber={listNumber}
                hasNotScrolled={hasNotScrolled}
                groupNumber={categoryListNumber}
              >
                {categoryList.map((category) => (
                  <Link href={`/category/${category}`}>
                    <NavButtons>{_.upperCase(category)}</NavButtons>
                  </Link>
                ))}
              </GroupWrapper>
            );
          })}
        </ScrollingArea>
        <LeftRightButtons
          onClick={() =>
            handleRightArrow(
              setListNumber,
              setPrevListNumber,
              setHasNotScrolled
            )
          }
          style={handleRightButtonStyle(listNumber)}
        >
          <AiFillCaretRight />
        </LeftRightButtons>
      </NavContentWrapper>
    </NavWrapper>
  );
};

export default Navbar;
