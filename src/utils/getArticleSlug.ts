const getArticleSlug = (url) => {
  let newUrl = '';
  if (url && url.includes('desh.tv')) {
    newUrl = url.substring(url.indexOf('tv') + 2);
  } else {
    newUrl = url;
  }
  return newUrl;
};

export default getArticleSlug;
