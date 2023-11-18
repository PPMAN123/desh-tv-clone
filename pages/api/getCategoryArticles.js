require('dotenv').config()
const mysql = require('mysql2')

export default function handler(req, res) {
  const connection = mysql.createConnection(process.env.DATABASE_URL)
  console.log('Connected to PlanetScale!')
  const categoryName = req.body.categoryName
  const categoryIdSql = `SELECT id FROM categories WHERE name='${categoryName}'`
  connection.query(categoryIdSql, (err, results, fields)=>{
    if(err){
      res.status(400)
    }
    // console.log(results)
    const articlesSql = `SELECT * FROM articles WHERE category_id=${results[0]}`
    connection.query(articlesSql, (err, results, fields)=>{
      if(err){
        res.status(400)
      }
      res.status(200).json({results})
    })
  })
  connection.end()
}