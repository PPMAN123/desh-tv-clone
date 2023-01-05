import React from 'react';
import fetchCategoryPage from '../../src/data/categoryScrape';
import styled from 'styled-components';
import MobileNav from '../../src/components/MobileNav';
import useMediaQuery from '../../src/hooks/useMediaQuery';
import Navbar from '../../src/components/Navbar';
import IndexMainArticles from '../../src/components/IndexMainArticles';
import { capitalize } from 'lodash';

const PageWrapper = styled.div`
  font-family: Teko;
`;

const CategoryPage = ({ data }) => {
  const [titles, setTitles] = React.useState(data.translatedTitles);
  const [imageLinks, setImageLinks] = React.useState(data.imageLinks);
  const [urls, setUrls] = React.useState(data.urls);
  const [category, setCategory] = React.useState(data.category);
  const [imageData, setImageData] = React.useState(data.imageData);
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <PageWrapper>
      {isMobile ? <MobileNav /> : <Navbar />}
      <IndexMainArticles
        pageTitle={capitalize(category)}
        titles={titles}
        urls={urls}
        imageLinks={imageLinks}
        categories={null}
        imageData={imageData}
      />
    </PageWrapper>
  );
};

export async function getServerSideProps(context) {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  );

  const data = await fetchCategoryPage(context.params.slug);
  return { props: { data } };
}

export default CategoryPage;
