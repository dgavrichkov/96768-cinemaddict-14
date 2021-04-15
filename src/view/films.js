const createFilmsTemplate = () => {
  return `
    <section class="films">
    </section>
  `;
};

export class Films {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFilmsTemplate();
  }
}
