import AbstractView from './abstract.js';

const createNavTemplate = () => {
  return '<nav class="main-navigation"></nav>';
};

export default class Navigation extends AbstractView {
  getTemplate() {
    return createNavTemplate();
  }
}
