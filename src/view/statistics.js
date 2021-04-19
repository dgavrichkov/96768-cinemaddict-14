import {createElement} from '../utils.js';

const createStatisticsTemplate = (films) => {
  return `<p>${films.length} movies inside</p>`;
};

export default class SiteStat {
  constructor(statData) {
    this._statData = statData;
    this._element = null;
  }

  getTemplate() {
    return createStatisticsTemplate(this._statData);
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
