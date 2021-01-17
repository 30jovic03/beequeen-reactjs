type CartType = {
  cartId: string;
  userId: string;
  createdAt: any;
  ordered: boolean;
  cartArticles: {
    cartArticleId: string;
    articleId: string;
    quantity: number;
    articleName: string;
    categoryId: string;
    categoryName: string;
    articlePrice: number;
  }[];
}

export default CartType;