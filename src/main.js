import { profile } from './view/profile.js';
import { menu } from './view/menu.js';
import { sort } from './view/sort.js';
import { films } from './view/films.js';
import { filmsList } from './view/films-list.js';
import { filmCard } from './view/film-card.js';
import { showMore } from './view/show-more';
import { statistics } from './view/statistics';
import { filmDetails } from './view/film-details';

const MAIN_LIST_COUNT = 5;
const EXTRA_LIST_COUNT = 2;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderEl = document.querySelector('.header');
const siteMainEl = document.querySelector('.main');
const siteFooterEl = document.querySelector('.footer');

render(siteHeaderEl, profile(), 'beforeend');
render(siteMainEl, menu(), 'beforeend');
render(siteMainEl, sort(), 'beforeend');
render(siteMainEl, films(), 'beforeend');

const filmsContainer = siteMainEl.querySelector('.films');

render(filmsContainer, filmsList(false, 'list'), 'beforeend');
render(filmsContainer, filmsList(true, 'top-rated'), 'beforeend');
render(filmsContainer, filmsList(true, 'most-commented'), 'beforeend');

const filmsMainList = filmsContainer.querySelector('[data-id=list]');
const filmsMainListContainer = filmsMainList.querySelector('.films-list__container');

for(let i = 0; i < MAIN_LIST_COUNT; i++) {
  render(filmsMainListContainer, filmCard(), 'beforeend');
}

const filmsTopRatedContainer = filmsContainer.querySelector('[data-id=top-rated] .films-list__container');
const filmsMostCommentContainer = filmsContainer.querySelector('[data-id=most-commented] .films-list__container');

for(let i = 0; i < EXTRA_LIST_COUNT; i++) {
  render(filmsTopRatedContainer, filmCard(), 'beforeend');
}

for(let i = 0; i < EXTRA_LIST_COUNT; i++) {
  render(filmsMostCommentContainer, filmCard(), 'beforeend');
}

render(filmsMainList, showMore(), 'beforeend');

const footerStat = siteFooterEl.querySelector('.footer__statistics');

render(footerStat, statistics(), 'beforeend');

render(siteFooterEl, filmDetails(), 'afterend');
