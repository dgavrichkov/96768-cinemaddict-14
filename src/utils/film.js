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
  return films.filter((film) => film.userAction.alreadyWatched === true);
};

export const minutesToFormat = (minutes) => {
  return `${Math.floor(minutes/60)}h ${minutes%60}m`;
};

export const sortFilmsByRates = (films) => {
  const sortFilms = [...films];
  sortFilms.sort((a, b) => {
    return Math.floor(b.rating - a.rating);
  });
  return sortFilms;
};

export const sortFilmsByComments = (films) => {
  const sortFilms = [...films];
  sortFilms.sort((a, b) => {
    return Math.floor(b.comments.length - a.comments.length);
  });
  return sortFilms;
};
