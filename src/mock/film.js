import { nanoid } from 'nanoid';
import dayjs from 'dayjs';
import { getRandomInteger } from '../utils.js';
import { GENRES, DESCRIPTION, POSTERS_DIR_PATH, POSTERS, EMOTIONS, FILM_NAMES } from '../const.js';

const filmNamesList = Array.from(FILM_NAMES.keys());
// const filmAltNamesList = Array.from(filmNamesMap.values());

const generateFilmName = () => {
  const randIdx = getRandomInteger(0, filmNamesList.length - 1);
  const filmName = filmNamesList[randIdx];
  return filmName;
};
const getOriginName = (name) => {
  return FILM_NAMES.get(name);
};
const generateFilmDescription = (string) => {
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
  const time = getRandomInteger(90, 220);
  return `${Math.floor(time/60)}h ${time%60}min`;
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
  return GENRES[getRandomInteger(0, GENRES.length - 1)];
};

// TODO - сгенерировать массив комментариев
const generateFilmCommentsCount = () => {
  const commentsCount = getRandomInteger(0, 5);
  return commentsCount;
};
// TODO - срандомить дату в формате dayjs, чтобы можно было вывести подробную дату в попапе
const generateFilmReleaseDate = () => {
  const release = dayjs();
  return release;
};

export const generateFilm = () => {
  const name = generateFilmName();
  const year = generateFilmReleaseDate().year();
  return {
    id: nanoid(),
    name,
    originName: getOriginName(name),
    poster: generateFilmPoster(),
    description: generateFilmDescription(DESCRIPTION),
    comments: generateFilmCommentsCount(),
    rating: generateFilmRating(),
    releaseYear: year,
    runtime: generateFilmRuntime(),
    genre: generateFilmGenre(),
    ageRating: null,
    director: '',
    writers: [],
    actors: [],
    watchlist: false,
  };
};
