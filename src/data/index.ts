import axios from 'axios';
import * as cheerio from 'cheerio';
import { getTranslationText } from 'lingva-scraper';

const fetchPageData = async () => {
  const { data } = await axios.get(
    'https://desh.tv/local-news/details/74386-%E0%A6%A6%E0%A7%81%E0%A6%87-%E0%A6%B6%E0%A6%BF%E0%A6%B6%E0%A7%81%E0%A6%95%E0%A7%87-%E0%A6%96%E0%A7%81%E0%A6%81%E0%A6%9F%E0%A6%BF%E0%A6%B0-%E0%A6%B8%E0%A6%99%E0%A7%8D%E0%A6%97%E0%A7%87-%E0%A6%AC%E0%A7%87%E0%A6%81%E0%A6%A7%E0%A7%87-%E0%A6%A8%E0%A6%BF%E0%A6%B0%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%A4%E0%A6%A8-%E0%A7%A9-%E0%A6%AA%E0%A7%81%E0%A6%B2%E0%A6%BF%E0%A6%B6-%E0%A6%AA%E0%A7%8D%E0%A6%B0%E0%A6%A4%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%B9%E0%A6%BE%E0%A6%B0,-%E0%A6%A4%E0%A6%A6%E0%A6%A8%E0%A7%8D%E0%A6%A4-%E0%A6%95%E0%A6%AE%E0%A6%BF%E0%A6%9F%E0%A6%BF'
  );

  const dom = cheerio.load(data);
  const date = dom('.newsstats time').text().trim();
  const title = dom('h1').text().trim();
  const articleParagraphs = dom('.news__content > p');

  const translatedTitle = await getTranslationText('bn', 'en', title);
  const translatedDate = await getTranslationText('bn', 'en', date);

  const promiseArray = [];

  articleParagraphs.each((i, element) => {
    const translationPromise = new Promise((resolve, reject) => {
      getTranslationText('bn', 'en', element.children[0].data)
        .then((translatedParagraph) => {
          resolve(translatedParagraph);
        })
        .catch(() => {
          reject();
        });
    });
    promiseArray.push(translationPromise);
  });

  const translatedParagraphs = await Promise.all(promiseArray);

  const translatedArticle = translatedParagraphs.join('\n\n');

  return {
    translatedDate,
    translatedTitle,
    translatedArticle,
  };
};

export default fetchPageData;
