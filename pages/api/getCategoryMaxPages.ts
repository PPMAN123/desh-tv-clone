import * as cheerio from 'cheerio';
import axios from 'axios';
import _ from 'lodash';

const mysql = require('mysql2/promise');
require('dotenv').config();

export default async function handler(req, res) {
  let data, connection;

  try {
    connection = await mysql.createConnection(process.env.DATABASE_URL);
    ({ data } = await axios.get(req.body.pageUrl, {
      headers: { 'Access-Control-Allow-Origin': '*' },
      baseURL: process.env.NEXT_PUBLIC_HOST_URL,
    }));

    const dom = cheerio.load(data);
    const categoryMaxPagesText = dom(
      '.col-md-2.d-flex.col-4.justify-content-center.justify-content-md-end.text-center.text-md-right'
    ).text();

    const categoryMaxPages = _.toInteger(
      categoryMaxPagesText.substring(categoryMaxPagesText.indexOf('/') + 2)
    );

    res.status(200).json({ categoryMaxPages });
  } catch {
    console.log('CANNOT GAIN CONNECTION TO BACKEND / CANNOT REACH DESH.TV');
    return res.status(400);
  }
}
