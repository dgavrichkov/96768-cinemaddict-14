import AbstractView from './abstract.js';
import {FilterType} from '../const';

const createMenuTemplate = (filter, currentFilterType) => {
  const {watchlist, favorite, history} = filter;

  return `<nav class="main-navigation">
      <div class="main-navigation__items">
        <a
          href="#all"
          class="main-navigation__item ${currentFilterType === FilterType.ALL ? 'main-navigation__item--active' : ''}"
        >All movies</a>
        <a
          href="#watchlist"
          class="main-navigation__item ${currentFilterType === FilterType.WATCHLIST ? 'main-navigation__item--active' : ''}"
        >
          Watchlist <span class="main-navigation__item-count">${watchlist}</span>
        </a>
        <a
          href="#history"
          class="main-navigation__item ${currentFilterType === FilterType.WATCHED ? 'main-navigation__item--active' : ''}"
        >
          History <span class="main-navigation__item-count">${history}</span>
        </a>
        <a
          href="#favorites"
          class="main-navigation__item ${currentFilterType === FilterType.FAVORITES ? 'main-navigation__item--active' : ''}"
        >
          Favorites <span class="main-navigation__item-count">${favorite}</span>
        </a>
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>
  `;
};

export default class Menu extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilterType = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate(this._filters, this._currentFilterType);
  }

  _filterTypeChangeHandler(e) {
    e.preventDefault();
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.changeFilterType = callback;
  }
}
