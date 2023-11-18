import * as cheerio from 'cheerio';
import getImage from '../utils/getImage';
import getTranslatedText from '../utils/getTranslatedText';
import request from '../utils/request';
import fetchImageLink from './imageScrape';
import getArticle from '../utils/getArticle';
import createArticle from '../utils/createArticle';
import _ from 'lodash';
import { unescapeArray } from '../utils/dataFormat';

export const fetchArticleFromDB = async (articleSlug) => {
  const data = await getArticle(articleSlug);
  if (data) {
    const {
      image_data,
      title,
      translated_date,
      paragraphs,
      recommended_article_titles,
      recommended_article_images,
      recommended_article_links,
    } = data.data;

    const reStructuredData = {
      translatedDate: translated_date,
      translatedTitle: _.unescape(title),
      translatedParagraphs: unescapeArray(JSON.parse(paragraphs)),
      articleImageData: image_data,
      recommendedArticleTitles: unescapeArray(recommended_article_titles),
      recommendedArticleImageData: recommended_article_images,
      recommendedArticleLinks: recommended_article_links,
    };
    return reStructuredData;
  } else {
    return null;
  }
};

export const createArticleToDB = async (articleSlug) => {
  const fetchUrl = `https://desh.tv${articleSlug.substring(
    articleSlug.indexOf('article') + 7
  )}`;

  const {
    translatedDate,
    translatedTitle,
    translatedParagraphs,
    articleImageData,
    recommendedArticleSlugs,
  } = await fetchArticle(fetchUrl);

  let categoryName = articleSlug.substring(9);
  categoryName = categoryName.substring(0, categoryName.indexOf('/'));

  const createArticleData = await createArticle(
    articleSlug,
    articleImageData,
    translatedTitle,
    categoryName,
    translatedDate,
    translatedParagraphs,
    recommendedArticleSlugs
  );

  console.log('Create article Data', createArticleData);

  return {
    translatedDate,
    translatedTitle: _.unescape(translatedTitle),
    translatedParagraphs: unescapeArray(translatedParagraphs),
    articleImageData,
    recommendedArticleSlugs,
    recommendedArticleTitles: unescapeArray(
      createArticleData.data.recommendedArticleTitles
    ),
    recommendedArticleImageData:
      createArticleData.data.recommendedArticleImageData,
    recommendedArticleLinks: createArticleData.data.recommendedArticleLinks,
  };
};

const fetchArticle = async (articleUrl) => {
  const { data } = await request.get(articleUrl);

  const dom = cheerio.load(data);
  const date = dom('.newsstats time').text().trim();
  const title = dom('h1').text().trim();
  const articleParagraphs = dom('.news__content > p');
  const recommendedArticleSlugsAnchors = dom(
    '.col-md-12 > .row > div > div > a'
  );

  let translatedTitle = await getTranslatedText('bn', 'en', title);
  translatedTitle = translatedTitle
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
  const translatedDate = await getTranslatedText('bn', 'en', date);
  const recommendedArticleSlugs = [];
  recommendedArticleSlugsAnchors.each((i, element) => {
    recommendedArticleSlugs.push(
      '/article' + element.attribs.href.substring(15)
    );
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

  let translatedParagraphs = await Promise.all(translatedParagraphPromises);

  translatedParagraphs = translatedParagraphs.map((translatedParagraph) =>
    translatedParagraph.replaceAll('"', '&quot;')
  );

  const articleImageLink = await fetchImageLink({ articleUrl });
  const articleImageData = await getImage(articleImageLink);

  return {
    translatedDate,
    translatedTitle,
    translatedParagraphs,
    articleImageData,
    recommendedArticleSlugs,
  };
};

export default fetchArticle;
