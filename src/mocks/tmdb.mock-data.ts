import { TmdbMovie, TmdbPage, TmdbPerson, TmdbReview } from '../models/dashboard';

export const TRENDING_MOVIES_MOCK: TmdbPage<TmdbMovie> = {
  page: 1,
  total_pages: 1,
  total_results: 2,
  results: [
    {
      id: 11, title: 'Inception', poster_path: '/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg',
      backdrop_path: '/s3TBrRGB1iav7gFOCNx3H31MoES.jpg', vote_average: 8.4,
      release_date: '2010-07-15', overview: 'A thief who steals corporate secrets...'
    },
    {
      id: 550, title: 'Fight Club', poster_path: '/a26cQPRhJPX6GbWfQbvZdrrp9j9.jpg',
      backdrop_path: '/8uO0gUM8aNqYLs1OsTBQiXu0fEv.jpg', vote_average: 8.4,
      release_date: '1999-10-15', overview: 'An insomniac office worker...'
    }
  ]
};

export const TOP_RATED_MOVIES_MOCK: TmdbPage<TmdbMovie> = {
  page: 1, total_pages: 1, total_results: 2,
  results: [
    {
      id: 278, title: 'The Shawshank Redemption',
      poster_path: '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
      backdrop_path: '/xBKGJQsAIeweesB79KC89FpBrVr.jpg', vote_average: 8.7,
      release_date: '1994-09-23', overview: 'Framed banker Andy Dufresne...'
    },
    {
      id: 238, title: 'The Godfather',
      poster_path: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
      backdrop_path: '/tmU7GeKVybMWFButWEGl2M4GeiP.jpg', vote_average: 8.7,
      release_date: '1972-03-14', overview: 'Spanning the years 1945 to 1955...'
    }
  ]
};

export const POPULAR_PEOPLE_MOCK: TmdbPage<TmdbPerson> = {
  page: 1, total_pages: 1, total_results: 2,
  results: [
    {
      id: 287, name: 'Brad Pitt', profile_path: '/kU3B75TyRiCgE270EyZnHjfivoq.jpg',
      known_for_department: 'Acting', popularity: 100.2
    },
    {
      id: 6193, name: 'Leonardo DiCaprio', profile_path: '/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg',
      known_for_department: 'Acting', popularity: 120.1
    }
  ]
};

export const REVIEWS_MOCK: TmdbPage<TmdbReview> = {
  page: 1, total_pages: 1, total_results: 2,
  results: [
    {
      id: 'r1',
      author: 'MovieFan',
      content: 'Amazing movie with mind-bending plot twists. Nolan at his best.',
      url: 'https://www.themoviedb.org/review/r1'
    },
    {
      id: 'r2',
      author: 'CritiquePro',
      content: 'A masterclass in storytelling and editing. Must watch.',
      url: 'https://www.themoviedb.org/review/r2'
    }
  ]
};
