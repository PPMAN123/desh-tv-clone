import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../src/components/Navbar';
import styled from 'styled-components';
import IndexMainArticles from '../src/components/IndexMainArticles';
import useMediaQuery from '../src/hooks/useMediaQuery';
import MobileNav from '../src/components/MobileNav';
import { client } from '../src/utils/graphqlRequest';
import useOnScreen from '../src/hooks/useOnScreen';
import { gql } from 'graphql-request';
import { ArticleData, Articles } from '../src/types/data';

const PageWrapper = styled.div``;

export default function Home({ data }: { data: { articles: Articles } }) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref);

  const [articles, setArticles] = useState({
    skipCount: 0,
    articles: data.articles,
  });

  useEffect(() => {
    if (isVisible) {
      client
        .request(
          gql`
            query MyQuery($take: Int, $skip: Int) {
              articles(
                skip: $skip
                take: $take
                orderBy: { created_at: desc }
              ) {
                image_data
                slug
                title
                translated_date
                id
                category {
                  name
                  slug
                }
                content {
                  document
                }
                created_at
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
            skip: (articles.skipCount + 1) * 10,
          }
        )
        .then((newData: { articles: Articles }) => {
          setArticles((prevArticles) => {
            const value = {
              skipCount: prevArticles.skipCount + 1,
              articles: [...prevArticles.articles, ...newData.articles],
            };

            return value;
          });
        });
    }
  }, [isVisible]);

  return (
    <PageWrapper>
      {isMobile ? <MobileNav /> : <Navbar />}
      <IndexMainArticles
        pageTitle="Top Stories"
        articles={articles.articles}
        spinnerRef={ref}
      />
    </PageWrapper>
  );
}

export async function getServerSideProps() {
  const data: Articles = await client.request(
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
