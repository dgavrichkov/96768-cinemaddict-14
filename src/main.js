import { getProfileTemplate } from './view/profile.js';
import { getMenuTemplate } from './view/menu.js';
import { getSortTemplate } from './view/sort.js';
import { getFilmsTemplate } from './view/films.js';
import { getFilmsListTemplate } from './view/films-list.js';
import { getFilmCardTemplate } from './view/film-card.js';
import { getShowMoreTemplate } from './view/show-more';
import { getStatisticsTemplate } from './view/statistics';
import { getFilmDetailsTemplate } from './view/film-details';
import { getUserStatisticsTemplate } from './view/user-statistics';
import { generateFilm } from './mock/film';


const EXTRA_LIST_COUNT = 2;
const FILMS_COUNT = 22;
const FILMS_COUNT_PER_STEP = 5;

const films = new Array(FILMS_COUNT).fill().map(generateFilm);
const topRatedfilms = new Array(EXTRA_LIST_COUNT).fill().map(generateFilm);
const mostCommentedFilms = new Array(EXTRA_LIST_COUNT).fill().map(generateFilm);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderEl = document.querySelector('.header');
const siteMainEl = document.querySelector('.main');
const siteFooterEl = document.querySelector('.footer');

render(siteHeaderEl, getProfileTemplate(), 'beforeend');
render(siteMainEl, getMenuTemplate(), 'beforeend');
render(siteMainEl, getSortTemplate(), 'beforeend');
render(siteMainEl, getFilmsTemplate(), 'beforeend');

const filmsContainer = siteMainEl.querySelector('.films');

render(filmsContainer, getFilmsListTemplate(false, 'list'), 'beforeend');
render(filmsContainer, getFilmsListTemplate(true, 'top-rated'), 'beforeend');
render(filmsContainer, getFilmsListTemplate(true, 'most-commented'), 'beforeend');

const filmsMainList = filmsContainer.querySelector('[data-id=list]');
const filmsMainListContainer = filmsMainList.querySelector('.films-list__container');

// список фильмов
for(let i = 0; i < Math.min(films.length, FILMS_COUNT_PER_STEP); i++) {
  render(filmsMainListContainer, getFilmCardTemplate(films[i]), 'beforeend');
}

const filmsTopRatedContainer = filmsContainer.querySelector('[data-id=top-rated] .films-list__container');
const filmsMostCommentContainer = filmsContainer.querySelector('[data-id=most-commented] .films-list__container');

// временное наполнение экстра-списков
// TODO - отфильтровать соответствующие фильмы

// список самых рейтинговых
for(let i = 0; i < EXTRA_LIST_COUNT; i++) {
  render(filmsTopRatedContainer, getFilmCardTemplate(topRatedfilms[i]), 'beforeend');
}

// список самых комментируемых
for(let i = 0; i < EXTRA_LIST_COUNT; i++) {
  render(filmsMostCommentContainer, getFilmCardTemplate(mostCommentedFilms[i]), 'beforeend');
}


render(filmsMainList, getShowMoreTemplate(), 'beforeend');

render(siteMainEl, getUserStatisticsTemplate(), 'beforeend');

const footerStat = siteFooterEl.querySelector('.footer__statistics');
render(footerStat, getStatisticsTemplate(), 'beforeend');

// render(siteFooterEl, getFilmDetailsTemplate(), 'afterend');


// console.log(films);
