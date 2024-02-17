import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import MobileNav from '../../src/components/MobileNav';
import useMediaQuery from '../../src/hooks/useMediaQuery';
import Navbar from '../../src/components/Navbar';
import IndexMainArticles from '../../src/components/IndexMainArticles';
import { upperCase } from 'lodash';
import useOnScreen from '../../src/hooks/useOnScreen';
import { client } from '../../src/utils/graphqlRequest';
import { gql } from 'graphql-request';
import { Articles } from '../../src/types/data';

const PageWrapper = styled.div`
  font-family: Teko;
`;

const CategoryPage = ({
  data,
  slug,
}: {
  data: {
    articles: Articles;
  };
  slug: string;
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const hideRecommendedArticles = useMediaQuery('(max-width: 1200px)');
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref);
  const [articles, setArticles] = useState({
    skipCount: 0,
    articles: data.articles,
  });

  useEffect(() => {
    if (isVisible) {
      console.log('ON SCREEN');
      client
        .request(
          gql`
            query MyQuery($skip: Int = 10, $equals: String = "") {
              articles(
                skip: $skip
                take: 10
                where: { category: { name: { equals: $equals } } }
                orderBy: { created_at: desc }
              ) {
                created_at
                id
                image_data
                slug
                title
                category {
                  name
                }
              }
            }
          `,
          {
            skip: (articles.skipCount + 1) * 10,
            equals: slug,
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
        pageTitle={upperCase(slug.replace('-', ' '))}
        articles={articles.articles}
        spinnerRef={ref}
        categories
      />
    </PageWrapper>
  );
};

export async function getServerSideProps(context) {
  const data = await client.request(
    gql`
      query MyQuery($equals: String, $take: Int) {
        articles(
          where: { category: { name: { equals: $equals } } }
          take: $take
        ) {
          category {
            name
          }
          id
          title
          slug
          image_data
        }
      }
    `,
    {
      equals: context.query.slug,
      take: 10,
    }
  );

  return {
    props: {
      data,
      slug: context.query.slug,
    },
  };
}

export default CategoryPage;
