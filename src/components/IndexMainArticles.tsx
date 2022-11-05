import React from 'react';
import styled from 'styled-components';
import IndexMainArticle from './IndexMainArticle';

const IndexMainArticlesWrapper = styled.div`
  margin: 50px 22.5vw;
  width: 55vw;
  @media (max-width: 1200px) {
    margin: 50px 7.5vw;
    width: 85vw;
  }
  display: flex;
  flex-direction: column;
  @media (max-width: 576px) {
    align-items: center;
    margin: 25px 3vw;
    width: 94vw;
  } ;
`;

const TopStories = styled.h2`
  font-size: 72px;
  font-family: Teko;
`;

const IndexMainArticles = ({ titles, urls, imageLinks, categories }) => {
  return (
    <IndexMainArticlesWrapper>
      <TopStories>Top Stories</TopStories>
      {titles.map((title, index) => (
        <IndexMainArticle
          title={title}
          url={urls[index]}
          imageLink={imageLinks[index]}
          orientation={index % 2 == 0 ? 'left' : 'right'}
          category={categories[index]}
        />
      ))}
    </IndexMainArticlesWrapper>
  );
};

export default IndexMainArticles;
