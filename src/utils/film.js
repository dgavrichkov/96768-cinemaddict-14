import dayjs from 'dayjs';


export const trimDescription = (description) => {
  if(description.length <= 140) {
    return description;
  }

  const shortDescription = description.slice(0, 139).trim() + '...';
  return shortDescription;
};

export const defindRateColor = (rate) => {
  let sign = 'average';
  if(rate > 7) {
    sign = 'good';
  }
  if(rate < 4) {
    sign = 'poor';
  }
  return sign;
};

export const formatCommentDate = (date) => {
  const currDay = dayjs().date();
  const commentDay = dayjs(date).date();
  const dayDiff = currDay - commentDay;
  let commentDate = '';
  if(dayDiff === 0) {
    return commentDate = 'Today';
  }
  if(dayDiff <= 2 && dayDiff > 0) {
    let val = 'days';
    if(dayDiff === 1) {
      val = 'day';
    }
    return commentDate = `${dayDiff} ${val} ago`;
  }
  commentDate = dayjs(date).format('YYYY/MM/DD hh:mm');
  return commentDate;
};

export const defindGenreSign = (list) => {
  return (list.length > 1) ? 'Genres' : 'Genre';
};

export const userFilms = (films) => {
  return films.filter((film) => film.alreadyWatched === true);
};

export const minutesToFormat = (minutes) => {
  return `${Math.floor(minutes/60)}h ${minutes%60}m`;
};

export const sortFilmsByRates = (filmA, filmB) => {
  return Math.floor(filmB.rating - filmA.rating);
};

export const sortFilmsByComments = (filmA, filmB) => {
  return Math.floor(filmB.comments.length - filmA.comments.length);
};

export const sortFilmsByDate = (filmA, filmB) => {
  return dayjs(filmB.releaseDate).diff(dayjs(filmA.releaseDate));
};

export const getFilmContainer = (component) => {
  return component.getElement().querySelector('.films-list__container');
};

export const isPopupExist = () => {
  const popup = document.querySelector('.film-details');
  return popup !== null;
};
