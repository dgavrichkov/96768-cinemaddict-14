export const getProfileTemplate = (userStat) => {
  const {userRank} = userStat;
  return `
    <section class="header__profile profile">
      <p class="profile__rating">${userRank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>
  `;
};
