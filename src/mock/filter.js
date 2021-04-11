
const watchlistCount = (films) => {
  return films.filter((film) => film.userAction.watchlist).length;
};

const favoriteCount = (films) => {
  return films.filter((film) => film.userAction.favorite).length;
};

const historyCount = (films) => {
  return films.filter((film) => film.userAction.alreadyWatched).length;
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
