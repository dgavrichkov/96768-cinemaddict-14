export const filmsList = (isExtra, dataId) => {
  let title = '';
  switch(dataId) {
    case 'top-rated':
      title = 'Top rated';
      break;
    case 'most-commented':
      title = 'Most commented';
      break;
    default:
      title = 'All movies. Upcoming';
  }
  return `
    <section
      class="films-list ${isExtra ? 'films-list--extra' : ''}"
      data-id='${dataId}'
    >
      <h2 class="films-list__title ${!isExtra ? 'visually-hidden' : ''}">
        ${title}
      </h2>
      <div class="films-list__container">
      </div>
    </section>
  `;
};
