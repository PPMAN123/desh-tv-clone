import Head from 'next/head';
import fetchPageData from '../src/data';
import fetchHomePage from '../src/data/homeScrape';
import React from 'react';
import Navbar from '../src/components/navbar';
import styled from 'styled-components';
import IndexMainArticles from '../src/components/IndexMainArticles';

const PageWrapper = styled.div``;

export default function Home() {
  const [titles, setTitles] = React.useState([]);
  const [imageLinks, setImageLinks] = React.useState([]);
  const [urls, setUrls] = React.useState([]);

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
      <Navbar />
      <IndexMainArticles titles={titles} urls={urls} imageLinks={imageLinks} />
    </PageWrapper>
  );
}
