import {trimDescription, defindRateColor, minutesToFormat} from '../utils';

const createFilmCardTemplate = (film) => {
  const {id, name, poster, description, comments, rating, releaseYear, runtime, genres} = film;

  return `
    <article class="film-card" data-id="${id}">
      <h3 class="film-card__title">${name}</h3>
      <p class="film-card__rating film-card__rating--${defindRateColor(rating)}">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseYear}</span>
        <span class="film-card__duration">${minutesToFormat(runtime)}</span>
        <span class="film-card__genre">${genres[0]}</span>
      </p>
      <img src="${poster}" alt="${name}" class="film-card__poster">
      <p class="film-card__description">${trimDescription(description)}</p>
      <a class="film-card__comments">${comments.length} comments</a>
      <div class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite" type="button">Mark as favorite</button>
      </div>
    </article>
  `;
};

export class FilmCard {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFilmCardTemplate();
  }
}
