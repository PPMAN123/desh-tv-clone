import request from './request';

const createArticle = async (
  articleSlug,
  imageData,
  title,
  categoryName,
  translatedDate,
  paragraphs,
  recommendedArticleSlugs
) => {
  try {
    const articleData = await request.post(`/api/createArticle/`, {
      articleSlug,
      imageData,
      title,
      categoryName,
      translatedDate,
      paragraphs,
      recommendedArticleSlugs,
    });
    return articleData.data;
  } catch {
    return null;
  }
};

export default createArticle;
