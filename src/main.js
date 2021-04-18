import ProfileView from './view/profile.js';
import MenuView from './view/menu.js';
import SortView from './view/sort.js';
import FilmsView from './view/films.js';
import FilmsListView from './view/films-list.js';
import FilmCardView from './view/film-card.js';
import ShowMoreView from './view/show-more.js';
import SiteStatView from './view/statistics.js';
import FilmDetailsView from './view/film-details.js';
import UserStatView from './view/user-statistics.js';
import {generateFilm} from './mock/film.js';
import {generateFilter} from './mock/filter.js';
import {generateUserstat} from './mock/userStat.js';
import {render, RenderPosition, userFilms, sortFilmsByComments, sortFilmsByRates} from './utils.js';

const EXTRA_LIST_COUNT = 2;
const FILMS_COUNT = 22;
const FILMS_COUNT_PER_STEP = 5;

const films = new Array(FILMS_COUNT).fill().map(generateFilm);
const filters = generateFilter(films);
const userStat = generateUserstat(userFilms(films));

const topRatedFilms = sortFilmsByRates(films);
const mostCommentedFilms = sortFilmsByComments(films);

const siteHeaderEl = document.querySelector('.header');
const siteMainEl = document.querySelector('.main');
const siteFooterEl = document.querySelector('.footer');

render(siteHeaderEl, new ProfileView(userStat).getElement(), RenderPosition.BEFOREEND);
render(siteMainEl, new MenuView(filters).getElement(), RenderPosition.BEFOREEND);
render(siteMainEl, new SortView().getElement(), RenderPosition.BEFOREEND);

const filmsContainer = new FilmsView();
render(siteMainEl, filmsContainer.getElement(), RenderPosition.BEFOREEND);

const regularFilmsList = new FilmsListView(false, 'list');
const topRatedFilmsList = new FilmsListView(true, 'top-rated');
const mostCommentFilmsList = new FilmsListView(true, 'most-commented');
render(filmsContainer.getElement(), regularFilmsList.getElement(), RenderPosition.BEFOREEND);
render(filmsContainer.getElement(), topRatedFilmsList.getElement(), RenderPosition.BEFOREEND);
render(filmsContainer.getElement(), mostCommentFilmsList.getElement(), RenderPosition.BEFOREEND);

const regularFilmsListContainer = regularFilmsList.getElement().querySelector('.films-list__container');
const topRatedFilmsListContainer = topRatedFilmsList.getElement().querySelector('.films-list__container');
const mostCommentFilmsListContainer = mostCommentFilmsList.getElement().querySelector('.films-list__container');

const renderFilm = (filmsListEl, film) => {
  const filmComponent = new FilmCardView(film);

  const openTriggers = [
    filmComponent.getElement().querySelector('.film-card__poster'),
    filmComponent.getElement().querySelector('.film-card__title'),
    filmComponent.getElement().querySelector('.film-card__comments'),
  ];

  openTriggers.forEach((trg) => {
    trg.addEventListener('click', () => {
      renderPopup(film);
    });
  });

  render(filmsListEl, filmComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderPopup = (film) => {
  const popupComponent = new FilmDetailsView(film);
  const closeTrigger = popupComponent.getElement().querySelector('.film-details__close');
  const onClose = () => {
    closeTrigger.removeEventListener('click', onClose);
    document.body.classList.remove('hide-overflow');
    popupComponent.getElement().remove();
    popupComponent.removeElement();
  };

  document.body.classList.add('hide-overflow');

  closeTrigger.addEventListener('click', onClose);

  render(siteFooterEl, popupComponent.getElement(), RenderPosition.AFTEREND);
};

for(let i = 0; i < Math.min(films.length, FILMS_COUNT_PER_STEP); i++) {
  renderFilm(regularFilmsListContainer, films[i]);
}

for(let i = 0; i < EXTRA_LIST_COUNT; i++) {
  renderFilm(topRatedFilmsListContainer, topRatedFilms[i]);
}

for(let i = 0; i < EXTRA_LIST_COUNT; i++) {
  renderFilm(mostCommentFilmsListContainer, mostCommentedFilms[i]);
}

if(films.length > FILMS_COUNT_PER_STEP) {
  let renderedFilmsCount = FILMS_COUNT_PER_STEP;

  render(regularFilmsList.getElement(), new ShowMoreView().getElement(), RenderPosition.BEFOREEND);

  const showMoreBtn = document.querySelector('.films-list__show-more');

  showMoreBtn.addEventListener('click', (e) => {
    e.preventDefault();
    films
      .slice(renderedFilmsCount, renderedFilmsCount + FILMS_COUNT_PER_STEP)
      .forEach((film) => renderFilm(regularFilmsListContainer, film));

    renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if(renderedFilmsCount >= films.length) {
      showMoreBtn.remove();
    }
  });
}

render(siteMainEl, new UserStatView(userStat).getElement(), RenderPosition.BEFOREEND);

const footerStat = siteFooterEl.querySelector('.footer__statistics');

render(footerStat, new SiteStatView(films).getElement(), RenderPosition.BEFOREEND);
