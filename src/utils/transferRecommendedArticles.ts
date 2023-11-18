import request from './request';

export default async function transferRecommendedArticles() {
  const transferRecommendedArticlesResponse = await request.post(
    '/api/transferRecommendedArticles/'
  );
  return transferRecommendedArticlesResponse;
}
