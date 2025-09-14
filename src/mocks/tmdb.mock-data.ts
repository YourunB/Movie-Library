import { TmdbMovie, TmdbPage, TmdbPerson, TmdbReview } from '../models/dashboard';

export const TRENDING_MOVIES_MOCK: TmdbPage<TmdbMovie> = {
  "page": 1,
  "total_pages": 1,
  "total_results": 24,
  "results": [
    {
      "id": 1100,
      "title": "Neon Garden",
      "poster_path": "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/8uO0gUM8aNqYLs1OsTBQiXu0fEv.jpg",
      "vote_average": 7.8,
      "release_date": "1988-06-04",
      "overview": "When a weary musician discovers a sealed archive, a race against a ruthless guild begins."
    },
    {
      "id": 1101,
      "title": "Crimson Shores",
      "poster_path": "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
      "vote_average": 8.5,
      "release_date": "2017-05-07",
      "overview": "Amid the frozen frontier, a haunted detective faces a vanishing sun that could change their family forever."
    },
    {
      "id": 1102,
      "title": "Electric Chord",
      "poster_path": "https://image.tmdb.org/t/p/w500/a26cQPRhJPX6GbWfQbvZdrrp9j9.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/8uO0gUM8aNqYLs1OsTBQiXu0fEv.jpg",
      "vote_average": 8.4,
      "release_date": "1989-07-10",
      "overview": "When an exiled pilot discovers a restless AI, a race against time begins."
    },
    {
      "id": 1103,
      "title": "Golden Witness: A New Dawn",
      "poster_path": "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
      "vote_average": 7.6,
      "release_date": "1989-05-01",
      "overview": "Amid the frozen frontier, a weary musician faces a conspiracy of silence that could change the dynasty forever."
    },
    {
      "id": 1104,
      "title": "Golden Garden",
      "poster_path": "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/xBKGJQsAIeweesB79KC89FpBrVr.jpg",
      "vote_average": 6.8,
      "release_date": "2008-10-02",
      "overview": "When a haunted detective discovers a mirror world, a race against their own past begins."
    },
    {
      "id": 1105,
      "title": "Neon City: Of Two Worlds",
      "poster_path": "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/8uO0gUM8aNqYLs1OsTBQiXu0fEv.jpg",
      "vote_average": 8.6,
      "release_date": "2003-10-17",
      "overview": "When a quiet botanist discovers a missing day, a race against their own past begins."
    },
    {
      "id": 1106,
      "title": "Crimson Promise",
      "poster_path": "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
      "vote_average": 7.1,
      "release_date": "1991-06-03",
      "overview": "When a quiet botanist discovers a sealed archive, a race against their own past begins."
    },
    {
      "id": 1107,
      "title": "Silent Garden",
      "poster_path": "https://image.tmdb.org/t/p/w500/a26cQPRhJPX6GbWfQbvZdrrp9j9.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/8uO0gUM8aNqYLs1OsTBQiXu0fEv.jpg",
      "vote_average": 8.4,
      "release_date": "1988-09-01",
      "overview": "When a runaway noble discovers a sealed archive, a race against their own past begins."
    },
    {
      "id": 1108,
      "title": "Distant Labyrinth",
      "poster_path": "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
      "vote_average": 6.9,
      "release_date": "1981-11-06",
      "overview": "Amid the drifting colonies, an unlikely hacker faces a vanishing sun that could change their family forever."
    },
    {
      "id": 1109,
      "title": "Crimson Horizon: Under Glass",
      "poster_path": "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
      "vote_average": 9.2,
      "release_date": "1992-09-20",
      "overview": "Amid the high desert, an exiled pilot faces a vanishing sun that could change their city forever."
    },
    {
      "id": 1110,
      "title": "Secret Horizon",
      "poster_path": "https://image.tmdb.org/t/p/w500/a26cQPRhJPX6GbWfQbvZdrrp9j9.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/8uO0gUM8aNqYLs1OsTBQiXu0fEv.jpg",
      "vote_average": 9.5,
      "release_date": "2002-04-08",
      "overview": "When a quiet botanist discovers an impossible map, a race against their own past begins."
    },
    {
      "id": 1111,
      "title": "Midnight City",
      "poster_path": "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/xBKGJQsAIeweesB79KC89FpBrVr.jpg",
      "vote_average": 6.9,
      "release_date": "1980-08-03",
      "overview": "When a runaway noble discovers a sealed archive, a race against their own past begins."
    },
    {
      "id": 1112,
      "title": "Neon Mask: The Reckoning",
      "poster_path": "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
      "vote_average": 6.8,
      "release_date": "2011-04-22",
      "overview": "Amid the drifting colonies, a quiet botanist faces a vanishing sun that could change their family forever."
    },
    {
      "id": 1113,
      "title": "Distant Shadows",
      "poster_path": "https://image.tmdb.org/t/p/w500/a26cQPRhJPX6GbWfQbvZdrrp9j9.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/xBKGJQsAIeweesB79KC89FpBrVr.jpg",
      "vote_average": 6.6,
      "release_date": "1977-07-10",
      "overview": "When an exiled pilot discovers an impossible map, a race against time begins."
    },
    {
      "id": 1114,
      "title": "Electric City",
      "poster_path": "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
      "vote_average": 8.7,
      "release_date": "2015-12-02",
      "overview": "When a weary musician discovers a sealed archive, a race against their own past begins."
    },
    {
      "id": 1115,
      "title": "Secret Shores",
      "poster_path": "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/xBKGJQsAIeweesB79KC89FpBrVr.jpg",
      "vote_average": 9.3,
      "release_date": "2004-08-19",
      "overview": "Amid the high desert, a runaway noble faces a vanishing sun that could change the academy forever."
    },
    {
      "id": 1116,
      "title": "Golden Echoes",
      "poster_path": "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
      "vote_average": 8.4,
      "release_date": "2017-03-02",
      "overview": "When a haunted detective discovers a message from the sea, a race against the winter begins."
    },
    {
      "id": 1117,
      "title": "Crimson River: A New Dawn",
      "poster_path": "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
      "vote_average": 7.9,
      "release_date": "1991-06-07",
      "overview": "Amid the high desert, an unlikely hacker faces a stolen identity that could change their family forever."
    },
    {
      "id": 1118,
      "title": "Hidden Promise",
      "poster_path": "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/xBKGJQsAIeweesB79KC89FpBrVr.jpg",
      "vote_average": 7.7,
      "release_date": "2001-06-17",
      "overview": "Amid the high desert, a quiet botanist faces an outlawed melody that could change their city forever."
    },
    {
      "id": 1119,
      "title": "Frozen Echoes",
      "poster_path": "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
      "vote_average": 7.2,
      "release_date": "2015-05-06",
      "overview": "In the wake of the midsummer blackout, a haunted detective must choose between forgiveness and power."
    },
    {
      "id": 1120,
      "title": "Eternal Circuit: Edge of Time",
      "poster_path": "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/8uO0gUM8aNqYLs1OsTBQiXu0fEv.jpg",
      "vote_average": 8.8,
      "release_date": "1985-10-22",
      "overview": "When a quiet botanist discovers a mirror world, a race against their own past begins."
    },
    {
      "id": 1121,
      "title": "Crimson Garden",
      "poster_path": "https://image.tmdb.org/t/p/w500/a26cQPRhJPX6GbWfQbvZdrrp9j9.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/8uO0gUM8aNqYLs1OsTBQiXu0fEv.jpg",
      "vote_average": 8.7,
      "release_date": "2005-05-06",
      "overview": "When an unlikely hacker discovers a missing day, a race against the winter begins."
    },
    {
      "id": 1122,
      "title": "Frozen River: Of Two Worlds",
      "poster_path": "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
      "vote_average": 8.6,
      "release_date": "1978-05-04",
      "overview": "Amid a coastal town, a quiet botanist faces a stolen identity that could change their family forever."
    },
    {
      "id": 1123,
      "title": "Last Shores",
      "poster_path": "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
      "vote_average": 7.9,
      "release_date": "1998-06-15",
      "overview": "Amid the drifting colonies, a weary musician faces a vanishing sun that could change their city forever."
    }
  ]
};
export const TOP_RATED_MOVIES_MOCK: TmdbPage<TmdbMovie> = {
  "page": 1,
  "total_pages": 1,
  "total_results": 24,
  "results": [
    {
      "id": 2100,
      "title": "Golden Promise",
      "poster_path": "https://image.tmdb.org/t/p/w500/a26cQPRhJPX6GbWfQbvZdrrp9j9.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/8uO0gUM8aNqYLs1OsTBQiXu0fEv.jpg",
      "vote_average": 9.3,
      "release_date": "1975-03-25",
      "overview": "Amid a coastal town, a quiet botanist faces a stolen identity that could change their family forever."
    },
    {
      "id": 2101,
      "title": "First City: Of Two Worlds",
      "poster_path": "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/8uO0gUM8aNqYLs1OsTBQiXu0fEv.jpg",
      "vote_average": 8.9,
      "release_date": "2012-04-02",
      "overview": "When a weary musician discovers an impossible map, a race against time begins."
    },
    {
      "id": 2102,
      "title": "Hidden Circuit",
      "poster_path": "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
      "vote_average": 9.2,
      "release_date": "1991-07-02",
      "overview": "Amid the frozen frontier, a runaway noble faces a vanishing sun that could change the academy forever."
    },
    {
      "id": 2103,
      "title": "Wild Empire: Edge of Time",
      "poster_path": "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
      "vote_average": 8.9,
      "release_date": "1978-04-10",
      "overview": "When an unlikely hacker discovers a missing day, a race against their own past begins."
    },
    {
      "id": 2104,
      "title": "Wild Witness",
      "poster_path": "https://image.tmdb.org/t/p/w500/a26cQPRhJPX6GbWfQbvZdrrp9j9.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/xBKGJQsAIeweesB79KC89FpBrVr.jpg",
      "vote_average": 7.7,
      "release_date": "2007-07-05",
      "overview": "When a weary musician discovers a mirror world, a race against their own past begins."
    },
    {
      "id": 2105,
      "title": "Neon River",
      "poster_path": "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
      "vote_average": 7.4,
      "release_date": "1990-12-06",
      "overview": "When a runaway noble discovers a sealed archive, a race against a ruthless guild begins."
    },
    {
      "id": 2106,
      "title": "Electric Echoes",
      "poster_path": "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
      "vote_average": 8.2,
      "release_date": "1982-10-08",
      "overview": "Amid a neon metropolis, an exiled pilot faces an outlawed melody that could change their family forever."
    },
    {
      "id": 2107,
      "title": "Golden Mask: Under Glass",
      "poster_path": "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
      "vote_average": 9.9,
      "release_date": "2010-12-02",
      "overview": "Amid the high desert, a quiet botanist faces a vanishing sun that could change their family forever."
    },
    {
      "id": 2108,
      "title": "Hidden Comet",
      "poster_path": "https://image.tmdb.org/t/p/w500/a26cQPRhJPX6GbWfQbvZdrrp9j9.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/8uO0gUM8aNqYLs1OsTBQiXu0fEv.jpg",
      "vote_average": 8.7,
      "release_date": "1985-04-10",
      "overview": "Amid the drifting colonies, a runaway noble faces a vanishing sun that could change the dynasty forever."
    },
    {
      "id": 2109,
      "title": "Crimson Witness",
      "poster_path": "https://image.tmdb.org/t/p/w500/a26cQPRhJPX6GbWfQbvZdrrp9j9.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
      "vote_average": 9.1,
      "release_date": "1991-09-11",
      "overview": "Amid the drifting colonies, a quiet botanist faces a conspiracy of silence that could change their family forever."
    },
    {
      "id": 2110,
      "title": "Neon Shores",
      "poster_path": "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
      "vote_average": 7.3,
      "release_date": "1988-07-04",
      "overview": "Amid a coastal town, a quiet botanist faces an outlawed melody that could change their family forever."
    },
    {
      "id": 2111,
      "title": "Crimson Lines",
      "poster_path": "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/8uO0gUM8aNqYLs1OsTBQiXu0fEv.jpg",
      "vote_average": 8.3,
      "release_date": "2017-06-21",
      "overview": "Amid the drifting colonies, a weary musician faces a stolen identity that could change their city forever."
    },
    {
      "id": 2112,
      "title": "Golden Chord",
      "poster_path": "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
      "vote_average": 8.8,
      "release_date": "1976-10-19",
      "overview": "Amid the frozen frontier, a weary musician faces a conspiracy of silence that could change the resistance forever."
    },
    {
      "id": 2113,
      "title": "Wild River",
      "poster_path": "https://image.tmdb.org/t/p/w500/a26cQPRhJPX6GbWfQbvZdrrp9j9.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/xBKGJQsAIeweesB79KC89FpBrVr.jpg",
      "vote_average": 8.5,
      "release_date": "1982-11-11",
      "overview": "Amid the drifting colonies, a weary musician faces a vanishing sun that could change the dynasty forever."
    },
    {
      "id": 2114,
      "title": "Crimson City",
      "poster_path": "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/xBKGJQsAIeweesB79KC89FpBrVr.jpg",
      "vote_average": 9.2,
      "release_date": "1999-08-16",
      "overview": "Amid a coastal town, a quiet botanist faces a vanishing sun that could change their city forever."
    },
    {
      "id": 2115,
      "title": "Golden River",
      "poster_path": "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
      "vote_average": 8.1,
      "release_date": "1997-05-19",
      "overview": "Amid the frozen frontier, a quiet botanist faces a stolen identity that could change their family forever."
    },
    {
      "id": 2116,
      "title": "Secret Mask: A New Dawn",
      "poster_path": "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
      "vote_average": 9.2,
      "release_date": "1984-05-23",
      "overview": "Amid the frozen frontier, an unlikely hacker faces an outlawed melody that could change their city forever."
    },
    {
      "id": 2117,
      "title": "Crimson Garden: After the Fall",
      "poster_path": "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/8uO0gUM8aNqYLs1OsTBQiXu0fEv.jpg",
      "vote_average": 7.6,
      "release_date": "1979-10-13",
      "overview": "Amid the frozen frontier, a quiet botanist faces a vanishing sun that could change their city forever."
    },
    {
      "id": 2118,
      "title": "Last Empire",
      "poster_path": "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/xBKGJQsAIeweesB79KC89FpBrVr.jpg",
      "vote_average": 8.3,
      "release_date": "1988-08-07",
      "overview": "Amid the frozen frontier, a weary musician faces a stolen identity that could change their family forever."
    },
    {
      "id": 2119,
      "title": "Electric Shores: Edge of Time",
      "poster_path": "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
      "vote_average": 9.5,
      "release_date": "1977-07-13",
      "overview": "When a weary musician discovers a message from the sea, a race against their own past begins."
    },
    {
      "id": 2120,
      "title": "Crimson City: Of Two Worlds",
      "poster_path": "https://image.tmdb.org/t/p/w500/a26cQPRhJPX6GbWfQbvZdrrp9j9.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/xBKGJQsAIeweesB79KC89FpBrVr.jpg",
      "vote_average": 8.0,
      "release_date": "1976-12-26",
      "overview": "Amid the drifting colonies, a runaway noble faces a vanishing sun that could change their family forever."
    },
    {
      "id": 2121,
      "title": "Electric Circuit",
      "poster_path": "https://image.tmdb.org/t/p/w500/a26cQPRhJPX6GbWfQbvZdrrp9j9.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
      "vote_average": 8.1,
      "release_date": "2008-09-09",
      "overview": "When a haunted detective discovers a missing day, a race against their own past begins."
    },
    {
      "id": 2122,
      "title": "Velvet Witness",
      "poster_path": "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/xBKGJQsAIeweesB79KC89FpBrVr.jpg",
      "vote_average": 8.9,
      "release_date": "1987-09-03",
      "overview": "Amid the frozen frontier, a quiet botanist faces a coded prophecy that could change their family forever."
    },
    {
      "id": 2123,
      "title": "Wild City: Between Stars",
      "poster_path": "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/xBKGJQsAIeweesB79KC89FpBrVr.jpg",
      "vote_average": 8.9,
      "release_date": "1986-07-03",
      "overview": "Amid the frozen frontier, a quiet botanist faces a conspiracy of silence that could change their family forever."
    }
  ]
};
export const POPULAR_PEOPLE_MOCK: TmdbPage<TmdbPerson> = {
  "page": 1,
  "total_pages": 1,
  "total_results": 20,
  "results": [
    {
      "id": 5100,
      "name": "Logan Ortega",
      "profile_path": "https://image.tmdb.org/t/p/w300/kU3B75TyRiCgE270EyZnHjfivoq.jpg",
      "known_for_department": "Acting",
      "popularity": 201.4
    },
    {
      "id": 5101,
      "name": "Cameron Kaya",
      "profile_path": "https://image.tmdb.org/t/p/w300/kU3B75TyRiCgE270EyZnHjfivoq.jpg",
      "known_for_department": "Acting",
      "popularity": 153.0
    },
    {
      "id": 5102,
      "name": "Logan Khan",
      "profile_path": "https://image.tmdb.org/t/p/w300/kU3B75TyRiCgE270EyZnHjfivoq.jpg",
      "known_for_department": "Acting",
      "popularity": 129.2
    },
    {
      "id": 5103,
      "name": "Drew Dubois",
      "profile_path": "https://image.tmdb.org/t/p/w300/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg",
      "known_for_department": "Acting",
      "popularity": 81.2
    },
    {
      "id": 5104,
      "name": "Micah Nguyen",
      "profile_path": "https://image.tmdb.org/t/p/w300/kU3B75TyRiCgE270EyZnHjfivoq.jpg",
      "known_for_department": "Acting",
      "popularity": 197.5
    },
    {
      "id": 5105,
      "name": "Rowan Rivera",
      "profile_path": "https://image.tmdb.org/t/p/w300/kU3B75TyRiCgE270EyZnHjfivoq.jpg",
      "known_for_department": "Acting",
      "popularity": 206.5
    },
    {
      "id": 5106,
      "name": "Micah Silva",
      "profile_path": "https://image.tmdb.org/t/p/w300/kU3B75TyRiCgE270EyZnHjfivoq.jpg",
      "known_for_department": "Acting",
      "popularity": 82.1
    },
    {
      "id": 5107,
      "name": "Sage Novak",
      "profile_path": "https://image.tmdb.org/t/p/w300/kU3B75TyRiCgE270EyZnHjfivoq.jpg",
      "known_for_department": "Acting",
      "popularity": 189.2
    },
    {
      "id": 5108,
      "name": "Blake Laurent",
      "profile_path": "https://image.tmdb.org/t/p/w300/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg",
      "known_for_department": "Acting",
      "popularity": 110.8
    },
    {
      "id": 5109,
      "name": "Riley Becker",
      "profile_path": "https://image.tmdb.org/t/p/w300/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg",
      "known_for_department": "Acting",
      "popularity": 207.3
    },
    {
      "id": 5110,
      "name": "Cameron Khan",
      "profile_path": "https://image.tmdb.org/t/p/w300/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg",
      "known_for_department": "Acting",
      "popularity": 227.3
    },
    {
      "id": 5111,
      "name": "Micah Khan",
      "profile_path": "https://image.tmdb.org/t/p/w300/kU3B75TyRiCgE270EyZnHjfivoq.jpg",
      "known_for_department": "Acting",
      "popularity": 220.9
    },
    {
      "id": 5112,
      "name": "Avery Khan",
      "profile_path": "https://image.tmdb.org/t/p/w300/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg",
      "known_for_department": "Acting",
      "popularity": 133.2
    },
    {
      "id": 5113,
      "name": "Cameron Costa",
      "profile_path": "https://image.tmdb.org/t/p/w300/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg",
      "known_for_department": "Acting",
      "popularity": 178.7
    },
    {
      "id": 5114,
      "name": "Elliot Hansen",
      "profile_path": "https://image.tmdb.org/t/p/w300/kU3B75TyRiCgE270EyZnHjfivoq.jpg",
      "known_for_department": "Acting",
      "popularity": 185.6
    },
    {
      "id": 5115,
      "name": "Reese Dubois",
      "profile_path": "https://image.tmdb.org/t/p/w300/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg",
      "known_for_department": "Acting",
      "popularity": 92.0
    },
    {
      "id": 5116,
      "name": "Cameron Rivera",
      "profile_path": "https://image.tmdb.org/t/p/w300/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg",
      "known_for_department": "Acting",
      "popularity": 136.8
    },
    {
      "id": 5117,
      "name": "Cameron Cruz",
      "profile_path": "https://image.tmdb.org/t/p/w300/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg",
      "known_for_department": "Acting",
      "popularity": 126.3
    },
    {
      "id": 5118,
      "name": "Cameron Nowak",
      "profile_path": "https://image.tmdb.org/t/p/w300/kU3B75TyRiCgE270EyZnHjfivoq.jpg",
      "known_for_department": "Acting",
      "popularity": 154.2
    },
    {
      "id": 5119,
      "name": "Avery Cruz",
      "profile_path": "https://image.tmdb.org/t/p/w300/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg",
      "known_for_department": "Acting",
      "popularity": 182.0
    }
  ]
};
export const REVIEWS_MOCK: TmdbPage<TmdbReview> = {
  "page": 1,
  "total_pages": 1,
  "total_results": 6,
  "results": [
    {
      "id": "rev_1100_0",
      "author": "Logan Dubois",
      "content": "A surprising piece of cinema with standout dialogue. A stylish, moody knockout. (review #1).",
      "url": "https://www.themoviedb.org/review/rev_1100_0"
    },
    {
      "id": "rev_1100_1",
      "author": "Cameron Morgan",
      "content": "A intimate piece of cinema with standout direction. A crowd-pleaser with brains. (review #2).",
      "url": "https://www.themoviedb.org/review/rev_1100_1"
    },
    {
      "id": "rev_1100_2",
      "author": "Finley Silva",
      "content": "A intimate piece of cinema with standout performances. A confident step forward. (review #3).",
      "url": "https://www.themoviedb.org/review/rev_1100_2"
    },
    {
      "id": "rev_1100_3",
      "author": "Logan Khan",
      "content": "A intimate piece of cinema with standout structure. A stylish, moody knockout. (review #4).",
      "url": "https://www.themoviedb.org/review/rev_1100_3"
    },
    {
      "id": "rev_1100_4",
      "author": "Elliot Ortega",
      "content": "A heartfelt piece of cinema with standout direction. A confident step forward. (review #5).",
      "url": "https://www.themoviedb.org/review/rev_1100_4"
    },
    {
      "id": "rev_1100_5",
      "author": "Elliot Khan",
      "content": "A intimate piece of cinema with standout dialogue. Worth the price of admission. (review #6).",
      "url": "https://www.themoviedb.org/review/rev_1100_5"
    }
  ]
};
