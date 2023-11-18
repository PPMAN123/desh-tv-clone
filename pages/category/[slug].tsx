import React from 'react';
import fetchCategoryPage from '../../src/data/categoryScrape';
import styled from 'styled-components';
import MobileNav from '../../src/components/MobileNav';
import useMediaQuery from '../../src/hooks/useMediaQuery';
import Navbar from '../../src/components/Navbar';
import IndexMainArticles from '../../src/components/IndexMainArticles';
import { capitalize, upperCase } from 'lodash';
import useOnScreen from '../../src/hooks/useOnScreen';
import fetchNewArticles from '../../src/data/infiniteScrollScrape';
import { createAllArticles } from '../../src/utils/createAllArticles';
import { client } from '../../src/utils/graphqlRequest';
import { gql } from 'graphql-request';

const PageWrapper = styled.div`
  font-family: Teko;
`;

const CategoryPage = ({ data, slug }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const hideRecommendedArticles = useMediaQuery('(max-width: 1200px)');
  const [numOfArticles, setNumOfArticles] = React.useState(0);
  const [numOfScrolls, setNumOfScrolls] = React.useState(1);
  const [targetArticleIndex, setTargetArticleIndex] = React.useState(0);
  const [infiniteScrollElement, setInfiniteScrollElement] =
    React.useState(null);
  const isVisible = useOnScreen(infiniteScrollElement);

  // const onRefChange = React.useCallback((node) => {
  //   if (node !== null) {
  //     setInfiniteScrollElement(node);
  //   }
  // }, []); // adjust deps

  // React.useEffect(() => {
  //   if (hideRecommendedArticles) {
  //     setTargetArticleIndex(titles.length - 6);
  //   } else {
  //     setTargetArticleIndex(titles.length - 14);
  //   }
  // }, [titles]);

  // React.useEffect(() => {
  //   if (isVisible) {
  //     fetchNewArticles(category, numOfScrolls).then((data) => {
  //       setTitles((prevTitles) => prevTitles.concat(data.translatedTitles));
  //       setImageLinks((prevImageLinks) =>
  //         prevImageLinks.concat(data.imageLinks)
  //       );
  //       setUrls((prevUrls) => prevUrls.concat(data.urls));
  //       setImageData((prevImageData) => prevImageData.concat(data.imageData));
  //     });
  //     setNumOfScrolls((prevNumOfScrolls) => (prevNumOfScrolls += 1));
  //     setNumOfArticles((prevNumOfArticles) => (prevNumOfArticles += 20));
  //   }
  // }, [isVisible]);

  return (
    <PageWrapper>
      {isMobile ? <MobileNav /> : <Navbar />}
      <IndexMainArticles
        pageTitle={upperCase(slug.replace('-', ' '))}
        articles={data.articles}
        categories
        numOfArticles={numOfArticles}
        setNumOfArticles={setNumOfArticles}
        targetArticleIndex={targetArticleIndex}
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
      take: 20,
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
