import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';
import MobileNav from '../../src/components/MobileNav';
import Navbar from '../../src/components/Navbar';
import useMediaQuery from '../../src/hooks/useMediaQuery';

const PageWrapper = styled.div``;

const ArticlePage = () => {
  const router = useRouter();
  const url = (router.query.slug as string[]) || [];
  const isMobile = useMediaQuery('(max-width: 768px)');

  return <PageWrapper>{isMobile ? <MobileNav /> : <Navbar />}</PageWrapper>;
};

export async function getServerSideProps(context) {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  );

  const fetchUrl = `https://desh.tv${context.resolvedUrl.substring(
    context.resolvedUrl.indexOf('article') + 9
  )}`;

  console.log(fetchUrl);

  // const data = await fetchHomePage();
  // return { props: { data } };
  return;
}

export default ArticlePage;
