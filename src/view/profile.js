const createProfileTemplate = (userStat) => {
  const {userRank} = userStat;
  return `
    <section class="header__profile profile">
      <p class="profile__rating">${userRank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>
  `;
};

export class Profile {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createProfileTemplate();
  }
}
