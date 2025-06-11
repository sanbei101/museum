export type Artifact = {
  id: string;
  name: string;
  era: string;
  image: string;
  category: string;
  description: string;
  likes: number;
};

export type Exhibition = {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  image: string;
  artifactIds: string[];
  status: 'upcoming' | 'ongoing' | 'ended';
  location: string;
  likes: number;
};

export type Page<T> = {
  items: T[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
};
