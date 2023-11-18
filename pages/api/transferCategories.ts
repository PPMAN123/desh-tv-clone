import _ from 'lodash';

const mysql = require('mysql2/promise');
require('dotenv').config();

export default async function handler(req, res) {
  let data, oldConnection, newConnection;

  try {
    oldConnection = await mysql.createConnection(process.env.OLD_DATABASE_URL);
    newConnection = await mysql.createConnection(process.env.DATABASE_URL);

    const [oldCategoryData] = await oldConnection.execute(
      'SELECT * FROM categories'
    );

    console.log(oldCategoryData);

    const values = oldCategoryData.reduce((acc, category, i) => {
      if (i > 0) {
        return `${acc},(${category.id}, '${category.name}', '${category.slug}')`;
      } else {
        return `(${category.id}, '${category.name}', '${category.slug}')`;
      }
    }, '');

    newConnection.execute(`INSERT INTO Category(id,name,slug) VALUES${values}`);

    console.log('SUCCESS');

    return res.status(200);
  } catch (err) {
    console.log(err);
    return res.status(400);
  }
}
