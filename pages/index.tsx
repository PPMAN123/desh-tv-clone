import Head from 'next/head';
import fetchPageData from '../src/data';
import fetchHomePage from '../src/data/homeScrape';
import React, { useEffect } from 'react';
import Navbar from '../src/components/Navbar';
import styled from 'styled-components';
import IndexMainArticles from '../src/components/IndexMainArticles';
import useMediaQuery from '../src/hooks/useMediaQuery';
import MobileNav from '../src/components/MobileNav';

const PageWrapper = styled.div``;

export default function Home() {
  const [titles, setTitles] = React.useState([]);
  const [imageLinks, setImageLinks] = React.useState([]);
  const [urls, setUrls] = React.useState([]);
  const isMobile = useMediaQuery('(max-width: 768px)');

  React.useEffect(() => {
    fetchHomePage().then((data) => {
      // console.log(data)
      setTitles(data.translatedTitles);
      setUrls(data.urls);
      setImageLinks(data.imageLinks);
    });
  }, []);

  return (
    <PageWrapper>
      {isMobile ? <MobileNav /> : <Navbar />}
      <IndexMainArticles titles={titles} urls={urls} imageLinks={imageLinks} />
    </PageWrapper>
  );
}
