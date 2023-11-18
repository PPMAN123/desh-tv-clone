import * as cheerio from 'cheerio';
import axios from 'axios';
import { fetchArticle } from './utils/fetchArticle';
import _, { attempt } from 'lodash';
import { createArticle } from './utils/createArticle';
import createError from './utils/createError';
import { ErrorStage, ErrorType } from './enums';

const mysql = require('mysql2/promise');
require('dotenv').config();

export default async function handler(req, res) {
  let data, connection;
  const statuses = {
    completed: 0,
    attempts: 0,
    fetchingErrors: 0,
    creationErrors: 0,
    errors: {
      // Reason: count
    },
  };
  try {
    connection = await mysql.createConnection(process.env.DATABASE_URL);
    ({ data } = await axios.get(req.body.pageUrl, {
      headers: { 'Access-Control-Allow-Origin': '*' },
      baseURL: process.env.NEXT_PUBLIC_HOST_URL,
    }));
  } catch (err) {
    console.log(
      'CANNOT GAIN CONNECTION TO BACKEND / CANNOT REACH DESH.TV',
      err
    );
    return res.status(400);
  }
  // console.log('page data', data);
  try {
    const dom = cheerio.load(data);
    const articleAnchors = dom('a');
    // console.log('Article Anchors', articleAnchors);

    const articleLinks = articleAnchors.map((i, anchor) =>
      encodeURI(anchor.attribs.href)
    );
    // console.log('article links', articleLinks);
    const articleDataPromises = [];
    articleLinks.each((i, link) => {
      const articleDataPromise = new Promise((resolve, reject) => {
        fetchArticle(link, statuses)
          .then((articleData) => {
            console.log('Data gathering status', articleData.status);
            resolve(articleData);
          })
          .catch((error) => {
            createError(
              statuses,
              ErrorType.FetchPromiseRejected,
              link,
              ErrorStage.Fetching
            );
            reject(error);
          });
      });

      articleDataPromises.push(articleDataPromise);
    });

    const allArticleData = await Promise.all(articleDataPromises);

    const createArticlePromises = [];

    allArticleData.forEach((article) => {
      statuses.attempts++;
      const createArticlePromise = new Promise((resolve, reject) => {
        createArticle(
          article.articleSlug,
          article.articleImageData,
          article.translatedTitle,
          article.categoryName,
          article.translatedDate,
          article.translatedParagraphs,
          article.recommendedArticleSlugs,
          false,
          connection,
          article.articleUrl,
          statuses
        )
          .then((createArticleStatus) => {
            resolve(createArticleStatus);
          })
          .catch((error) => {
            console.log(
              'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
              error
            );
            createError(
              statuses,
              ErrorType.CreatePromiseRejected,
              article.articleUrl,
              ErrorStage.Creation
            );
            reject();
          });
      });
      createArticlePromises.push(createArticlePromise);
    });
    const createArticleStatuses = await Promise.all(createArticlePromises);

    connection.end();

    // console.log('CREATE ARTICLE STATUS', createArticleStatuses);
    res.status(200).json({ statuses });
  } catch (error) {
    console.log('WE FOUND WHERE THE ERROR MIGHT BE', error);
    connection.end();
    res.status(400);
  }
}
