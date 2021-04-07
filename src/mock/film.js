import { nanoid } from 'nanoid';
import dayjs from 'dayjs';
import { getRandomInteger } from '../utils.js';

const FILM_NAMES = new Map([
  ['Lord of The Rings', 'Fellowship of The Ring'],
  ['Джентльмены', 'The Gentlemen'],
  ['Шанхайский полдень', 'Shanghai Noon'],
  ['Расплата', 'The Accountant'],
  ['Короли улиц', 'Street Kings'],
  ['Пес-призрак: Путь самурая', 'Ghost Dog: The Way of the Samurai'],
  ['Леон', 'Léon'],
  ['Тайлер Рейк: Операция по спасению', 'Extraction'],
  ['Олдбой', 'Oldeuboi'],
  ['Тройная граница', 'Triple Frontier'],
  ['Дьявол всегда здесь', 'The Devil All the Time'],
  ['Поезд на Юму', '3:10 to Yuma'],
  ['Гладиатор', 'Gladiator'],
  ['Изгой-один: Звёздные войны. Истории', 'Rogue One'],
  ['Шрэк', 'Shrek'],
  ['Крестный отец', 'The Godfather'],
  ['Зеленая книга', 'Green Book'],
  ['Храброе сердце', 'Braveheart'],
]);
const DESCRIPTION = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';
const POSTERS_DIR_PATH = './images/posters/';
const POSTERS = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg',
];
const GENRES = [
  'Вестерн',
  'Триллер',
  'Семейный фильм',
  'Боевик',
  'Исторический',
  'Мелодрама',
  'Фэнтези',
  'Приключения',
  'Драма',
];

const filmNamesList = Array.from(FILM_NAMES.keys());
// const filmAltNamesList = Array.from(filmNamesMap.values());

const generateFilmName = () => {
  const randIdx = getRandomInteger(0, filmNamesList.length - 1);
  const filmName = filmNamesList[randIdx];
  return filmName;
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
  const hours = getRandomInteger(1, 3);
  const minutes = getRandomInteger(0, 59);
  const time = `${hours}h ${minutes ? minutes :'00'}m`;
  return time;
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

const generateFilmGenre = (single) => {
  return GENRES[getRandomInteger(0, GENRES.length - 1)];
};

export const generateFilm = () => {
  const id = nanoid();
  return {
    id,
    name: generateFilmName(),
    poster: generateFilmPoster(),
    description: generateFilmDescription(DESCRIPTION),
    comments: [],
    total_rating: generateFilmRating(),
    release_date: null,
    runtime: generateFilmRuntime(),
    genre: generateFilmGenre(),
  };
};
