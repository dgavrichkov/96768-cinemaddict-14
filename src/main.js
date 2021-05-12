import ProfileView from './view/profile.js';
import SiteStatView from './view/statistics.js';
import UserStatView from './view/user-statistics.js';
import FilmBoard from './presenters/filmboard.js';
import Filter from './presenters/filter.js';
import {generateFilm} from './mock/film.js';
import {generateUserstat} from './mock/userStat.js';
import {render, RenderPosition} from './utils/render.js';
import {userFilms} from './utils/film.js';
import FilmsModel from './model/movies.js';
import FilterModel from './model/filter.js';

const FILMS_COUNT = 22;

const films = new Array(FILMS_COUNT).fill().map(generateFilm);
const userStat = generateUserstat(userFilms(films));

const siteHeaderEl = document.querySelector('.header');
const siteMainEl = document.querySelector('.main');
const siteFooterEl = document.querySelector('.footer');

const modelFilter = new FilterModel();
const modelFilms = new FilmsModel();
modelFilms.setFilms(films);

const filterPresenter = new Filter(siteMainEl, modelFilter, modelFilms);
const boardPresenter = new FilmBoard(siteMainEl, modelFilms, modelFilter);

render(siteHeaderEl, new ProfileView(userStat), RenderPosition.BEFOREEND);

filterPresenter.init();
boardPresenter.init();

const userStatComp = new UserStatView(userStat);
render(siteMainEl, userStatComp, RenderPosition.BEFOREEND);
userStatComp.hide();

const footerStat = siteFooterEl.querySelector('.footer__statistics');

render(footerStat, new SiteStatView(films), RenderPosition.BEFOREEND);

const screenSwitch = (target) => {

  if(target.classList.contains('main-navigation__additional')) {
    if(userStatComp.getElement().classList.contains('visually-hidden')) {
      boardPresenter.hideFilmBoard();
      userStatComp.show();
      filterPresenter.setStatMenuActive();
    } else {
      userStatComp.hide();
      boardPresenter.showFilmBoard();
      filterPresenter.setStatMenuUnactive();
    }
  } else if(target.classList.contains('main-navigation__item')){
    userStatComp.hide();
    target.classList.remove('main-navigation__additional--active');
    target.classList.add('main-navigation__item--active');
    boardPresenter.showFilmBoard();
  }
};

const handleScreenSwitchClick = (e) => {
  e.preventDefault();
  const target = e.target;
  screenSwitch(target);
};

document.addEventListener('click', handleScreenSwitchClick);
