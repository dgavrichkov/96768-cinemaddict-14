import {createElement} from '../utils.js';

const createFilmsListTemplate = (isExtra, dataId) => {
  let title = '';
  switch(dataId) {
    case 'top-rated':
      title = '<h2 class="films-list__title">Top rated</h2>';
      break;
    case 'most-commented':
      title = '<h2 class="films-list__title">Most commented</h2>';
      break;
    case 'empty':
      title = '<h2 class="films-list__title">There are no movies in our database</h2>';
      break;
    default:
      title = '<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>';
  }
  return `<section
      class="films-list ${isExtra ? 'films-list--extra' : ''}"
      data-id='${dataId}'
    >
      ${title}
      ${dataId === 'empty' ? '' : '<div class="films-list__container"></div>'}
    </section>
  `;
};

export default class FilmsList {
  constructor(isExtra, dataId) {
    this._element = null;
    this._isExtra = isExtra;
    this._dataId = dataId;
  }

  getTemplate() {
    return createFilmsListTemplate(this._isExtra, this._dataId);
  }

  getElement() {
    if(!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
