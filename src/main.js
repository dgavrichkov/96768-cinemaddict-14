import Profile from './view/profile.js';
import Menu from './view/menu.js';
import Sort from './view/sort.js';
import Films from './view/films.js';
import FilmsList from './view/films-list.js';
import FilmCard from './view/film-card.js';
import ShowMore from './view/show-more.js';
import SiteStat from './view/statistics.js';
import FilmDetails from './view/film-details.js';
import UserStat from './view/user-statistics.js';
import {generateFilm} from './mock/film.js';
import {generateFilter} from './mock/filter.js';
import {generateUserstat} from './mock/userStat.js';
import {userFilms, sortFilmsByComments, sortFilmsByRates} from './utils.js';

const EXTRA_LIST_COUNT = 2;
const FILMS_COUNT = 22;
const FILMS_COUNT_PER_STEP = 5;

const films = new Array(FILMS_COUNT).fill().map(generateFilm);
const filters = generateFilter(films);
const userStat = generateUserstat(userFilms(films));

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderEl = document.querySelector('.header');
const siteMainEl = document.querySelector('.main');
const siteFooterEl = document.querySelector('.footer');

render(siteHeaderEl, getProfileTemplate(userStat), 'beforeend');
render(siteMainEl, getMenuTemplate(filters), 'beforeend');
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
const topRatedFilms = sortFilmsByRates(films);
const mostCommentedFilms = sortFilmsByComments(films);

// список самых рейтинговых
for(let i = 0; i < EXTRA_LIST_COUNT; i++) {
  render(filmsTopRatedContainer, getFilmCardTemplate(topRatedFilms[i]), 'beforeend');
}
// список самых комментируемых
for(let i = 0; i < EXTRA_LIST_COUNT; i++) {
  render(filmsMostCommentContainer, getFilmCardTemplate(mostCommentedFilms[i]), 'beforeend');
}

if(films.length > FILMS_COUNT_PER_STEP) {
  let renderedFilmsCount = FILMS_COUNT_PER_STEP;
  render(filmsMainList, getShowMoreTemplate(), 'beforeend');
  const showMoreBtn = document.querySelector('.films-list__show-more');
  showMoreBtn.addEventListener('click', (e) => {
    e.preventDefault();
    films
      .slice(renderedFilmsCount, renderedFilmsCount + FILMS_COUNT_PER_STEP)
      .forEach((film) => render(filmsMainListContainer, getFilmCardTemplate(film), 'beforeend'));
    renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if(renderedFilmsCount >= films.length) {
      showMoreBtn.remove();
    }
  });
}

render(siteMainEl, getUserStatisticsTemplate(userStat), 'beforeend');

const footerStat = siteFooterEl.querySelector('.footer__statistics');
render(footerStat, getStatisticsTemplate(films), 'beforeend');

const posters = document.querySelectorAll('.film-card__poster');

posters.forEach((poster) => {
  poster.addEventListener('click', (e) => {
    const id = e.target.closest('.film-card').dataset.id;
    const chosenFilm = films.find((item) => item.id === id);
    render(siteFooterEl, getFilmDetailsTemplate(chosenFilm), 'afterend');
  });
});

document.addEventListener('click', (e) => {
  if(e.target.closest('.film-details__close')) {
    e.target.closest('.film-details').remove();
  }
});
