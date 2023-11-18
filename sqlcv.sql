CREATE TABLE categories(
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  slug TEXT NOT NULL
);

CREATE TABLE articles(
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  slug TEXT NOT NULL,
  image_data TEXT NOT NULL,
  title VARCHAR(50) NOT NULL,
  category_id INT NOT NULL,
  translated_date DATE NOT NULL,
  paragraphs TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY category_id_index (category_id)
);

CREATE TABLE recommended_articles(
  article_id INT NOT NULL,
  recommended_article_id INT NOT NULL,
  CONSTRAINT article_recommended_article_pk PRIMARY KEY (article_id, recommended_article_id)
);

ALTER TABLE articles DROP COLUMN recommended_article_titles;
recommended_article_images, recommended_article_links;

ALTER TABLE articles 

INSERT INTO categories(name,slug)
VALUES('national','/national');


INSERT INTO articles(slug,image_data,title,category_id,translated_date,paragraphs,recommended_article_images,recommended_article_links,recommended_article_titles)
VALUES('/article/national/details/75688-%E0%A6%9F%E0%A7%8D%E0%A6%B0%E0%A6%BE%E0%A6%AB%E0%A6%BF%E0%A6%95-%E0%A6%86%E0%A6%87%E0%A6%A8-%E0%A6%AE%E0%A7%87%E0%A6%A8%E0%A7%87-%E0%A6%9A%E0%A6%B2%E0%A6%BE%E0%A6%B0-%E0%A6%B8%E0%A6%82%E0%A6%B8%E0%A7%8D%E0%A6%95%E0%A7%83%E0%A6%A4%E0%A6%BF-%E0%A6%97%E0%A7%9C%E0%A7%87-%E0%A6%A4%E0%A7%81%E0%A6%B2%E0%A7%81%E0%A6%A8-%E0%A6%AA%E0%A7%8D%E0%A6%B0%E0%A6%A7%E0%A6%BE%E0%A6%A8%E0%A6%AE%E0%A6%A8%E0%A7%8D%E0%A6%A4%E0%A7%8D%E0%A6%B0%E0%A7%80','IMAGEDATA','TITLE',1,'2000-01-01','[asldfjalsdkjfalksdj,askljdfklasjd,salkdjfalks]','recImageData','[recArticleLinks]','[recArticleTitles]');
