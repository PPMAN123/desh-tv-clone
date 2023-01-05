import Link from 'next/link';
import React, { CSSProperties } from 'react';
import styled from 'styled-components';
import { categoryList } from '../constants';
import _ from 'lodash';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';

const NavWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  background-color: #dcdcdc;
  width: 100%;
`;

const NavContentWrapper = styled.div`
  height: 60px;
  width: 74%;
  display: flex;
  margin: 0 350px;
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
  height: 100%;
`;

const ScrollingArea = styled.div`
  display: flex;
  justify-content: center;
  width: 56%;
  position: relative;
  height: 100%;
`;

const LeftRightButtons = styled.button`
  margin: 0 30px;
  width: 40px;
  height: 40px;
  border-radius: 40px;
  padding: 0;
  background-color: #c6c6c6;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  transition: 0.3s ease-out;
  cursor: pointer;
  :hover {
    background-color: #b0b0b0;
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
      return 'justify-self: center;';
    } else {
      if (p.prevListNumber < p.listNumber) {
        if (p.groupNumber > p.listNumber) {
          return 'transform: translateX(2000px);';
        }
        return 'transform: translateX(-2000px);';
      } else if (p.prevListNumber > p.listNumber) {
        if (p.groupNumber < p.listNumber) {
          return 'transform: translateX(-2000px);';
        }
        return 'transform: translateX(2000px);';
      } else if (p.prevListNumber == p.listNumber) {
        if (p.listNumber == 2) {
          return 'transform: translateX(-2000px);';
        } else {
          return 'transform: translateX(2000px);';
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
  console.log(prevListNumber, listNumber);
  return (
    <NavWrapper>
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
