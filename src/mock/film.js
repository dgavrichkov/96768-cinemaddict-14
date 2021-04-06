import { nanoid } from 'nanoid';
import {getRandomInteger} from '../utils.js';

const filmNamesMap = new Map([
  ['Lord of The Rings', 'Fellowship of The Ring'],
  ['Джентльмены', 'The Gentlemen'],
  ['Шанхайский полдень', 'Shanghai Noon'],
  ['Расплата', 'The Accountant'],
  ['Короли улиц', 'Street Kings'],
  ['Пес-призрак: Путь самурая', 'Ghost Dog: The Way of the Samurai'],
  ['Леон', 'Léon'],
  ['Тайлер Рейк: Операция по спасению', 'Extraction'],
  ['Олдбой', 'Oldeuboi'],
  ['Сумрачный самурай', 'Tasogare Seibei'],
]);

const filmNamesList = Array.from(filmNamesMap.keys());
// const filmAltNamesList = Array.from(filmNamesMap.values());


const generateFilmName = () => {
  const randIdx = getRandomInteger(0, filmNamesList.length - 1);
  const filmName = filmNamesList[randIdx];
  return filmName;
};

export const generateFilm = () => {
  const id = nanoid();
  return {
    id,
    name: generateFilmName(),
  };
};
