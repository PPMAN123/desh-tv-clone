import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import cloudscraper from 'cloudscraper';
import getImage from '../utils/getImage';
import encode from '../utils/encode';

const ArticleWrapper = styled.div`
  display: flex;
`;

const ArticleTitleWrapper = styled.h3`
  font-family: Teko;
`;

const ArticleCategory = styled.span``;

const ArticleTitle = styled.span``;

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
      {image && <img src={image}></img>}
      <ArticleTitleWrapper>
        <ArticleCategory></ArticleCategory>
        <ArticleTitle>{title}</ArticleTitle>
      </ArticleTitleWrapper>
    </ArticleWrapper>
  );
};

export default IndexMainArticle;
