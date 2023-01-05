import fetchHomePage from '../src/data/homeScrape';
import React from 'react';
import Navbar from '../src/components/Navbar';
import styled from 'styled-components';
import IndexMainArticles from '../src/components/IndexMainArticles';
import useMediaQuery from '../src/hooks/useMediaQuery';
import MobileNav from '../src/components/MobileNav';

const PageWrapper = styled.div``;

export default function Home({ data }) {
  const [titles, setTitles] = React.useState(data.translatedTitles);
  const [imageLinks, setImageLinks] = React.useState(data.imageLinks);
  const [urls, setUrls] = React.useState(data.urls);
  const [categories, setCategories] = React.useState(data.categories);
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <PageWrapper>
      {isMobile ? <MobileNav /> : <Navbar />}
      <IndexMainArticles
        pageTitle="Top Stories"
        titles={titles}
        urls={urls}
        imageLinks={imageLinks}
        categories={categories}
      />
    </PageWrapper>
  );
}

export async function getServerSideProps({ req, res }) {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  );
  const data = await fetchHomePage();
  return { props: { data } };
}
