import AbstractView from './abstract.js';
import {trimDescription, defindRateColor, minutesToFormat} from '../utils/film.js';

const createFilmCardTemplate = (film) => {
  if(!film) {
    return;
  }
  const {
    id,
    name,
    poster,
    description,
    comments,
    rating,
    releaseYear,
    runtime,
    genres,
    watchlist,
    alreadyWatched,
    favorite,
  } = film;

  const favoriteClass = favorite ? 'film-card__controls-item--active film-card__controls-item--favorite' : 'film-card__controls-item--favorite';
  const watchlistClass = watchlist
    ? 'film-card__controls-item--active film-card__controls-item--add-to-watchlist'
    : 'film-card__controls-item--add-to-watchlist';
  const watchedClass = alreadyWatched
    ? 'film-card__controls-item--active film-card__controls-item--mark-as-watched'
    : 'film-card__controls-item--mark-as-watched';

  return `<article class="film-card" data-id="${id}">
      <h3 class="film-card__title js-popup-trigger">${name}</h3>
      <p class="film-card__rating film-card__rating--${defindRateColor(rating)}">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseYear}</span>
        <span class="film-card__duration">${minutesToFormat(runtime)}</span>
        <span class="film-card__genre">${genres[0]}</span>
      </p>
      <img src="${poster}" alt="${name}" class="film-card__poster js-popup-trigger">
      <p class="film-card__description">${trimDescription(description)}</p>
      <a class="film-card__comments js-popup-trigger">${comments.length} comments</a>
      <div class="film-card__controls">
        <button class="film-card__controls-item button ${watchlistClass} js-watchlist" type="button">Add to watchlist</button>
        <button class="film-card__controls-item button ${watchedClass} js-watched" type="button">Mark as watched</button>
        <button class="film-card__controls-item button ${favoriteClass} js-favorite" type="button">Mark as favorite</button>
      </div>
    </article>
  `;
};

export default class FilmCard extends AbstractView {
  constructor(film) {
    super();
    this._film = film;
    this._openDetailHandler = this._openDetailHandler.bind(this);
    this._clickFavoriteHandler = this._clickFavoriteHandler.bind(this);
    this._clickWatchlistHandler = this._clickWatchlistHandler.bind(this);
    this._clickWatchedHandler = this._clickWatchedHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  _openDetailHandler(e) {
    if(document.querySelector('.film-details')) {
      return;
    }
    e.stopPropagation();
    e.preventDefault();
    this._callback.click();
  }

  _clickFavoriteHandler(e) {
    e.preventDefault();
    this._callback.favoriteClick();
  }

  _clickWatchlistHandler(e) {
    e.preventDefault();
    this._callback.watchlistClick();
  }

  _clickWatchedHandler(e) {
    e.preventDefault();
    this._callback.watchedClick();
  }

  setOpenDetailHandler(callback) {
    this._callback.click = callback;

    const openTriggers = [...this.getElement().querySelectorAll('.js-popup-trigger')];

    openTriggers.forEach((trg) => {
      trg.addEventListener('click', this._openDetailHandler);
    });
  }

  setClickFavoriteHandler(callback) {
    this._callback.favoriteClick = callback;
    const favTrg = this.getElement().querySelector('.js-favorite');
    favTrg.addEventListener('click', this._clickFavoriteHandler);
  }

  setClickWatchlistHandler(callback) {
    this._callback.watchlistClick = callback;
    const watchlistTrg = this.getElement().querySelector('.js-watchlist');
    watchlistTrg.addEventListener('click', this._clickWatchlistHandler);
  }

  setClickWatchedHandler(callback) {
    this._callback.watchedClick = callback;
    const watchedTrg = this.getElement().querySelector('.js-watched');
    watchedTrg.addEventListener('click', this._clickWatchedHandler);
  }
}
