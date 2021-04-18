import {createElement} from '../utils.js';

const createProfileTemplate = (userStat) => {
  const {userRank} = userStat;
  return `<section class="header__profile profile">
      <p class="profile__rating">${userRank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>
  `;
};

export default class Profile {
  constructor(statData) {
    this._element = null;
    this._statData = statData;
  }

  getTemplate() {
    return createProfileTemplate(this._statData);
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
