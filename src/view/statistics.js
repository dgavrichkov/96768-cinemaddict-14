const createStatisticsTemplate = (films) => {
  return `
    <p>${films.length} movies inside</p>
  `;
};

export class SiteStat {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createStatisticsTemplate();
  }
}
