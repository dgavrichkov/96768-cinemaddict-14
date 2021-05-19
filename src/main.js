import ProfileView from './view/profile.js';
import SiteStatView from './view/statistics.js';
import UserStatView from './view/user-statistics.js';
import FilmBoard from './presenters/filmboard.js';
import Filter from './presenters/filter.js';
import {generateFilm} from './mock/film.js';
import {render, RenderPosition, remove} from './utils/render.js';
import {getUserFilms} from './utils/film.js';
import FilmsModel from './model/movies.js';
import FilterModel from './model/filter.js';
import { filter } from './utils/filter.js';

const FILMS_COUNT = 22;

const films = new Array(FILMS_COUNT).fill().map(generateFilm);

const siteHeaderEl = document.querySelector('.header');
const siteMainEl = document.querySelector('.main');
const siteFooterEl = document.querySelector('.footer');

const modelFilter = new FilterModel();
const modelFilms = new FilmsModel();
modelFilms.setFilms(films);

const filterPresenter = new Filter(siteMainEl, modelFilter, modelFilms);
const boardPresenter = new FilmBoard(siteMainEl, modelFilms, modelFilter);

let profileComp = null;

const renderProfile = (films) => {
  if(profileComp !== null) {
    remove(profileComp);
    profileComp = null;
  }
  profileComp = new ProfileView(films);
  render(siteHeaderEl, profileComp, RenderPosition.BEFOREEND);
};

renderProfile(getUserFilms(modelFilms.getFilms()));

filterPresenter.init();
boardPresenter.init();

const footerStat = siteFooterEl.querySelector('.footer__statistics');

render(footerStat, new SiteStatView(films), RenderPosition.BEFOREEND);


let userStatComp = null;
let isStatOpen = false;

const setScreenSwitchHandler = () => {
  const menuElement = filterPresenter.getFilterElement();
  const statBtn = menuElement.querySelector('.main-navigation__additional');
  const filterBtns = menuElement.querySelectorAll('.main-navigation__item');
  statBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if(!isStatOpen) {
      // скрыть доску, показать стату
      boardPresenter.hideFilmBoard();
      userStatComp = new UserStatView(getUserFilms(modelFilms.getFilms()));
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
  });
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // клик по фильтрам при включенной стате
      isStatOpen = false;
      remove(userStatComp);
      filterPresenter.setStatMenuUnactive();
      boardPresenter.showFilmBoard();
    });
  });
};

setScreenSwitchHandler();

const handleModelEvent = () => {
  renderProfile(getUserFilms(modelFilms.getFilms()));
};

modelFilms.addObserver(handleModelEvent);
modelFilter.addObserver(setScreenSwitchHandler);
