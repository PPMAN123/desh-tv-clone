import request from './request';

export const getCategoryMaxPages = async (pageUrl, signal) => {
  const { data } = await request.post(
    `/api/getCategoryMaxPages`,
    {
      pageUrl,
    },
    {
      signal,
    }
  );

  return data.categoryMaxPages;
};
