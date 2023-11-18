export async function getRecommendedArticles(articleId, connection){
  const recommendedArticleIdsSql = `SELECT recommended_article_id FROM recommended_articles WHERE article_id=${articleId}`
  console.log('article id', articleId)
  const [recommendedArticleIdResults] = await connection.execute(recommendedArticleIdsSql)
  const recommendedArticleIds = recommendedArticleIdResults.map((recommendedArticleIdResult) => {
    return recommendedArticleIdResult.recommended_article_id
  });

  const recommendedArticleLinks = []
  const recommendedArticleImageData = []
  const recommendedArticleTitles = []
  
  if (recommendedArticleIds.length){
    const recommendedArticlesSql = `SELECT * FROM articles WHERE id in (${JSON.stringify(recommendedArticleIds).replace('[', '').replace(']', '')})`
    const [recommendedArticleResults] = await connection.execute(recommendedArticlesSql)
    console.log("RECOMMENDED ARTICLE RESULTS", recommendedArticleResults)
    recommendedArticleResults.forEach((recommendedArticleResult)=>{
      recommendedArticleLinks.push('https://desh.tv' + recommendedArticleResult.slug.substring(8))
      recommendedArticleImageData.push(recommendedArticleResult.image_data)
      recommendedArticleTitles.push(recommendedArticleResult.title)
    })
  }
  return {
    recommendedArticleLinks,
    recommendedArticleImageData,
    recommendedArticleTitles
  }
}