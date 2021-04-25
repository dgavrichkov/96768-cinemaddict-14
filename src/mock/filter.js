
const watchlistCount = (films) => {
  return films.filter((film) => film.watchlist).length;
};

const favoriteCount = (films) => {
  return films.filter((film) => film.favorite).length;
};

const historyCount = (films) => {
  return films.filter((film) => film.alreadyWatched).length;
};

export const generateFilter = (films) => {
  const watchlist = watchlistCount(films);
  const favorite = favoriteCount(films);
  const history = historyCount(films);

  return {
    watchlist,
    favorite,
    history,
  };
};
