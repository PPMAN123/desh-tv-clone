import React from 'react';
import styled from 'styled-components';
import MobileNav from '../../src/components/MobileNav';
import Navbar from '../../src/components/Navbar';
import useMediaQuery from '../../src/hooks/useMediaQuery';
import {unescape} from 'lodash';
import moment from 'moment';
import { gql } from '@apollo/client';
import { DocumentRenderer, DocumentRendererProps } from '@keystone-6/document-renderer';
import RecommendedArticles from '../../src/components/RecommendedArticles';
import { client } from '../../src/utils/graphqlRequest';

const PageWrapper = styled.div`
  font-family: Teko;
  display: flex;
  flex-direction: column;
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

const ArticleTextWrapper = styled.div`
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
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isRecommendedOnBottom = useMediaQuery('(max-width: 1200px)');
  const modifiedDocument = Object.keys(data.article.content.document).map((key)=>{
    return {
      type: data.article.content.document[key].type,
      children: data.article.content.document[key].children.map((child)=>{
        child.text = unescape(child.text);
        return child;
      })
    }
  })

  return (
    <PageWrapper>
      {isMobile ? <MobileNav /> : <Navbar />}
      <ContentWrapper>
        <ArticleWrapper>
          <TitleWrapper>
            <Title>{unescape(data.article.title)}</Title>
          </TitleWrapper>
          <DateWrapper>
            <Date>
              {moment(data.article.translated_date).format(
                'dddd, MMMM Do YYYY'
              )}
            </Date>
          </DateWrapper>
          <ArticleImageWrapper>
            <ArticleImage src={data.article.image_data} />
          </ArticleImageWrapper>
          <ArticleTextWrapper>
            <DocumentRenderer document={modifiedDocument} />
          </ArticleTextWrapper>
        </ArticleWrapper>
        {data && !isRecommendedOnBottom && (
          <RecommendationWrapper>
            <RecommendedText>See also:</RecommendedText>
            <RecommendedArticles data={data.articles} />
          </RecommendationWrapper>
        )}
      </ContentWrapper>
      {/* {data && isRecommendedOnBottom && (
        <MobileRecommendationWrapper>
          <RecommendedText>See also:</RecommendedText>
          <MobileRecommendationGridWrapper>
            <MobileRecommendedArticles data={data} />
          </MobileRecommendationGridWrapper>
        </MobileRecommendationWrapper>
      )} */}
    </PageWrapper>
  );
};

export async function getServerSideProps(context) {
  const data = await client.request(
    gql`
      query Query(
        $where: ArticleWhereUniqueInput!
        $articlesWhere2: ArticleWhereInput!
        $take: Int
      ) {
        article(where: $where) {
          translated_date
          title
          slug
          image_data
          created_at
          content {
            document
          }
          category {
            slug
            name
          }
        }
        articles(where: $articlesWhere2, take: $take) {
          slug
          title
          image_data
        }
      }
    `,
    {
      where: {
        slug: context.resolvedUrl,
      },
      articlesWhere2: {
        slug: {
          not: {
            equals: context.resolvedUrl,
          },
        },
      },
      take: 6,
    }
  );

  return { props: { data } };
}

export default ArticlePage;
