
export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Experience {
  id: string;
  enabled: boolean;
  images: string[];
  translations: {
    en: {
      title: string;
      description: string;
      content: string;
    };
    it: {
      title: string;
      description: string;
      content: string;
    };
  };
  price: number;
  duration: string;
  location: string;
  rating: number;
  maxPeople: number;
  reviews: Review[];  // Modificato da reviews?: Review[] a reviews: Review[]
}
