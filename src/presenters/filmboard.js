import FilmsView from '../view/films.js';
import FilmsListView from '../view/films-list.js';
import FilmCardView from '../view/film-card.js';
import ShowMoreView from '../view/show-more.js';
import FilmDetailsView from '../view/film-details.js';
import SortView from '../view/sort.js';

import {
  sortFilmsByComments,
  sortFilmsByRates,
  sortFilmsByDate,
  getFilmContainer,
  isPopupExist
} from '../utils/film.js';
import {updateItem} from '../utils/common.js';
import {
  render,
  RenderPosition,
  remove,
  replace
} from '../utils/render.js';
import { nanoid } from 'nanoid';
import {SortType} from '../const.js';

const FILMS_COUNT_PER_STEP = 5;
const EXTRA_LIST_COUNT = 2;

export default class Filmboard {
  constructor(container) {
    this._mainEl = container;
    this._filmsComp = new FilmsView();
    this._sortComp = new SortView();
    this._regularFilmsList = new FilmsListView(false, 'list');
    this._regularFilmsListContainer = getFilmContainer(this._regularFilmsList);
    this._showMoreComp = new ShowMoreView();
    this._renderedFilmsCount = FILMS_COUNT_PER_STEP;
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._prevFilmCards = [];
    this._openedPopup = null;
    this._currentSortType = SortType.DEFAULT;
  }

  init(films) {
    this._films = films.slice();
    this._defaultFilms = films.slice();
    this._renderSort();
    this._renderFilmBoard();
  }

  _renderSort() {
    render(this._mainEl, this._sortComp, RenderPosition.BEFOREEND);

    this._sortComp.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderFilmsContainer() {
    render(this._mainEl, this._filmsComp, RenderPosition.BEFOREEND);
  }

  _renderFilm(filmsList, film, prevFilm = null) {
    const container = filmsList;
    const filmComponent = new FilmCardView(film);
    filmComponent.prevId = nanoid();
    filmComponent.setClickFavoriteHandler(() => {
      this._handleFilmChange(
        Object.assign(
          {},
          film,
          {
            favorite: !film.favorite,
          },
        ),
      );
    });
    filmComponent.setClickWatchlistHandler(() => {
      this._handleFilmChange(
        Object.assign(
          {},
          film,
          {
            watchlist: !film.watchlist,
          },
        ),
      );
    });
    filmComponent.setClickWatchedHandler(() => {
      this._handleFilmChange(
        Object.assign(
          {},
          film,
          {
            alreadyWatched: !film.alreadyWatched,
          },
        ),
      );
    });
    filmComponent.setOpenDetailHandler(() => {
      this._renderPopup(film);
    });

    if(prevFilm === null) {
      render(container, filmComponent, RenderPosition.BEFOREEND);

      this._prevFilmCards.push(filmComponent);

      return;

    } else {
      const newPrevFilmIdx = this._prevFilmCards.findIndex((item) => item.prevId === prevFilm.prevId);

      this._prevFilmCards[newPrevFilmIdx] = filmComponent;

      replace(filmComponent, prevFilm);
    }
  }

  _renderPopup(film) {
    const popupComponent = new FilmDetailsView(film);

    const clickOutPopup = (e) => {
      if (!e.target.closest('.film-details')) {
        this._popupOnClose(popupComponent);
        document.removeEventListener('click', clickOutPopup);
      }
    };

    const handleEscKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        e.preventDefault();
        document.removeEventListener('keydown', handleEscKeyDown);
        this._popupOnClose(popupComponent);
      }
    };

    popupComponent.setClickCloseHandler(() => {
      this._popupOnClose(popupComponent);
    });

    popupComponent.setClickFavoriteHandler(() => {
      this._handleFilmChange(
        Object.assign(
          {},
          film,
          {
            favorite: !film.favorite,
            scrollPos: popupComponent.getElement().scrollTop,
          },
        ),
      );
    });

    popupComponent.setClickWatchlistHandler(() => {
      this._handleFilmChange(
        Object.assign(
          {},
          film,
          {
            watchlist: !film.watchlist,
            scrollPos: popupComponent.getElement().scrollTop,
          },
        ),
      );
    });

    popupComponent.setClickWatchedHandler(() => {
      this._handleFilmChange(
        Object.assign(
          {},
          film,
          {
            alreadyWatched: !film.alreadyWatched,
            scrollPos: popupComponent.getElement().scrollTop,
          },
        ),
      );
    });

    document.body.classList.add('hide-overflow');
    document.addEventListener('click', clickOutPopup);
    document.addEventListener('keydown', handleEscKeyDown);

