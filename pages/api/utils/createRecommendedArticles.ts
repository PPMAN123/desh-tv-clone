import { getRecommendedArticles } from './recommendedArticles';

export async function createRecommendedArticles(
  recommendedArticleSlugs,
  articleId,
  connection
) {
  const recommendedArticleIdSql = `SELECT id FROM articles WHERE slug in (${JSON.stringify(
    recommendedArticleSlugs.map((recommendedArticleSlug) =>
      encodeURI(recommendedArticleSlug)
    )
  )
    .replace('[', '')
    .replace(']', '')})`;

  const [recommendedArticleIdsResults] = await connection.execute(
    recommendedArticleIdSql
  );

  if (recommendedArticleIdsResults.length) {
    const recommendedArticleSqlPromises = [];
    recommendedArticleIdsResults.forEach((recommendedArticleIdsResult) => {
      const recommendedArticlesSql = `INSERT INTO recommended_articles(article_id, recommended_article_id) VALUES(${articleId}, ${recommendedArticleIdsResult.id})`;
      const recommendedArticleSqlPromise = new Promise((resolve, reject) => {
        connection
          .execute(recommendedArticlesSql)
          .then((recommendedArticleSqlResult) => {
            resolve(recommendedArticleSqlResult);
          })
          .catch((err) => {
            console.log('Recommended Article Error', err);
            reject();
          });
      });
      recommendedArticleSqlPromises.push(recommendedArticleSqlPromise);
    });

    await Promise.all(recommendedArticleSqlPromises);

    return true;
  } else {
    console.log('RECOMMENDED ARTICLES IDS HAS NO RESULT');
  }

  return false;
}
