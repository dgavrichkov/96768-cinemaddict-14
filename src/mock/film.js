import {nanoid} from 'nanoid';
import dayjs from 'dayjs';
import {getRandomInteger} from '../utils.js';
import {GENRES, DESCRIPTION, POSTERS_DIR_PATH, POSTERS, EMOTIONS, FILM_NAMES, AGE_RATES, FILM_DIRECTORS, WRITERS, ACTORS, COMMENT_TEXTS, COMMENT_AUTHOR, COUNTRIES} from '../mock/mock-const.js';

const filmNamesList = Array.from(FILM_NAMES.keys());

const generateFilmName = () => {
  const randIdx = getRandomInteger(0, filmNamesList.length - 1);
  const filmName = filmNamesList[randIdx];
  return filmName;
};

const getOriginName = (name) => {
  return FILM_NAMES.get(name);
};

const generateFilmDescription = () => {
  const sentencesArr = DESCRIPTION.split('. ');
  const sentencesCount = getRandomInteger(1, 5);
  const descSet = new Set();
  do {
    const idx = getRandomInteger(0, sentencesArr.length - 1);
    descSet.add(sentencesArr[idx]);
  }
  while(sentencesCount > descSet.size);

  const filmDescrption = Array.from(descSet).join('. ').trim();

  return filmDescrption;
};

const generateFilmRuntime = () => {
  return getRandomInteger(90, 220);
};

const generateFilmRating = () => {
  const int = getRandomInteger(1, 10);
  let dec = getRandomInteger(0, 9);
  if(int === 10) {
    dec = 0;
  }
  const rate = `${int}.${dec}`;

  return rate;
};

const generateFilmPoster = () => {
  const idx = getRandomInteger(0, POSTERS.length - 1);
  return POSTERS_DIR_PATH + POSTERS[idx];
};

const generateFilmGenre = () => {
  const count = getRandomInteger(1, 4);
  const arr = GENRES;
  const list = new Set();
  do {
    const idx = getRandomInteger(0, arr.length - 1);
    list.add(arr[idx]);
  }
  while(count > list.size);
  return Array.from(list);
};

const generateCommentDate = () => {
  const maxDaysGap = -14;
  const daysGap = getRandomInteger(maxDaysGap, 0);
  const hour = getRandomInteger(1, 23);
  const min = getRandomInteger(0, 59);
  const date = dayjs().add(daysGap, 'day').hour(hour).minute(min).toDate();
  return date;
};

const generateComment = (releaseDate) => {
  let date = generateCommentDate();
  if(!dayjs().isAfter(releaseDate)) {
    date = dayjs();
  }

  const comment = {
    emoji: EMOTIONS[getRandomInteger(0, EMOTIONS.length - 1)],
    text: COMMENT_TEXTS[getRandomInteger(0, COMMENT_TEXTS.length - 1)],
    author: COMMENT_AUTHOR[getRandomInteger(0, COMMENT_AUTHOR.length - 1)],
    date,
  };
  return comment;
};

const generateFilmComments = (releaseDate) => {
  const commentsCount = getRandomInteger(0, 5);
  const comments = new Array();
  for(let i = 0; i < commentsCount; i++) {
    comments.push(generateComment(releaseDate));
  }
  return comments;
};

const generateFilmReleaseDate = () => {
  const randYear = getRandomInteger(1960, 2021);
  const randMonth = getRandomInteger(1, 12);
  const randDay = (randMonth) => {
    if(!(randMonth % 2)) {
      return(getRandomInteger(1, 31));
    }
    if(randMonth === 2) {
      return getRandomInteger(1, 28);
    }
    return getRandomInteger(1, 30);
  };
  const release = dayjs().year(randYear).month(randMonth).date(randDay());
  return release;
};

const generateFilmAgeRate = () => {
  return AGE_RATES[getRandomInteger(0, AGE_RATES.length - 1)];
};

const generateFilmDiretor = () => {
  return FILM_DIRECTORS[getRandomInteger(0, FILM_DIRECTORS.length - 1)];
};

const generateFilmWriters = () => {
  const arr = WRITERS;
  const count = getRandomInteger(1, 4);
  const list = new Set();
  do {
    const idx = getRandomInteger(0, arr.length - 1);
    list.add(arr[idx]);
  }
  while(count > list.size);

  const string = Array.from(list).join(', ').trim();

  return string;
};

const generateFilmActors = () => {
  const arr = ACTORS;
  const count = getRandomInteger(1, 6);
  const list = new Set();
  do {
    const idx = getRandomInteger(0, arr.length - 1);
    list.add(arr[idx]);
  }
  while(count > list.size);

  const string = Array.from(list).join(', ').trim();

  return string;
};

const generateFilmCountry = () => {
  return COUNTRIES[getRandomInteger(0, COUNTRIES.length - 1)];
};

export const generateFilm = () => {
  const name = generateFilmName();
  const releaseDate = generateFilmReleaseDate();
  const releaseYear = releaseDate.year();
  const comments = generateFilmComments(releaseDate);
  const alreadyWatched = Boolean(getRandomInteger(0, 1));
  let watchingDate = null;
  if(alreadyWatched === true) {
    watchingDate = dayjs();
  }
  return {
    id: nanoid(),
    name,
    originName: getOriginName(name),
    poster: generateFilmPoster(),
    description: generateFilmDescription(DESCRIPTION),
    comments,
    rating: generateFilmRating(),
    releaseDate: releaseDate.format('D MMMM YYYY'),
    releaseYear,
    runtime: generateFilmRuntime(),
    genres: generateFilmGenre(),
    ageRating: generateFilmAgeRate(),
    director: generateFilmDiretor(),
    country: generateFilmCountry(),
    writers: generateFilmWriters(),
    actors: generateFilmActors(),
    userAction: {
      watchlist: Boolean(getRandomInteger(0, 1)),
      alreadyWatched,
      watchingDate,
      favorite: Boolean(getRandomInteger(0, 1)),
    },
  };
};
