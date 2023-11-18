import request from './request';

const getArticle = async (articleSlug) => {
  try {
    const articleResponse = await request.post(`/api/getArticle/`, {
      articleSlug,
    });
    return articleResponse.data;
  } catch {
    return null;
  }
};

export default getArticle;
