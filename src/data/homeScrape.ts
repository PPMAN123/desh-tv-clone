import * as cheerio from 'cheerio';
import fetchImageLink from './imageScrape';
import { getTranslationText } from 'lingva-scraper';
import request from '../utils/request';
import getTranslatedText from '../utils/getTranslatedText';

const fetchHomePage = async () => {
  const { data } = await request.get('http://localhost:3000/data/desh-tv/');

  const dom = cheerio.load(data);
  const anchors = dom('.newsblock > a').slice(0, 5);

  const urls = [];
  const titles = [];

  anchors.each((i, anchor) => {
    urls.push(anchor.attribs.href);
    titles.push(anchor.attribs.title);
  });

  // urls.forEach(async (url, i) => {
  //   const imageUrl = await fetchImageLink({ articleUrl: url });
  // });
  const imagePromiseArray = [];
  urls.forEach((url) => {
    const imageLinkPromise = new Promise((resolve, reject) => {
      fetchImageLink({ articleUrl: url })
        .then((imageLink) => {
          resolve(imageLink);
        })
        .catch(() => {
          reject();
        });
    });
    imagePromiseArray.push(imageLinkPromise);
  });

  const imageLinks = await Promise.all(imagePromiseArray);

  const titlePromiseArray = [];

  titles.forEach((title) => {
    const titleTranslatePromise = new Promise((resolve, reject) => {
      getTranslatedText('bn', 'en', title)
        .then((translatedTitle) => {
          resolve(translatedTitle);
        })
        .catch(() => {
          reject();
        });
    });
    titlePromiseArray.push(titleTranslatePromise);
  });
  //make this thing a function

  const translatedTitles = await Promise.all(titlePromiseArray);

  return {
    urls,
    translatedTitles,
    imageLinks,
  };
};

export default fetchHomePage;
