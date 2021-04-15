import {GENRES} from './mock-const';

const getUserRank = (films) => {
  if(films.length > 20) {
    return 'Movie Buff';
  }
  if(films.length > 10) {
    return 'Fan';
  }
  if(films.length > 1) {
    return 'Novice';
  }
};

const getTotalDuration = (films) => {
  let minutes = 0;
  films.forEach((film) => {
    minutes = minutes + +film.runtime;
  });
  return minutes;
};

const getTopGenre = (films) => {
  const concat = [];
  films.forEach((film) => {
    concat.push(...film.genres);
  });
  const countGenres = {};
  GENRES.forEach((genre) => {
    countGenres[genre] = concat.filter((item) => item === genre).length;
  });
  const maxVal = Math.max(...Object.values(countGenres));
  const topGenre = Object.entries(countGenres).find((entry) => entry[1] === maxVal)[0];
  return topGenre;
};

export const generateUserstat = (films) => {
  return {
    userRank: getUserRank(films),
    totalDuration: getTotalDuration(films),
    topGenre: getTopGenre(films),
    historyCount: films.length,
  };
};
