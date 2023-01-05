import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';
import MobileNav from '../../src/components/MobileNav';
import Navbar from '../../src/components/Navbar';
import RecommendedArticles from '../../src/components/RecommendedArticles';
import fetchArticle from '../../src/data/articleScrape';
import useMediaQuery from '../../src/hooks/useMediaQuery';
import MobileRecommendedArticles from '../../src/components/MobileRecommendedArticles';

const PageWrapper = styled.div`
  font-family: Teko;
  display: flex;
`;

const ContentWrapper = styled.div`
  margin: 50px auto 0 auto;
  width: 55vw;
  display: flex;
  flex-direction: row;
  align-items: center;
  @media (max-width: 1200px) {
    margin: 50px 7.5vw;
    width: 85vw;
  }

  @media (max-width: 576px) {
    margin: 25px 3vw;
    width: 94vw;
  }

  width: 1000px;
`;

const ArticleWrapper = styled.div`
  flex-direction: column;
  max-width: 800px;
`;

const RecommendationWrapper = styled.div`
  flex-direction: column;
  display: flex;
  margin: 0 0 0 30px;
  align-self: start;
  position: sticky;
  top: 0;
`;

const TitleWrapper = styled.div``;

const Title = styled.h1`
  font-size: 60px;
  margin: 20px 0;
`;

const DateWrapper = styled.div`
  align-self: end;
`;

const Date = styled.span`
  font-size: 28px;
`;

const ArticleTextWrapper = styled.div``;

const ArticleText = styled.p`
  font-size: 34px;
  text-align: justify;
  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const ArticleImageWrapper = styled.div``;

const ArticleImage = styled.img`
  width: 100%;
`;

const RecommendedText = styled.h3`
  font-size: 40px;
  margin: 20px 0 0 0;
`;

const MobileRecommendationWrapper = styled.div`
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 1200px) {
    margin: 0 7.5vw;
    width: 85vw;
  }

  @media (max-width: 576px) {
    margin: 0 3vw;
    width: 94vw;
  }

  width: 1000px;
`;

const MobileRecommendationGridWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const ArticlePage = ({ data }) => {
  const router = useRouter();
  const url = (router.query.slug as string[]) || [];
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isRecommendedOnBottom = useMediaQuery('(max-width: 1200px)');

  return (
    <PageWrapper>
      {isMobile ? <MobileNav /> : <Navbar />}
      <ContentWrapper>
        <ArticleWrapper>
          <TitleWrapper>
            <Title>{data.translatedTitle}</Title>
          </TitleWrapper>
          <DateWrapper>
            <Date>{data.translatedDate}</Date>
          </DateWrapper>
          <ArticleImageWrapper>
            <ArticleImage src={data.articleImageData} />
          </ArticleImageWrapper>
          <ArticleTextWrapper>
            {data.translatedParagraphs &&
              data.translatedParagraphs.map((paragraph, index) => {
                if (index == data.translatedParagraphs.length - 1) {
                  return <ArticleText>{paragraph}</ArticleText>;
                } else {
                  return (
                    <ArticleText>
                      &nbsp;&nbsp;&nbsp;&nbsp;{paragraph}
                    </ArticleText>
                  );
                }
              })}
          </ArticleTextWrapper>
        </ArticleWrapper>
        {data && !isRecommendedOnBottom && (
          <RecommendationWrapper>
            <RecommendedText>See also:</RecommendedText>
            <RecommendedArticles
              articleTitles={data.translatedRecommendedArticleTitles}
              articleLinks={data.recommendedArticleLinks}
              articleThumbnails={data.recommendedArticleThumbailData}
            />
          </RecommendationWrapper>
        )}
      </ContentWrapper>
      {data && isRecommendedOnBottom && (
        <MobileRecommendationWrapper>
          <RecommendedText>See also:</RecommendedText>
          <MobileRecommendationGridWrapper>
            <MobileRecommendedArticles data={data} />
          </MobileRecommendationGridWrapper>
        </MobileRecommendationWrapper>
      )}
    </PageWrapper>
  );
};

export async function getServerSideProps(context) {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  );

  const fetchUrl = `https://desh.tv${context.resolvedUrl.substring(
    context.resolvedUrl.indexOf('article') + 7
  )}`;

  const data = await fetchArticle(fetchUrl);
  return { props: { data } };
}

export default ArticlePage;
