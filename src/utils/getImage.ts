import request from './request';

export default async function getImage(imageLink) {
  const imageData = await request.post(`/api/image/`, {
    url: `${
      process.env.NEXT_PUBLIC_HOST_URL
    }/data/desh-tv/${imageLink.substring(16)}`,
  });
  return imageData.data.data;
}
