import {createElement} from '../utils.js';

const createFilmsListTemplate = (isExtra, dataId) => {
  let title = '';
  switch(dataId) {
    case 'top-rated':
      title = 'Top rated';
      break;
    case 'most-commented':
      title = 'Most commented';
      break;
    default:
      title = 'All movies. Upcoming';
  }
  return `<section
      class="films-list ${isExtra ? 'films-list--extra' : ''}"
      data-id='${dataId}'
    >
      <h2 class="films-list__title ${!isExtra ? 'visually-hidden' : ''}">
        ${title}
      </h2>
      <div class="films-list__container">
      </div>
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
