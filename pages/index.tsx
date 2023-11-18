import React from 'react';
import Navbar from '../src/components/Navbar';
import styled from 'styled-components';
import IndexMainArticles from '../src/components/IndexMainArticles';
import useMediaQuery from '../src/hooks/useMediaQuery';
import MobileNav from '../src/components/MobileNav';
import { gql } from 'graphql-request';
import { client } from '../src/utils/graphqlRequest';
const PageWrapper = styled.div``;

export default function Home({ data }) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <PageWrapper>
      {isMobile ? <MobileNav /> : <Navbar />}
      <IndexMainArticles pageTitle="Top Stories" articles={data.articles} />
    </PageWrapper>
  );
}

export async function getServerSideProps() {
  const data = await client.request(
    gql`
      query Query($orderBy: [ArticleOrderByInput!]!, $take: Int) {
        articles(orderBy: $orderBy, take: $take) {
          id
          slug
          image_data
          title
          translated_date
          created_at
          content {
            document
          }
          category {
            name
            slug
          }
        }
      }
    `,
    {
      orderBy: [
        {
          created_at: 'desc',
        },
      ],
      take: 10,
    }
  );

  return { props: { data } };
}
