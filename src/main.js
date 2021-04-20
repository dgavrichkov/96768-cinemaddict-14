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

const renderFilm = (filmsListEl, film) => {
  const filmComponent = new FilmCardView(film);

  filmComponent.setOpenDetailHandler(() => {
    renderPopup(film);
  });

  const renderPopup = (film) => {
    const popupComponent = new FilmDetailsView(film);

    const onPopupClose = () => {
      popupComponent.closePopup();
      document.removeEventListener('click', onPopupClose);
      document.body.classList.remove('hide-overflow');
    };

    const clickOutPopup = (e) => {
      if(!e.target.closest('.film-details')) {
        onPopupClose();
      }
      document.removeEventListener('click', clickOutPopup);
    };

    document.body.classList.add('hide-overflow');

    popupComponent.setClickCloseHandler(() => {
      onPopupClose();
    });

    document.addEventListener('click', clickOutPopup);


    render(siteFooterEl, popupComponent.getElement(), RenderPosition.AFTEREND);
  };
  render(filmsListEl, filmComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderRegular = (films) => {
  const regularFilmsList = new FilmsListView(false, 'list');

  render(filmsContainer.getElement(), regularFilmsList.getElement(), RenderPosition.BEFOREEND);

  const regularFilmsListContainer = regularFilmsList.getElement().querySelector('.films-list__container');

  for(let i = 0; i < Math.min(films.length, FILMS_COUNT_PER_STEP); i++) {
    renderFilm(regularFilmsListContainer, films[i]);
  }

  if(films.length > FILMS_COUNT_PER_STEP) {
    let renderedFilmsCount = FILMS_COUNT_PER_STEP;
    const showMore = new ShowMoreView();
    render(regularFilmsList.getElement(), showMore.getElement(), RenderPosition.BEFOREEND);

    showMore.setClickHandler(() => {
      films
        .slice(renderedFilmsCount, renderedFilmsCount + FILMS_COUNT_PER_STEP)
        .forEach((film) => renderFilm(regularFilmsListContainer, film));

      renderedFilmsCount += FILMS_COUNT_PER_STEP;

      if(renderedFilmsCount >= films.length) {
        showMore.deleteButton();
      }
    });
  }
};

const renderTopRated = (films) => {
  const EXTRA_LIST_COUNT = 2;
  const topRatedFilmsList = new FilmsListView(true, 'top-rated');

  render(filmsContainer.getElement(), topRatedFilmsList.getElement(), RenderPosition.BEFOREEND);

  const topRatedFilmsListContainer = topRatedFilmsList.getElement().querySelector('.films-list__container');

  for(let i = 0; i < Math.min(films.length, EXTRA_LIST_COUNT); i++) {
    renderFilm(topRatedFilmsListContainer, films[i]);
  }
};

const renderMostComment = (films) => {
  const EXTRA_LIST_COUNT = 2;
  const mostCommentFilmsList = new FilmsListView(true, 'most-commented');

  render(filmsContainer.getElement(), mostCommentFilmsList.getElement(), RenderPosition.BEFOREEND);

  const mostCommentFilmsListContainer = mostCommentFilmsList.getElement().querySelector('.films-list__container');

  for(let i = 0; i <  Math.min(films.length, EXTRA_LIST_COUNT); i++) {
    renderFilm(mostCommentFilmsListContainer, films[i]);
  }
};

renderRegular(films);
renderTopRated(topRatedFilms);
renderMostComment(mostCommentedFilms);

render(siteMainEl, new UserStatView(userStat).getElement(), RenderPosition.BEFOREEND);

const footerStat = siteFooterEl.querySelector('.footer__statistics');

render(footerStat, new SiteStatView(films).getElement(), RenderPosition.BEFOREEND);
