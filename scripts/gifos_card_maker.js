let allGifosCards;
/**
 * @method makeGifosCards
 * @description Get gifos data and create cards
 * @param array gifos
 */
function makeGifosCards(gifosInfo, htmlNode, cardType) {
    allGifosCards = "";
    gifosInfo.data.forEach((gifo, index) => {
        const gifoURL = gifo.images.original.url;
        const gifoUser = gifo.username;
        const gifoTitle = gifo.title;
        htmlNode.innerHTML = allGifos(gifoURL, gifoUser, gifoTitle, cardType, index);
        htmlNode.querySelectorAll('.card-button').forEach((button) => button.addEventListener('click', cardButtonAction));
    });
};
/**
 * @method allGifos
 * @description create all Gifos Cards HTML
 * @param string 
 * @returns string
 */
const allGifos = ((gifoURL, gifoUser, gifoTitle, cardType, index) => {
    allGifosCards += cardMarkup(gifoURL, gifoUser, gifoTitle, cardType, index);
    return allGifosCards;
});
/**
 * @method cardMarkup
 * @description Card marking method
 * @param string 
 * @returns string
 */
const cardMarkup = ((url, user, title, cardType, index) => {
    const cardContent = `
        <img class="gifos-container-card__img" src="${url}" alt="Gifo">
        <div class="overlay">
            <div class="gifos-container-card__buttons">
                <button class="card-button" data-type="favorite" data-url="${url}" type="button"><i class="icon-icon-fav-hover"></i></button>
                <button class="card-button" data-type="download" data-url="${url}" data-title="${title}" type="button"><i class="icon-icon-download"></i></button>
                <button class="card-button" data-type="maximize" data-url="${url}" data-index="${index}" type="button"><i class="icon-icon-max"></i></button>
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

/**
 * @method cardButtonAction
 * @description select function to be executed accordint to button type
 * @param object event information 
 */
function cardButtonAction(e) {
    const gifoURL = e.currentTarget.getAttribute('data-url');
    const gifoName = e.currentTarget.getAttribute('data-title');
    switch (e.currentTarget.getAttribute('data-type')) {
        case "favorite":
            alert(gifoURL);
            break;
        case "download":
            downloadGifo(gifoURL, gifoName);
            break;
        case "maximize":
            alert(gifoURL);
            break;
        default:
            break;
    }
}
/**
 * @method downloadGifo
 * @description Download Gifo
 * @param string URL
 */
async function downloadGifo(gifoURL, gifoName) {
    let fetchResponse = await fetch(gifoURL);
    let blobObject = await fetchResponse.blob();
    let imgURL = URL.createObjectURL(blobObject);
    const saveGif = document.createElement("a")
    saveGif.href = imgURL; // Asigna url
    saveGif.download = `${gifoName}.gif`; // Elije un filename aleatorio
    document.body.appendChild(saveGif);
    saveGif.click();
    document.body.removeChild(saveGif);
}


export {

    makeGifosCards
};