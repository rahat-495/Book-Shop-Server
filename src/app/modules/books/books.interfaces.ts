
export type TBookCategory =
  | "Fiction"
  | "Non-Fiction"
  | "Fantasy"
  | "History"
  | "Science"
  | "Biography";

export type TBook = {
  title: string;
  author: string;
  description: string;
  category: TBookCategory;
  price: number;
  stock: number;
  image?: string;
  publishedDate: string;
};
