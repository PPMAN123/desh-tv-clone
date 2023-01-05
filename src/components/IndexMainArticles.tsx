import React from 'react';
import styled from 'styled-components';
import useMediaQuery from '../hooks/useMediaQuery';
import IndexMainArticle from './IndexMainArticle';
import RecommendedArticles from './RecommendedArticles';

const IndexMainArticlesWrapper = styled.div`
  margin: 4vh auto 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const MainArticlesWrapper = styled.div`
  flex-direction: column;
  width: 1000px;
  @media (max-width: 576px) {
    align-items: center;
    margin: 25px 3vw;
    width: 94vw;
    height: 100%;
  }

  @media (max-width: 1200px) {
    margin: 0px 7.5vw;
    width: 85vw;
  }
`;

const TopStories = styled.h2`
  font-size: 72px;
  font-family: Teko;
  margin: 0;
`;

const RecommendationWrapper = styled.div`
  flex-direction: column;
  display: flex;
  margin: 0 0 0 30px;
  align-self: start;
  position: sticky;
  top: 0;
  width: 170px;
`;

const RecommendedText = styled.h3`
  font-size: 40px;
  margin: 20px 0 0 0;
`;

const IndexMainArticles = ({
  pageTitle,
  titles,
  urls,
  imageLinks,
  categories,
  ...rest
}) => {
  const isMobile = useMediaQuery('(max-width: 1200px)');
  const [numOfArticles, setNumOfArticles] = React.useState(0);

  React.useEffect(() => {
    if (isMobile) {
      setNumOfArticles(24);
    } else {
      setNumOfArticles(16);
    }
  }, [isMobile]);

  return (
    <IndexMainArticlesWrapper>
      <MainArticlesWrapper>
        <TopStories>{pageTitle}</TopStories>
        {categories
          ? titles.map((title, index) => (
              <IndexMainArticle
                title={title}
                url={urls[index]}
                imageLink={imageLinks[index]}
                orientation={index % 2 == 0 ? 'left' : 'right'}
                category={categories[index]}
              />
            ))
          : titles.map((title, index) => {
              if (index < numOfArticles) {
                return (
                  <IndexMainArticle
                    title={title}
                    url={urls[index]}
                    imageLink={imageLinks[index]}
                    orientation={'left'}
                    category={null}
                  />
                );
              }
            })}
      </MainArticlesWrapper>
      {!categories && !isMobile && (
        <RecommendationWrapper>
          <RecommendedText>See also:</RecommendedText>
          <RecommendedArticles
            articleTitles={titles.slice(16)}
            articleLinks={urls.slice(16)}
            articleThumbnails={rest.imageData.slice(16)}
          />
        </RecommendationWrapper>
      )}
    </IndexMainArticlesWrapper>
  );
};

export default IndexMainArticles;
