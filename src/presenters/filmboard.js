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
import {
  render,
  RenderPosition,
  remove,
  replace
} from '../utils/render.js';
import { nanoid } from 'nanoid';
import {SortType, UserAction, UpdateType} from '../const.js';

const FILMS_COUNT_PER_STEP = 5;
const EXTRA_LIST_COUNT = 2;

export default class Filmboard {
  constructor(container, filmsModel, filterModel) {
    this._mainEl = container;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._filmsComp = new FilmsView();

    this._sortComp = null;
    this._showMoreComp = null;

    this._regularFilmsList = new FilmsListView(false, 'list');
    this._regularFilmsListContainer = getFilmContainer(this._regularFilmsList);

    this._renderedFilmsCount = FILMS_COUNT_PER_STEP;

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._prevFilmCards = [];
    this._openedPopup = null;
    this._currentSortType = SortType.DEFAULT;
  }

  init() {
    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderFilmBoard();
  }

  _getFilms() {
    switch (this._currentSortType) {
      case SortType.RATE:
        return this._filmsModel.getFilms().slice().sort(sortFilmsByRates);
      case SortType.DATE:
        return this._filmsModel.getFilms().slice().sort(sortFilmsByDate);
    }

    return this._filmsModel.getFilms().slice();
  }

  _renderSort() {
    if(this._sortComp !== null) {
      this._sortComp = null;
    }

    this._sortComp = new SortView(this._currentSortType);
    this._sortComp.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._filmsComp, this._sortComp, RenderPosition.AFTERBEGIN);

  }

  _renderFilmsContainer() {
    render(this._mainEl, this._filmsComp, RenderPosition.BEFOREEND);
  }

  _renderFilm(filmsList, film, prevFilm = null) {
    const container = filmsList;
    const filmComponent = new FilmCardView(film);
    filmComponent.prevId = nanoid();
    filmComponent.setClickFavoriteHandler(() => {
      this._handleViewAction(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
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
      this._handleViewAction(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
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
      this._handleViewAction(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
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
      this._handleViewAction(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
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
      this._handleViewAction(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
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
      this._handleViewAction(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
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
  // рендер карточек обычного списка и кнопки допоказа
  _renderRegularCards() {
    const films = this._getFilms();
    const filmsCount = films.length;

    const filmsGroup = films.slice(0, Math.min(filmsCount, this._renderedFilmsCount));
    this._renderFilms(filmsGroup);

    if(filmsCount > this._renderedFilmsCount) {
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
    const films = this._getFilms();
    this._renderSort();
    this._renderFilmsContainer();
    this._renderRegular();
    this._renderRegularCards();
    this._renderTopRated(films.sort(sortFilmsByRates));
    this._renderMostComment(films.sort(sortFilmsByComments));
  }
  // универсальный метод рендеринга пачки фильмов. Он останется для использования в экстра-списках.
  _renderFilmsSlice(list, container, from, to) {
    list
      .slice(from, to)
      .forEach((film) => this._renderFilm(container, film));
  }
  // рендер обычного списка. Массив фильмов для отрисовки мы получаем прямо из модели
  _renderFilms(films) {
    films.forEach((film) => this._renderFilm(this._regularFilmsListContainer, film));
  }

  _renderShowMoreButton() {

    if (this._showMoreComp !== null) {
      this._showMoreComp = null;
    }

    this._showMoreComp = new ShowMoreView();
    this._showMoreComp.setClickHandler(this._handleShowMoreButtonClick);

    render(this._regularFilmsList, this._showMoreComp, RenderPosition.BEFOREEND);
  }

  _handleShowMoreButtonClick() {

    const filmCount = this._getFilms().length;
    const newRenderedFilmCount = Math.min(filmCount, this._renderedFilmsCount + FILMS_COUNT_PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmsCount, newRenderedFilmCount);

    this._renderFilms(films);
    this._renderedFilmsCount = newRenderedFilmCount;


    if(this._renderedFilmsCount >= filmCount) {
      remove(this._showMoreComp);
    }
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._filmsModel.updateFilm(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._onFilmChange(data);
        break;
      case UpdateType.MINOR:
        this._clearRegularList({resetRenderedFilmCount: true});
        this._renderRegularCards();
        break;
      case UpdateType.MAJOR:
        this._clearRegularList({resetRenderedFilmCount: true, resetSortType: true});
        this._renderSort();
        this._renderRegularCards();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    // - Сортируем задачи
    this._currentSortType = sortType;
    // - Очищаем список
    this._clearRegularList({resetRenderedFilmCount: true});
    // - Рендерим список заново
    this._renderSort();
    this._renderRegularCards();
  }

  // функция выполняется при обновлении карточки
  _onFilmChange(updatedFilm) {

    const filmsToUpdate = this._prevFilmCards.filter((prev) => prev.getFilmId() === updatedFilm.id);

    filmsToUpdate.forEach((upd) => {
      const updParent = upd.getElement().parentElement;
      this._renderFilm(updParent, updatedFilm, upd);
    });

    if(isPopupExist()) {
      this._renderPopup(updatedFilm);
    }
  }

  _clearRegularList({resetRenderedFilmCount = false, resetSortType = false} = {}) {
    const regularListCards = this._prevFilmCards.filter((card) => {
      return card.getElement().closest('[data-list-id]').dataset.listId === 'list';
    });
    regularListCards.forEach((card) => {
      remove(card);
      const prevIdx = this._prevFilmCards.indexOf(card);
      this._prevFilmCards.splice(prevIdx, 1);
    });

    remove(this._sortComp);
    remove(this._showMoreComp);

    if(resetRenderedFilmCount) {
      this._renderedFilmsCount = FILMS_COUNT_PER_STEP;
    }

    if(resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }
}
