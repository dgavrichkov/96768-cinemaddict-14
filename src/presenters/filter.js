import {filter} from '../utils/filter.js';
import { render, RenderPosition } from '../utils/render.js';
import FilterView from '../view/menu.js';


export default class Filter {
  constructor(filterContainer, filterModel, filmsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;

    this._filterComp = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

  }

  init() {
    const filters = this._getFilters();
    const prevFilterComp = this._filterComp;

    this._filterComp = new FilterView(filters, this._filterModel.getFilter());
    this._filterComp.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if(prevFilterComp === null) {
      render(this._filterContainer, this._filterComp, RenderPosition.BEFOREEND);
    }

  }

  _getFilters() {
    const films = this._filmsModel.getFilms();

    // отсюда должно возвращаться вот такое
    const filters = {
      all: 0,
      watchlist: 10,
      favorite: 10,
      history: 10,
    };

    return filters;
  }

  _handleModelEvent() {

  }

  _handleFilterTypeChange() {
    console.log('filter type changed');
  }
}
