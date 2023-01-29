import React from 'react';
import fetchCategoryPage from '../../src/data/categoryScrape';
import styled from 'styled-components';
import MobileNav from '../../src/components/MobileNav';
import useMediaQuery from '../../src/hooks/useMediaQuery';
import Navbar from '../../src/components/Navbar';
import IndexMainArticles from '../../src/components/IndexMainArticles';
import { capitalize } from 'lodash';
import useOnScreen from '../../src/hooks/useOnScreen';
import fetchNewArticles from '../../src/data/infiniteScrollScrape';

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
  const hideRecommendedArticles = useMediaQuery('(max-width: 1200px)');
  const [numOfArticles, setNumOfArticles] = React.useState(0);
  const [numOfScrolls, setNumOfScrolls] = React.useState(1);
  const [targetArticleIndex, setTargetArticleIndex] = React.useState(0);
  const [infiniteScrollElement, setInfiniteScrollElement] =
    React.useState(null);
  const isVisible = useOnScreen(infiniteScrollElement);

  const onRefChange = React.useCallback((node) => {
    if (node !== null) {
      setInfiniteScrollElement(node);
    }
  }, []); // adjust deps

  React.useEffect(() => {
    if (hideRecommendedArticles) {
      setTargetArticleIndex(titles.length - 6);
    } else {
      setTargetArticleIndex(titles.length - 14);
    }
  }, [titles]);

  React.useEffect(() => {
    console.log(isVisible);
    if (isVisible) {
      fetchNewArticles(category, numOfScrolls).then((data) => {
        setTitles((prevTitles) => prevTitles.concat(data.translatedTitles));
        setImageLinks((prevImageLinks) =>
          prevImageLinks.concat(data.imageLinks)
        );
        setUrls((prevUrls) => prevUrls.concat(data.urls));
        setImageData((prevImageData) => prevImageData.concat(data.imageData));
      });
      console.log(titles.length);
      setNumOfScrolls((prevNumOfScrolls) => (prevNumOfScrolls += 1));
      setNumOfArticles((prevNumOfArticles) => (prevNumOfArticles += 20));
    }
  }, [isVisible]);

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
        numOfArticles={numOfArticles}
        setNumOfArticles={setNumOfArticles}
        infiniteScrollTrigger={onRefChange}
        targetArticleIndex={targetArticleIndex}
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
