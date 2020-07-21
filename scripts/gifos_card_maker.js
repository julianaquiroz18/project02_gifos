let allGifosCards;
/**
 * @method makeGifosCards
 * @description Get gifos data and create cards
 * @param array gifos
 */
function makeGifosCards(gifosInfo, htmlNode, cardType) {
    allGifosCards = "";
    gifosInfo.data.forEach((gifo) => {
        const gifoURL = gifo.images.original.url;
        const gifoUser = gifo.username;
        const gifoTitle = gifo.title;
        htmlNode.innerHTML = allGifos(gifoURL, gifoUser, gifoTitle, cardType);
    });
};
/**
 * @method allGifos
 * @description create all Gifos Cards HTML
 * @param string 
 * @returns string
 */
const allGifos = ((gifoURL, gifoUser, gifoTitle, cardType) => {
    allGifosCards += cardMarkup(gifoURL, gifoUser, gifoTitle, cardType);
    return allGifosCards;
});
/**
 * @method cardMarkup
 * @description Card marking method
 * @param string 
 * @returns string
 */
const cardMarkup = ((url, user, title, cardType) => {
    const cardContent = `
        <img class="gifos-container-card__img" src=${url} alt="Gifo">
        <div class="overlay">
            <div class="gifos-container-card__buttons">
                <button class="card-button" type="button"><i class="icon-icon-fav-hover"></i></button>
                <button class="card-button" type="button"><i class="icon-icon-download"></i></button>
                <button class="card-button" type="button"><i class="icon-icon-max"></i></button>
            </div>
            <div class="gifos-container-card__info">
                <p class="card__user">${user}</p>
                <p class="card__title">${title}</p>
            </div>
        </div>`

    if (cardType === "trending_type") {
        return (
            `<div class="gifos-container-card trending-card">${cardContent}</div>`
        );
    } else {
        return (
            `<div class="gifos-container-card">${cardContent}</div>`
        );
    }
});

export {

    makeGifosCards
};