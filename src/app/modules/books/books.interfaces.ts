
export type TBookCategory =
  | "Fiction"
  | "Non-Fiction"
  | "Fantasy"
  | "History"
  | "Science"
  | "Biography";

export type TBook = {
  title: string;
  availability: "Available" | "Unavailable";
  author: string;
  description: string;
  category: TBookCategory;
  price: number;
  stock: number;
  image?: string;
  publishedDate: string;
};
