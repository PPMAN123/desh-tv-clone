import request from './request';

export default async function getImage(imageLink) {
  const imageData = await request.post(`http://localhost:3000/api/image/`, {
    url: `http://localhost:3000/data/desh-tv/${imageLink.substring(16)}`,
  });
  return imageData.data.data;
}
