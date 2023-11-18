import { getRecommendedArticles } from './utils/recommendedArticles'

require('dotenv').config()
const mysql = require('mysql2/promise')

export default async function handler(req, res) {
  const connection = await mysql.createConnection(process.env.DATABASE_URL)
  console.log('Connected to PlanetScale!')
  const articleSlug = req.body.articleSlug
  const articleSql = `SELECT * FROM articles WHERE slug='${articleSlug}'`
  const [results] = await connection.execute(articleSql)
  let status;
  let data;
  if (!results.length) {
    status = 400
  } else {
    const {image_data, title, translated_date, paragraphs} = results[0]
    const articleId = results[0].id
    
    const {recommendedArticleTitles, recommendedArticleImageData, recommendedArticleLinks} = await getRecommendedArticles(articleId, connection);
    
    // console.log("RECOMMENDED ARTICLE TITLES" , recommendedArticleTitles)
    
    data = {
      image_data,
      title,
      translated_date,
      paragraphs,
      recommended_article_titles: recommendedArticleTitles,
      recommended_article_images: recommendedArticleImageData,
      recommended_article_links: recommendedArticleLinks,
    }
    
    status = 200
  }
  connection.end()
  return res.status(status).json({data});
}