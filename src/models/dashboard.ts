export interface TmdbPage<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TmdbMovie {
  id: number;
  title: string;
  name?: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  release_date?: string | null;
  overview?: string;
}

export interface TmdbPerson {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department?: string;
  popularity?: number;
}

export interface TmdbReview {
  id: string;
  author: string;
  content: string;
  url: string;
}

export interface TmdbVideo {
  key: string;
  site: string;
  type: string;
  name: string;
  official?: boolean;
  published_at?: string;
};

export interface SideSlide {
  key: string;
  sourceIndex: number;
  title?: string;
  imgSrc: string | null;
  releaseDate?: string | Date;
  name?: string;
  rating?: number;
}
