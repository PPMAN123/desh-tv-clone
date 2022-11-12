import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';
import MobileNav from '../../src/components/MobileNav';
import Navbar from '../../src/components/Navbar';
import fetchArticle from '../../src/data/articleScrape';
import useMediaQuery from '../../src/hooks/useMediaQuery';

const PageWrapper = styled.div`
  font-family: Teko;
`;

const ContentWrapper = styled.div`
  margin: 50px 22.5vw;
  width: 55vw;
  @media (max-width: 1200px) {
    margin: 50px 7.5vw;
    width: 85vw;
  }
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 576px) {
    margin: 25px 3vw;
    width: 94vw;
  } ;
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
`;

const ArticleImageWrapper = styled.div``;

const ArticleImage = styled.img`
  width: 100%;
`;

const ArticlePage = ({ data }) => {
  const router = useRouter();
  const url = (router.query.slug as string[]) || [];
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <PageWrapper>
      {isMobile ? <MobileNav /> : <Navbar />}
      <ContentWrapper>
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
                  <ArticleText>&nbsp;&nbsp;&nbsp;&nbsp;{paragraph}</ArticleText>
                );
              }
            })}
        </ArticleTextWrapper>
      </ContentWrapper>
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
