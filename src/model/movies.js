import Observer from '../utils/observer.js';

export default class Movies extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(films) {
    this._films = films.slice();
  }

  getFilms() {
    return this._films;
  }

  updateFilm(updateType, update) {
    const idx = this._films.findIndex((film) => film.id === update.id);

    if(idx === -1) {
      throw new Error('Film not exist, cannot update');
    }

    this._films = [
      ...this._films.slice(0, idx),
      update,
      ...this._films.slice(idx + 1),
    ];

    this._notify(updateType, update);
  }
}
