import request from './request';

export default async function getTranslationText(from, to, text) {
  const translatedData = await request.post('/api/translate/', {
    from: from,
    to: to,
    text: text,
  });
  return translatedData.data.data;
}
