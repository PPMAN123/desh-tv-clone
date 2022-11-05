type getArticleSlugTypes = {
  url: string;
  category: string;
};

const getArticleSlug = ({ url, category }: getArticleSlugTypes) => {
  return `/${url.substring(url.indexOf('tv' + 3))}`;
};

export default getArticleSlug;
