import request from './request';

export default async function transferCategories() {
  const transferCategoryResponse = await request.post(
    '/api/transferCategories/'
  );
  return transferCategoryResponse;
}
