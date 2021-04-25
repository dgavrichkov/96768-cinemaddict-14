import FilmsView from '../view/films.js';
import FilmsListView from '../view/films-list.js';
import FilmCardView from '../view/film-card.js';
import ShowMoreView from '../view/show-more.js';
import FilmDetailsView from '../view/film-details.js';
import SortView from '../view/sort.js';

import {sortFilmsByComments, sortFilmsByRates} from '../utils/film.js';
import {
  render,
  RenderPosition,
  remove
} from '../utils/render.js';

const FILMS_COUNT_PER_STEP = 5;

export default class Filmboard {
  constructor(container) {
    this._mainEl = container;
    this._filmsComp = new FilmsView();
    this._sortComp = new SortView();
    this._regularFilmsList = new FilmsListView(false, 'list');
    this._regularFilmsListContainer = this._regularFilmsList.getElement().querySelector('.films-list__container');
    this._showMoreComp = new ShowMoreView();
    this._renderedFilmsCount = FILMS_COUNT_PER_STEP;
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
  }

  init(films) {
    this._films = films.slice();

    this._renderSort();
    this._renderFilmBoard();
  }

  _renderSort() {
    render(this._mainEl, this._sortComp, RenderPosition.BEFOREEND);
  }

  _renderFilmsContainer() {
    render(this._mainEl, this._filmsComp, RenderPosition.BEFOREEND);
  }

  _renderFilm(filmsListEl, film) {
    const filmComponent = new FilmCardView(film);

    filmComponent.setOpenDetailHandler(() => {
      this._renderPopup(film);
    });

    render(filmsListEl, filmComponent, RenderPosition.BEFOREEND);
  }

  _renderPopup(film) {
    const popupComponent = new FilmDetailsView(film);

    const clickOutPopup = (e) => {
      if (!e.target.closest('.film-details')) {
        this._popupOnClose(popupComponent);
        document.removeEventListener('click', clickOutPopup);
      }
    };

    popupComponent.setClickCloseHandler(() => {
      this._popupOnClose(popupComponent);
    });

    document.body.classList.add('hide-overflow');
    document.addEventListener('click', clickOutPopup);

    render(this._mainEl, popupComponent, RenderPosition.AFTEREND);
  }

  _popupOnClose(popup) {
    remove(popup);
    document.removeEventListener('click', this._popupOnClose);
    document.body.classList.remove('hide-overflow');
  }

  _sortFilmsByComments(films) {
    return sortFilmsByComments(films);
  }

  _sortFilmsByRates(films) {
    return sortFilmsByRates(films);
  }

  _renderRegular(films) {
    render(this._filmsComp, this._regularFilmsList, RenderPosition.BEFOREEND);

    for(let i = 0; i < Math.min(films.length, this._renderedFilmsCount); i++) {
      this._renderFilm(this._regularFilmsListContainer, films[i]);
    }

    if(films.length > FILMS_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderTopRated(films) {
    const EXTRA_LIST_COUNT = 2;
    const topRatedFilmsList = new FilmsListView(true, 'top-rated');

    render(this._filmsComp, topRatedFilmsList, RenderPosition.BEFOREEND);

    const topRatedFilmsListContainer = topRatedFilmsList.getElement().querySelector('.films-list__container');

    for(let i = 0; i < Math.min(films.length, EXTRA_LIST_COUNT); i++) {
      this._renderFilm(topRatedFilmsListContainer, films[i]);
    }
  }

  _renderMostComment(films) {
    const EXTRA_LIST_COUNT = 2;
    const mostCommentFilmsList = new FilmsListView(true, 'most-commented');

    render(this._filmsComp, mostCommentFilmsList, RenderPosition.BEFOREEND);

    const mostCommentFilmsListContainer = mostCommentFilmsList.getElement().querySelector('.films-list__container');

    for(let i = 0; i <  Math.min(films.length, EXTRA_LIST_COUNT); i++) {
      this._renderFilm(mostCommentFilmsListContainer, films[i]);
    }
  }

  _renderFilmBoard() {
    this._renderFilmsContainer();
    this._renderRegular(this._films);
    this._renderTopRated(this._sortFilmsByRates(this._films));
    this._renderMostComment(this._sortFilmsByComments(this._films));
  }

  _renderFilmsSlice(from, to) {
    this._films
      .slice(from, to)
      .forEach((film) => this._renderFilm(this._regularFilmsListContainer, film));
  }

  _renderShowMoreButton() {
    render(this._regularFilmsList, this._showMoreComp, RenderPosition.BEFOREEND);
    this._showMoreComp.setClickHandler(this._handleShowMoreButtonClick);
  }

  _handleShowMoreButtonClick() {
    this._renderFilmsSlice(this._renderedFilmsCount, this._renderedFilmsCount + FILMS_COUNT_PER_STEP);
    this._renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if(this._renderedFilmsCount >= this._films.length) {
      remove(this._showMoreComp);
    }
  }

}
