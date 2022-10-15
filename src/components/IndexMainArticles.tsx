import React from 'react';
import styled from 'styled-components';
import IndexMainArticle from './IndexMainArticle';

const IndexMainArticlesWrapper = styled.div`
  margin: 50px 380px;
`;

const TopStories = styled.h2`
  font-size: 72px;
  font-family: Teko;
`;

const IndexMainArticles = ({ titles, urls, imageLinks }) => {
  return (
    <IndexMainArticlesWrapper>
      <TopStories>Top Stories</TopStories>
      <IndexMainArticle
        title={titles[0]}
        url={urls[0]}
        imageLink={imageLinks[0]}
      />
    </IndexMainArticlesWrapper>
  );
};

export default IndexMainArticles;
