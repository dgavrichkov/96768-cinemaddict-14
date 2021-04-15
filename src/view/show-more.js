
const createShowMoreTemplate = () => {
  return `
    <button class="films-list__show-more">Show more</button>
  `;
};

export default class ShowMore {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createShowMoreTemplate();
  }
}
