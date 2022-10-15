import request from './request';

export default async function getTranslationText(from, to, text) {
  const translatedData = await request.post(
    'http://localhost:3000/api/translate/',
    {
      from: from,
      to: to,
      text: text,
    }
  );
  return translatedData.data.data;
}
