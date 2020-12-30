type ArticleType = {
  articleId?: string;
  name?: string;
  categoryId?: string;
  categoryName?: string;
  excerpt?: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  features?: {
    articleFeatureId?: string;
    featureId?: string;
    name?: string;
    value?: string;
  }[];
}

export default ArticleType;