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

export type PollData = {
  id?: number;
  slug: string;
  image_data: string;
  title: string;
  translated_date?: string;
  created_at?: Date;
  desh_yes_count: number;
  desh_no_count: number;
  desh_no_comment_count: number;
  yes_count: number;
  no_count: number;
  no_comment_count: number;
};

export type Polls = Array<PollData>;
