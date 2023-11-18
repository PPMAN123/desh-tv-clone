import {createArticle} from './utils/createArticle'

const mysql = require('mysql2/promise');

export default async function handler(req, res) {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  // console.log('Connected to createArticle')
  const {articleSlug, imageData, title, categoryName, translatedDate, paragraphs, recommendedArticleSlugs} = req.body
  
  const createArticleData = await createArticle(articleSlug, imageData, title, categoryName, translatedDate, paragraphs, recommendedArticleSlugs, true, connection)

  console.log("Create article data backend", createArticleData)
  
  // console.log("status of createArticle", status)
  return res.status(createArticleData.status).json({data: createArticleData.data})
}