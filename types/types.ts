export interface BusOption {
  id: number;
  name: string;
  capacity: string;
  type: string;
  features: string[];
  image: string;
}

export interface Testimonial {
  id: number;
  name: string;
  location: string;
  testimonial: string;
  rating: number;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}
export interface Package {
  id: string;
  title: string;
  duration: string;
  image: string;
  description: string;
  category: string;
  highlights: string[];
  inclusions: string[];
  itinerary: {
    day: string;
    activities: string[];
  }[];
}