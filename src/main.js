import ProfileView from './view/profile.js';
import SiteStatView from './view/statistics.js';
import UserStatView from './view/user-statistics.js';
import FilmBoard from './presenters/filmboard.js';
import Filter from './presenters/filter.js';
import {generateFilm} from './mock/film.js';
import {generateUserstat} from './utils/statistic.js';
import {render, RenderPosition, remove} from './utils/render.js';
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

const footerStat = siteFooterEl.querySelector('.footer__statistics');

render(footerStat, new SiteStatView(films), RenderPosition.BEFOREEND);


let userStatComp = null;
let isStatOpen = false;

const screenSwitch = (target) => {
  if(target.classList.contains('main-navigation__additional')) {
    // клик по кнопке статы
    if(!isStatOpen) {
      // скрыть доску, показать стату
      boardPresenter.hideFilmBoard();
      userStatComp = new UserStatView(userFilms(modelFilms.getFilms()));
      render(siteMainEl, userStatComp, RenderPosition.BEFOREEND);
      filterPresenter.setStatMenuActive();
      isStatOpen = true;
    } else {
      // убрать стату, показать доску
      remove(userStatComp);
      boardPresenter.showFilmBoard();
      filterPresenter.setStatMenuUnactive();
      isStatOpen = false;
    }
  } else if(target.classList.contains('main-navigation__item') && isStatOpen){
    // клик по фильтрам при включенной стате
    isStatOpen = false;
    remove(userStatComp);
    filterPresenter.setStatMenuUnactive();
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
