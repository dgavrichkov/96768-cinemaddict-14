import {nanoid} from 'nanoid';
import dayjs from 'dayjs';
import {getRandomInteger} from '../utils/common.js';
import * as MOCKSRC from '../mock/mock-const.js';

const filmNamesList = Array.from(MOCKSRC.FILM_NAMES.keys());

const generateFilmName = () => {
  const randIdx = getRandomInteger(0, filmNamesList.length - 1);
  return filmNamesList[randIdx];
};

const getOriginName = (name) => {
  return MOCKSRC.FILM_NAMES.get(name);
};

const generateFilmDescription = () => {
  const SENTENEC_MIN = 1;
  const SENTENEC_MAX = 5;
  const sentencesArr = MOCKSRC.DESCRIPTION.split('. ');
  const sentencesCount = getRandomInteger(SENTENEC_MIN, SENTENEC_MAX);
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
  const RUNTIME_MIN = 90;
  const RUNTIME_MAX = 220;
  return getRandomInteger(RUNTIME_MIN, RUNTIME_MAX);
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
  const idx = getRandomInteger(0, MOCKSRC.POSTERS.length - 1);
  return MOCKSRC.POSTERS_DIR_PATH + MOCKSRC.POSTERS[idx];
};

const generateFilmGenre = () => {
  const GENRECOUNT_MIN = 1;
  const GENRECOUNT_MAX = 4;
  const count = getRandomInteger(GENRECOUNT_MIN, GENRECOUNT_MAX);
  const list = new Set();
  do {
    const idx = getRandomInteger(0, MOCKSRC.GENRES.length - 1);
    list.add(MOCKSRC.GENRES[idx]);
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
    emoji: MOCKSRC.EMOTIONS[getRandomInteger(0, MOCKSRC.EMOTIONS.length - 1)],
    text: MOCKSRC.COMMENT_TEXTS[getRandomInteger(0, MOCKSRC.COMMENT_TEXTS.length - 1)],
    author: MOCKSRC.COMMENT_AUTHOR[getRandomInteger(0, MOCKSRC.COMMENT_AUTHOR.length - 1)],
    date,
  };
  return comment;
};

const generateFilmComments = (releaseDate) => {
  const MAX_COMMENT_COUNT = 5;
  const commentsCount = getRandomInteger(0, MAX_COMMENT_COUNT);
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
  return MOCKSRC.AGE_RATES[getRandomInteger(0, MOCKSRC.AGE_RATES.length - 1)];
};

const generateFilmDiretor = () => {
  return MOCKSRC.FILM_DIRECTORS[getRandomInteger(0, MOCKSRC.FILM_DIRECTORS.length - 1)];
};

const generateFilmWriters = () => {
  const arr = MOCKSRC.WRITERS;
  const WRITERS_COUNT_MIN = 1;
  const WRITERS_COUNT_MAX = 4;
  const count = getRandomInteger(WRITERS_COUNT_MIN, WRITERS_COUNT_MAX);
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
  const arr = MOCKSRC.ACTORS;
  const ACTORS_COUNT_MIN = 3;
  const ACTORS_COUNT_MAX = 6;
  const count = getRandomInteger(ACTORS_COUNT_MIN, ACTORS_COUNT_MAX);
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
  return MOCKSRC.COUNTRIES[getRandomInteger(0, MOCKSRC.COUNTRIES.length - 1)];
};

export const generateFilm = () => {
  const name = generateFilmName();
  const releaseDate = generateFilmReleaseDate();
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
    description: generateFilmDescription(MOCKSRC.DESCRIPTION),
    comments,
    rating: generateFilmRating(),
    releaseDate: releaseDate.format('D MMMM YYYY'),
    runtime: generateFilmRuntime(),
    genres: generateFilmGenre(),
    ageRating: generateFilmAgeRate(),
    director: generateFilmDiretor(),
    country: generateFilmCountry(),
    writers: generateFilmWriters(),
    actors: generateFilmActors(),
    watchlist: Boolean(getRandomInteger(0, 1)),
    alreadyWatched,
    watchingDate,
    favorite: Boolean(getRandomInteger(0, 1)),
  };
};
