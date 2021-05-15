// export const

export const getUserRank = (films) => {
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

export const getTotalDuration = (films) => {
  let minutes = 0;
  films.forEach((film) => {
    minutes = minutes + +film.runtime;
  });
  return minutes;
};

export const getTopGenre = (films) => {
  const countGenres = getCountGenres(films);
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

export const getFilmsOnPeriod = (period) => {
  // получить разницу между сегодняшним днем и указанным периодом (день, неделя и тд) чтобы определить одну точку, текущий момент будет второй точкой
  // пройти по массиву фильмов и выяснить, которые из них попадают в диапазон между точками
  // вернуть этот массив, чтобы на его основе построить гурафик
};

export const getViewedFilms = (films) => {
  return films.filter((film) => film.alreadyWatched);
};

export const getCountGenres = (films) => {
  const concatGenres = [];
  const countGenres = {};

  films.forEach((film) => {
    concatGenres.push(...film.genres);
  });

  const uniqGenres = new Set(concatGenres);

  uniqGenres.forEach((genre) => {
    countGenres[genre] = concatGenres.filter((item) => item === genre).length;
  });
  return countGenres;
};
