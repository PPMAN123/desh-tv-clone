import * as cheerio from 'cheerio';
import getImage from '../utils/getImage';
import getTranslatedText from '../utils/getTranslatedText';
import request from '../utils/request';
import fetchImageLink from './imageScrape';

const fetchArticle = async (articleUrl) => {
  const { data } = await request.get(articleUrl);

  const dom = cheerio.load(data);
  const date = dom('.newsstats time').text().trim();
  const title = dom('h1').text().trim();
  const articleParagraphs = dom('.news__content > p');
  const recommendedArticleTitles = dom(
    '.col-md-12 > .row > div > div > div > h3'
  );
  const recommendedArticleThumbnails = dom(
    '.col-md-12 > .row > div > div > ._air-load-image'
  );
  const recommendedArticleLinksAnchors = dom(
    '.col-md-12 > .row > div > div > a'
  );

  const translatedTitle = await getTranslatedText('bn', 'en', title);
  const translatedDate = await getTranslatedText('bn', 'en', date);
  const recommendedArticleLinks = [];
  recommendedArticleLinksAnchors.each((i, element) => {
    recommendedArticleLinks.push(element.attribs.href);
  });

  const translatedParagraphPromises = [];

  articleParagraphs.each((i, element) => {
    const translationPromise = new Promise((resolve, reject) => {
      //@ts-ignore
      getTranslatedText('bn', 'en', element.children[0].data)
        .then((translatedParagraph) => {
          resolve(translatedParagraph);
        })
        .catch(() => {
          reject();
        });
    });
    translatedParagraphPromises.push(translationPromise);
  });

  const translatedParagraphs = await Promise.all(translatedParagraphPromises);

  const recommendedArticleTitlePromises = [];

  recommendedArticleTitles.each((i, element) => {
    const translationPromise = new Promise((resolve, reject) => {
      //@ts-ignore
      getTranslatedText('bn', 'en', element.children[0].data)
        .then((translatedTitle) => {
          resolve(translatedTitle);
        })
        .catch(() => {
          reject();
        });
    });
    recommendedArticleTitlePromises.push(translationPromise);
  });

  const translatedRecommendedArticleTitles = await Promise.all(
    recommendedArticleTitlePromises
  );

  const recommendedArticleThumbnailLinks = [];

  recommendedArticleThumbnails.each((i, element) => {
    const thumbnailUrl = element.attribs['data-air-img'];
    recommendedArticleThumbnailLinks.push(thumbnailUrl);
  });

  console.log(recommendedArticleThumbnailLinks);

  const articleImageLink = await fetchImageLink({ articleUrl });
  const articleImageData = await getImage(articleImageLink);

  const recommendedArticleThumbnailPromises = [];

  recommendedArticleThumbnailLinks.forEach((imageLink) => {
    const titleTranslatePromise = new Promise((resolve, reject) => {
      getImage(imageLink)
        .then((imageData) => {
          resolve(imageData);
        })
        .catch(() => {
          reject();
        });
    });
    recommendedArticleThumbnailPromises.push(titleTranslatePromise);
  });

  const recommendedArticleThumbailData = await Promise.all(
    recommendedArticleThumbnailPromises
  );

  return {
    translatedDate,
    translatedTitle,
    translatedParagraphs,
    articleImageData,
    translatedRecommendedArticleTitles,
    recommendedArticleThumbailData,
    recommendedArticleLinks,
  };
};

export default fetchArticle;
