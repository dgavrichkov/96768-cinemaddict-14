import AbstractView from './abstract.js';

const createShowMoreTemplate = () => {
  return '<button class="films-list__show-more">Show more</button>';
};

export default class ShowMoreView extends AbstractView {

  getTemplate() {
    return createShowMoreTemplate();
  }

}
