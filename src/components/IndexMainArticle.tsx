import React from 'react';
import styled from 'styled-components';
import getImage from '../utils/getImage';

const ArticleTitleWrapper = styled.h3`
  font-family: Teko;
  &::before {
    content: '';
    background-color: black;
    height: 8px;
    width: 80px;
    display: block;
    margin: 0 0 8px 30px;
    transition: 0.3s ease-out;
  }
`;

const ArticleWrapper = styled.div`
  display: flex;
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
`;

const ArticleImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
`;

const ImageFilter = styled.div`
  position: relative;
  width: 450px;
`;

const FilterDiv = styled.div`
  background: rgba(0, 0, 0, 0.05);
  width: 100%;
  height: 253.188px;
  z-index: 1;
  transition: 0.3s ease-out;
`;

const ArticleCategory = styled.span``;

const ArticleTitle = styled.span`
  margin: 0 30px;
  font-size: 30px;
`;

const IndexMainArticle = ({ title, url, imageLink }) => {
  const [image, setImage] = React.useState();
  React.useEffect(() => {
    if (imageLink) {
      getImage(imageLink).then((data) => {
        setImage(data);
      });
    }
  }, [imageLink]);
  return (
    <ArticleWrapper>
      {image && (
        <ImageFilter>
          <ArticleImage>
            <img style={{ width: '450px' }} src={image} />
          </ArticleImage>
          <FilterDiv />
        </ImageFilter>
      )}
      <ArticleTitleWrapper>
        <ArticleCategory></ArticleCategory>
        <ArticleTitle>{title}</ArticleTitle>
      </ArticleTitleWrapper>
    </ArticleWrapper>
  );
};

export default IndexMainArticle;
