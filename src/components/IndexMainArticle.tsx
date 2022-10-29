import React from 'react';
import styled from 'styled-components';
import getImage from '../utils/getImage';

const ArticleTitleWrapper = styled.h3`
  font-family: Teko;
  text-align: ${(prop) => (prop.orientation == 'left' ? 'left' : 'right')};
  margin: 0 30px;
  display: flex;
  flex-direction: column;
  &::before {
    ${(prop) => (prop.orientation == 'left' ? '' : 'align-self: end;')}
    content: '';
    background-color: black;
    height: 8px;
    width: 80px;
    display: block;
    margin: 8px 0;
    transition: 0.3s ease-out;
  }
  max-width: 50%;
  @media (max-width: 576px) {
    text-align: center;
    max-width: 75%;
    &::before {
      align-self: center;
    }
  } ;
`;

const ArticleWrapper = styled.div`
  display: flex;
  ${(prop) =>
    `flex-direction: ${prop.orientation == 'left' ? 'row;' : 'row-reverse;'}`}
  transition: 0.3s ease-out;
  cursor: pointer;
  &:hover {
    color: rgb(0, 140, 117);
    ${ArticleTitleWrapper} {
      &::before {
        background-color: rgb(0, 140, 117);
      }
    }
    background-color: rgba(0, 140, 117, 0.1);
  }
  margin: 40px 0;
  width: 100%;
  height: 250px;
  @media (max-width: 576px) {
    flex-direction: column;
    width: 100%;
    align-items: center;
    height: 100%;
  } ;
`;

const ArticleImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
`;

const ImageFilter = styled.div`
  position: relative;
  width: 42%;
  @media (max-width: 576px) {
    width: 80%;
  } ;
`;

const FilterDiv = styled.div`
  background: rgba(0, 0, 0, 0.05);
  padding-top: calc(42200% / 750);
  width: 100%;
  z-index: 1;
  transition: 0.3s ease-out;
`;

const ArticleCategory = styled.span``;

const ArticleTitle = styled.span`
  font-size: 30px;
`;

const StyledImage = styled.img`
  width: 100%;
`;

const IndexMainArticle = ({ title, url, imageLink, orientation }) => {
  const [image, setImage] = React.useState();
  React.useEffect(() => {
    if (imageLink) {
      getImage(imageLink).then((data) => {
        setImage(data);
      });
    }
  }, [imageLink]);
  return (
    <ArticleWrapper orientation={orientation}>
      {image && (
        <ImageFilter>
          <ArticleImage>
            <StyledImage src={image} />
          </ArticleImage>
          <FilterDiv />
        </ImageFilter>
      )}
      <ArticleTitleWrapper orientation={orientation}>
        <ArticleCategory></ArticleCategory>
        <ArticleTitle>{title}</ArticleTitle>
      </ArticleTitleWrapper>
    </ArticleWrapper>
  );
};

export default IndexMainArticle;
