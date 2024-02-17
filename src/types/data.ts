export type ArticleData = {
  id?: number;
  slug: string;
  image_data: string;
  title: string;
  translated_date?: string;
  created_at?: Date;
  content?: { document: Document };
  category?: {
    name: string;
    slug: string;
  };
};

export type Articles = Array<ArticleData>;
