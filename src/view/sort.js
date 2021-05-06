import AbstractView from './abstract.js';
import {SortType} from '../const';

const createSortTemplate = () => {
  return `<ul class="sort">
      <li><a href="#" class="sort__button sort__button--active" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
      <li><a href="#" class="sort__button" data-sort-type="${SortType.DATE}">Sort by date</a></li>
      <li><a href="#" class="sort__button" data-sort-type="${SortType.RATE}">Sort by rating</a></li>
    </ul>
  `;
};

export default class Sort extends AbstractView {
  constructor() {
    super();

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate();
  }

  _sortTypeChangeHandler(e) {
    if (e.target.tagName !== 'A') {
      return;
    }

    e.preventDefault();
    const btn = e.target;
    document.querySelector('.sort__button--active').classList.remove('sort__button--active');
    btn.classList.add('sort__button--active');
    this._callback.sortTypeChange(btn.dataset.sortType);

  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }
}
