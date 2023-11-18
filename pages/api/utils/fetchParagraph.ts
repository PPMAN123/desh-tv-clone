import { getTranslationText } from 'lingva-scraper';

export default function fetchParagraph(text, i, type) {
  const fetchParagraphPromise = new Promise((resolve, reject) => {
    //@ts-ignore
    getTranslationText('bn', 'en', text)
      .then((translatedParagraph) => {
        resolve({ translatedParagraph, paragraphNumber: i, type });
        //resolve({text: 'asdfasdfa', articleNumber: 0})
        //resolve({text: 'asdfasdfa', articleNumber: 0})
      })
      .catch((error) => {
        console.log('TRANSLATED PARAGRAPH ERROR', error);
        reject();
      });
  });

  return fetchParagraphPromise;
}
