import * as cheerio from 'cheerio';
import fetchImageLink from './imageScrape';
import { faker } from '@faker-js/faker';
import request from '../utils/request';
import getTranslatedText from '../utils/getTranslatedText';
import getImage from '../utils/getImage';

const fetchNewArticles = async (category, numOfScrolls) => {
  const { data } = await request.get(
    `/data/desh-tv/${category}?start=${numOfScrolls * 20}`
  );

  const dom = cheerio.load(data);
  const anchors = dom('.newsblock > a').slice(1, 21);

  const urls: Array<string> = [];
  const titles = [];

  anchors.each((i, anchor) => {
    urls.push(anchor.attribs.href);
    titles.push(anchor.attribs.title);
  });

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

  const translatedTitles = await Promise.all(titlePromiseArray);

  const imageDataPromises = [];

  imageLinks.forEach((imageLink) => {
    const titleTranslatePromise = new Promise((resolve, reject) => {
      getImage(imageLink)
        .then((imageData) => {
          resolve(imageData);
        })
        .catch(() => {
          reject();
        });
    });
    imageDataPromises.push(titleTranslatePromise);
  });

  const imageData = await Promise.all(imageDataPromises);

  return {
    category,
    urls,
    translatedTitles,
    imageLinks,
    imageData,
  };
};

const fetchMockedNewArticles = async (category) => {
  let urls = [];
  let imageLinks = [];
  let translatedTitles = [];
  let imageData = [];
  for (let i = 0; i < 25; i++) {
    urls.push(faker.internet.url());
    imageLinks.push(faker.image.imageUrl(750, 422));
    translatedTitles.push(faker.lorem.sentence(7));
    imageData.push(faker.image.imageUrl(750, 422));
  }

  return {
    category,
    urls,
    translatedTitles,
    imageLinks,
    imageData,
  };
};

export default fetchNewArticles;
