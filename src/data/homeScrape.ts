import * as cheerio from 'cheerio';
import fetchImageLink from './imageScrape';
import { faker } from '@faker-js/faker';
import request from '../utils/request';
import getTranslatedText from '../utils/getTranslatedText';

const fetchHomePage = async () => {
  const { data } = await request.get('/data/desh-tv/');

  const dom = cheerio.load(data);
  const anchors = dom('.newsblock > a').slice(0, 5);

  const urls: Array<string> = [];
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
  console.log(urls);

  let categories = [];
  urls.forEach((url) => {
    if (url.includes('https://desh.tv/')) {
      categories.push(
        url.substring(url.indexOf('tv') + 3, url.indexOf('details') - 1)
      );
    } else {
      categories.push(url.substring(1, url.indexOf('details') - 1));
    }
  });

  console.log(categories);

  return {
    categories,
    urls,
    translatedTitles,
    imageLinks,
  };
};

const fetchMockedHomePage = async () => {
  let urls = [];
  let imageLinks = [];
  let translatedTitles = [];
  let categories = [];
  for (let i = 0; i < 5; i++) {
    urls.push(faker.internet.url());
    imageLinks.push(faker.image.imageUrl(750, 422));
    translatedTitles.push(faker.lorem.sentence(7));
    categories.push(faker.word.noun());
  }

  return {
    categories,
    urls,
    translatedTitles,
    imageLinks,
  };
};

export default fetchHomePage;
