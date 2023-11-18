import _ from 'lodash';

const mysql = require('mysql2/promise');
require('dotenv').config();

export default async function handler(req, res) {
  let data, oldConnection, newConnection;

  try {
    oldConnection = await mysql.createConnection(process.env.OLD_DATABASE_URL);
    newConnection = await mysql.createConnection(process.env.DATABASE_URL);

    const [oldRecommendedArticles] = await oldConnection.execute(
      'SELECT * FROM recommended_articles'
    );

    console.log(oldRecommendedArticles);

    const values = oldRecommendedArticles.reduce(
      (acc, recommendedArticle, i) => {
        if (i > 0) {
          return `${acc},(${recommendedArticle.article_id}, ${recommendedArticle.recommended_article_id})`;
        } else {
          return `(${recommendedArticle.article_id}, ${recommendedArticle.recommended_article_id}`;
        }
      },
      ''
    );

    newConnection.execute(
      `INSERT INTO _Article_recommendedArticles(A,B) VALUES${values}`
    );

    console.log('SUCCESS');

    return res.status(200);
  } catch (err) {
    console.log(err);
    return res.status(400);
  }
}
