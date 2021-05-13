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

render(siteMainEl, new UserStatView(userStat), RenderPosition.BEFOREEND);

const footerStat = siteFooterEl.querySelector('.footer__statistics');

render(footerStat, new SiteStatView(films), RenderPosition.BEFOREEND);
