let allGifosCards;
const LOCAL_STORAGE_FAVORITES = "Favorite Gifos";


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
        //htmlNode.querySelectorAll('.gifos-container-card__img').forEach((image) => image.addEventListener('click', cardButtonAction));
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
        <img class="gifos-container-card__img" src="${url}" alt="Gifo" data-type="maximize" data-cardType="${cardType}" data-index="${index}">
        <div class="overlay">
            <div class="gifos-container-card__buttons">
                <button class="card-button fav-hover" data-type="add-favorite" data-cardType="${cardType}" data-index="${index}" type="button"><i class="icon-icon-fav-hover"></i></i></button>
                <button class="card-button fav-active hidden" data-type="remove-favorite" data-cardType="${cardType}" data-index="${index}" type="button"><i class="icon-icon-fav-active"></i></button>
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
    };
});

/**
 * @method cardButtonAction
 * @description select function to be executed accordint to button type
 * @param object event information 
 */
function cardButtonAction(e) {
    const gifoIndex = e.currentTarget.getAttribute('data-index');
    const gifoCardType = e.currentTarget.getAttribute('data-cardType');
    const gifoInfo = getGifoInformation(gifoCardType, gifoIndex);
    switch (e.currentTarget.getAttribute('data-type')) {
        case "add-favorite":
            toggleFav(gifoIndex);
            addfavoriteGifo(gifoCardType, gifoIndex);
            break;
        case "remove-favorite":
            toggleFav(gifoIndex);
            removeFavoriteGifo(gifoCardType, gifoIndex);
            break;
        case "download":
            downloadGifo(gifoInfo);
            break;
        case "maximize":
            maximizeGifo(gifoInfo);
            maximizeButtonsConf(gifoCardType, gifoIndex);
            break;
        default:
            break;
    };
};

/**
 * @method getGifoInformation
 * @description Get Gifo information to asign inside modal
 * @param string 
 * @returns [array]
 */
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

/**
 * @method addfavoriteGifo
 * @description Add Gifo Information to an array in localStorage
 * @param string 
 */
function addfavoriteGifo(gifoCardType, gifoIndex) {
    let favoriteGifosSelected = JSON.parse(localStorage.getItem(LOCAL_STORAGE_FAVORITES)) || [];
    if (gifoCardType === "trending_type") {
        favoriteGifosSelected.push(window.trendingGifosInfo[gifoIndex]);
    } else {
        favoriteGifosSelected.push(window.searchedGifosInfo[gifoIndex]);
    };
    localStorage.setItem(LOCAL_STORAGE_FAVORITES, JSON.stringify(favoriteGifosSelected));
};

/**
 * @method removeFavoriteGifo
 * @description Remove Gifo Information from array in localStorage
 * @param string 
 */
function removeFavoriteGifo(gifoCardType, gifoIndex) {
    let favoriteGifosSelected = JSON.parse(localStorage.getItem(LOCAL_STORAGE_FAVORITES)) || [];
    let gifoId;
    let favoriteIndex;
    if (gifoCardType === "trending_type") {
        gifoId = window.trendingGifosInfo[gifoIndex].id;
    } else {
        gifoId = window.searchedGifosInfo[gifoIndex].id;
    };
    favoriteGifosSelected.forEach((gifoInfo, index) => {
        if (gifoInfo.id == gifoId) {
            favoriteIndex = index;
        };
    });
    favoriteGifosSelected.splice(favoriteIndex, 1);
    localStorage.setItem(LOCAL_STORAGE_FAVORITES, JSON.stringify(favoriteGifosSelected));
};

function toggleFav(gifoIndex) {
    const addFavorite = document.getElementsByClassName("fav-hover");
    const removeFavorite = document.getElementsByClassName("fav-active");
    addFavorite[gifoIndex].classList.toggle("hidden");
    removeFavorite[gifoIndex].classList.toggle("hidden");
};

/**
 * @method downloadGifo
 * @description Download Gifo
 * @param array
 */
async function downloadGifo(gifoInfo) {
    let fetchResponse = await fetch(gifoInfo[0]);
    let blobObject = await fetchResponse.blob();
    let imgURL = URL.createObjectURL(blobObject);
    const saveGif = document.createElement("a")
    saveGif.href = imgURL;
    saveGif.download = `${gifoInfo[2]}.gif`;
    document.body.appendChild(saveGif);
    saveGif.click();
    document.body.removeChild(saveGif);
};

/**
 * @method maximizeGifo
 * @description maximize Gifo
 * @param array
 */
function maximizeGifo(gifoInfo) {
    document.querySelector(".fullsize-gifo").src = gifoInfo[0];
    document.querySelector(".fullsize-user").textContent = gifoInfo[1];
    document.querySelector(".fullsize-title").textContent = gifoInfo[2];
    toggleModal();
};

function toggleModal() {
    document.querySelector(".modal").classList.toggle("hidden");
};

/**
 * @method maximizeButtonsConf
 * @description including data information and event listener to modal buttons
 * @param string
 */
function maximizeButtonsConf(gifoCardType, gifoIndex) {
    document.querySelector(".fullsize-exit").addEventListener('click', toggleModal);
    const fullsizeButtons = document.querySelectorAll(".fullsize-button");
    fullsizeButtons.forEach(button => {
        button.setAttribute("data-cardType", gifoCardType);
        button.setAttribute("data-index", gifoIndex);
        button.addEventListener('click', cardButtonAction);
    });
};

export {

    makeGifosCards
};