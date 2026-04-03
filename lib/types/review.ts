export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
  relativeTime?: string;
}

export interface BusinessInfo {
  name: string;
  rating: number;
  totalReviews: number;
  placeId: string;
}

export interface ReviewData {
  business: BusinessInfo;
  reviews: Review[];
}
