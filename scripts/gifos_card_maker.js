let allGifosCards;
document.querySelector(".fullsize-exit").addEventListener('click', toggleModal);
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
        htmlNode.querySelectorAll('.gifos-container-card__img').forEach((image) => image.addEventListener('click', maximizeGifoMobile));
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
        <img class="gifos-container-card__img" src="${url}" alt="Gifo" data-cardType="${cardType}" data-index="${index}">
        <div class="overlay">
            <div class="gifos-container-card__buttons">
                <button class="card-button" data-type="favorite" data-cardType="${cardType}" data-index="${index}" type="button"><i class="icon-icon-fav-hover"></i></button>
                <button class="card-button" data-type="download" data-cardType="${cardType}" data-index="${index}" type="button"><i class="icon-icon-download"></i></button>
                <button class="card-button" data-type="maximize" data-cardType="${cardType}" data-index="${index}" type="button"><i class="icon-icon-max"></i></button>
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
    const gifoIndex = e.currentTarget.getAttribute('data-index');
    const gifoCardType = e.currentTarget.getAttribute('data-cardType');
    switch (e.currentTarget.getAttribute('data-type')) {
        case "favorite":
            alert(gifoURL);
            break;
        case "download":
            const gifoInfo = getGifoInformation(gifoCardType, gifoIndex);
            downloadGifo(gifoInfo);
            break;
        case "maximize":
            maximizeGifo(gifoCardType, gifoIndex);
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
async function downloadGifo(gifoInfo) {
    let fetchResponse = await fetch(gifoInfo[0]);
    let blobObject = await fetchResponse.blob();
    let imgURL = URL.createObjectURL(blobObject);
    const saveGif = document.createElement("a")
    saveGif.href = imgURL; // Asigna url
    saveGif.download = `${gifoInfo[2]}.gif`; // Elije un filename aleatorio
    document.body.appendChild(saveGif);
    saveGif.click();
    document.body.removeChild(saveGif);
}


function maximizeGifoMobile(e) {
    const gifoIndex = e.currentTarget.getAttribute('data-index');
    const gifoCardType = e.currentTarget.getAttribute('data-cardType');
    maximizeGifo(gifoCardType, gifoIndex);
}
/**
 * @method maximizeGifo
 * @description maximize Gifo
 * @param string URL
 */
function maximizeGifo(gifoCardType, gifoIndex) {
    const gifoInfo = getGifoInformation(gifoCardType, gifoIndex);
    document.querySelector(".fullsize-gifo").src = gifoInfo[0];
    document.querySelector(".fullsize-user").textContent = gifoInfo[1];
    document.querySelector(".fullsize-title").textContent = gifoInfo[2];
    const fullsizeButtons = document.querySelectorAll(".fullsize-button");
    fullsizeButtons.forEach(button => {
        button.setAttribute("data-cardType", gifoCardType);
        button.setAttribute("data-index", gifoIndex);
        button.addEventListener('click', cardButtonAction);
    });
    toggleModal();
};


function toggleModal() {
    document.querySelector(".modal").classList.toggle("hidden");
}

function getGifoInformation(gifoCardType, gifoIndex) {
    let gifoURL;
    let gifoUser;
    let gifoTitle;
    if (gifoCardType === "trending_type") {
        gifoURL = window.trendingGifosInfo[gifoIndex].images.original.url;
        gifoUser = window.trendingGifosInfo[gifoIndex].username;
        gifoTitle = window.trendingGifosInfo[gifoIndex].title;

    } else {
        gifoURL = window.searchedGifosInfo[gifoIndex].images.original.url;
        gifoUser = window.searchedGifosInfo[gifoIndex].username;
        gifoTitle = window.searchedGifosInfo[gifoIndex].title;
    };

    return [gifoURL, gifoUser, gifoTitle];

};



export {

    makeGifosCards
};