    if(this._openedPopup === null) {
      render(this._mainEl, popupComponent, RenderPosition.AFTEREND);
      this._openedPopup = popupComponent;
    } else {
      replace(popupComponent, this._openedPopup);
      this._openedPopup = popupComponent;
      popupComponent.setScrollPos();
    }
  }

  _popupOnClose(popup) {
    remove(popup);
    document.removeEventListener('click', this._popupOnClose);
    document.body.classList.remove('hide-overflow');
    this._openedPopup = null;
  }
  // рендер главного списка фильмов
  _renderRegular() {
    render(this._filmsComp, this._regularFilmsList, RenderPosition.BEFOREEND);
  }

  _renderRegularCards() {
    this._renderFilmsSlice(this._films, this._regularFilmsListContainer, 0, Math.min(this._films.length, this._renderedFilmsCount));

    if(this._films.length > FILMS_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }
  // рендер экстра-списка - рейтинговые
  _renderTopRated(films) {
    const topRatedFilmsList = new FilmsListView(true, 'top-rated');
    const topRatedFilmsListContainer = getFilmContainer(topRatedFilmsList);

    render(this._filmsComp, topRatedFilmsList, RenderPosition.BEFOREEND);

    this._renderFilmsSlice(films, topRatedFilmsListContainer, 0, Math.min(films.length, EXTRA_LIST_COUNT));
  }
  // рендер экстра-списка - комментируемые
  _renderMostComment(films) {
    const mostCommentFilmsList = new FilmsListView(true, 'most-commented');
    const mostCommentFilmsListContainer = getFilmContainer(mostCommentFilmsList);
    render(this._filmsComp, mostCommentFilmsList, RenderPosition.BEFOREEND);

    this._renderFilmsSlice(films, mostCommentFilmsListContainer, 0, Math.min(films.length, EXTRA_LIST_COUNT));
  }
  // рендерит основной контейнер и списки фильмов
  _renderFilmBoard() {
    this._renderFilmsContainer();
    this._renderRegular();
    this._renderRegularCards();
    this._renderTopRated(this._films.sort(sortFilmsByRates));
    this._renderMostComment(this._films.sort(sortFilmsByComments));
  }
  // универсальный метод рендеринга пачки фильмов
  _renderFilmsSlice(list, container, from, to) {
    list
      .slice(from, to)
      .forEach((film) => this._renderFilm(container, film));
  }

  _renderShowMoreButton() {
    render(this._regularFilmsList, this._showMoreComp, RenderPosition.BEFOREEND);
    this._showMoreComp.setClickHandler(this._handleShowMoreButtonClick);
  }

  _handleShowMoreButtonClick() {
    this._renderFilmsSlice(this._films, this._regularFilmsListContainer, this._renderedFilmsCount, this._renderedFilmsCount + FILMS_COUNT_PER_STEP);
    this._renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if(this._renderedFilmsCount >= this._films.length) {
      remove(this._showMoreComp);
    }
  }


  _handleFilmChange(updatedFilm) {

    this._films = updateItem(this._films, updatedFilm);
    this._defaultFilms = updateItem(this._defaultFilms, updatedFilm);

    const filmsToUpdate = this._prevFilmCards.filter((prev) => prev.getFilmId() === updatedFilm.id);

    filmsToUpdate.forEach((upd) => {
      const updParent = upd.getElement().parentElement;
      this._renderFilm(updParent, updatedFilm, upd);
    });

    if(isPopupExist()) {
      this._renderPopup(updatedFilm);
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    // - Сортируем задачи
    this._sortRegularList(sortType);
    // - Очищаем список
    this._clearRegularList();
    // - Рендерим список заново
    this._renderRegularCards();
  }

  _sortRegularList(sortType) {
    switch (sortType) {
      case SortType.RATE:
        this._films.sort(sortFilmsByRates);
        break;
      case SortType.DATE:
        this._films.sort(sortFilmsByDate);
        break;
      case SortType.COMMENTS:
        this._films.sort(sortFilmsByComments);
        break;
      default:
        this._films = this._defaultFilms.slice();
    }

    this._currentSortType = sortType;
  }

  _clearRegularList() {
    const regularListCards = this._prevFilmCards.filter((card) => {
      return card.getElement().closest('[data-list-id]').dataset.listId === 'list';
    });
    regularListCards.forEach((card) => {
      remove(card);
      const prevIdx = this._prevFilmCards.indexOf(card);
      this._prevFilmCards.splice(prevIdx, 1);
    });
    remove(this._showMoreComp);
  }
}
