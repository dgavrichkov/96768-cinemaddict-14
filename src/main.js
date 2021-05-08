import ProfileView from './view/profile.js';
import MenuView from './view/menu.js';
import SiteStatView from './view/statistics.js';
import UserStatView from './view/user-statistics.js';
import FilmBoard from './presenters/filmboard.js';
import {generateFilm} from './mock/film.js';
import {generateFilter} from './mock/filter.js';
import {generateUserstat} from './mock/userStat.js';
import {render, RenderPosition} from './utils/render.js';
import {userFilms} from './utils/film.js';
import FilmsModel from './model/movies.js';

const FILMS_COUNT = 22;

const films = new Array(FILMS_COUNT).fill().map(generateFilm);
const filters = generateFilter(films);
const userStat = generateUserstat(userFilms(films));

const siteHeaderEl = document.querySelector('.header');
const siteMainEl = document.querySelector('.main');
const siteFooterEl = document.querySelector('.footer');

const modelFilms = new FilmsModel();
modelFilms.setFilms(films);

const boardPresenter = new FilmBoard(siteMainEl, modelFilms);

render(siteHeaderEl, new ProfileView(userStat), RenderPosition.BEFOREEND);
render(siteMainEl, new MenuView(filters), RenderPosition.BEFOREEND);

boardPresenter.init();

render(siteMainEl, new UserStatView(userStat), RenderPosition.BEFOREEND);

const footerStat = siteFooterEl.querySelector('.footer__statistics');

render(footerStat, new SiteStatView(films), RenderPosition.BEFOREEND);
