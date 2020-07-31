const LOCAL_STORAGE_FAVORITES = "Favorite Gifos";
//localStorage.clear();

/**
 * @method cardButtonAction
 * @description select function to be executed accordint to button type
 * @param {object} e event information 
 */
function cardButtonAction(e) {
    const gifoIndex = e.currentTarget.getAttribute('data-index');
    const gifoCardType = e.currentTarget.getAttribute('data-cardType');
    const gifoInfo = getGifoInformation(gifoCardType, gifoIndex);
    switch (e.currentTarget.getAttribute('data-type')) {
        case "add-favorite":
            toggleFav(gifoCardType, gifoIndex);
            addfavoriteGifo(gifoCardType, gifoIndex);
            break;
        case "remove-favorite":
            toggleFav(gifoCardType, gifoIndex);
            removeFavoriteGifo(gifoInfo[3]);
            break;
        case "download":
            downloadGifo(gifoInfo);
            break;
        case "maximize":
            maximizeGifo(gifoInfo);
            maximizeButtonsConf(gifoCardType, gifoIndex, gifoInfo[3]);
            break;
        default:
            break;
    };
};

/**
 * @method getGifoInformation
 * @description Get Gifo information to asign inside modal
 * @param {string}
 * @returns {array}
 */
function getGifoInformation(gifoCardType, gifoIndex) {
    let gifoURL;
    let gifoUser;
    let gifoTitle;
    let gifoID;
    switch (gifoCardType) {
        case "trending_type":
            gifoURL = window.trendingGifosInfo[gifoIndex].images.original.url;
            gifoUser = window.trendingGifosInfo[gifoIndex].username;
            gifoTitle = window.trendingGifosInfo[gifoIndex].title;
            gifoID = window.trendingGifosInfo[gifoIndex].id;
            break;
        case "search_type":
            gifoURL = window.searchedGifosInfo[gifoIndex].images.original.url;
            gifoUser = window.searchedGifosInfo[gifoIndex].username;
            gifoTitle = window.searchedGifosInfo[gifoIndex].title;
            gifoID = window.searchedGifosInfo[gifoIndex].id;
            break;
        case "favorites":
            const favoriteGifosSelected = JSON.parse(localStorage.getItem(LOCAL_STORAGE_FAVORITES)) || [];
            gifoURL = favoriteGifosSelected[gifoIndex].images.original.url;
            gifoUser = favoriteGifosSelected[gifoIndex].username;
            gifoTitle = favoriteGifosSelected[gifoIndex].title;
            gifoID = favoriteGifosSelected[gifoIndex].id;
            break;
        default:
            break;
    }


    // if (gifoCardType === "trending_type") {
    //     gifoURL = window.trendingGifosInfo[gifoIndex].images.original.url;
    //     gifoUser = window.trendingGifosInfo[gifoIndex].username;
    //     gifoTitle = window.trendingGifosInfo[gifoIndex].title;
    //     gifoID = window.trendingGifosInfo[gifoIndex].id;

    // } else {
    //     gifoURL = window.searchedGifosInfo[gifoIndex].images.original.url;
    //     gifoUser = window.searchedGifosInfo[gifoIndex].username;
    //     gifoTitle = window.searchedGifosInfo[gifoIndex].title;
    //     gifoID = window.searchedGifosInfo[gifoIndex].id;
    // };

    return [gifoURL, gifoUser, gifoTitle, gifoID];

};

/**
 * @method addfavoriteGifo
 * @description Add Gifo Information to an array in localStorage
 * @param {string} 
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
 * @param {string} 
 */
function removeFavoriteGifo(gifoID) {
    let favoriteGifosSelected = JSON.parse(localStorage.getItem(LOCAL_STORAGE_FAVORITES)) || [];
    let favoriteIndex;
    favoriteGifosSelected.forEach((gifoInfo, index) => {
        if (gifoInfo.id === gifoID) {
            favoriteIndex = index;
        };
    });
    favoriteGifosSelected.splice(favoriteIndex, 1);
    localStorage.setItem(LOCAL_STORAGE_FAVORITES, JSON.stringify(favoriteGifosSelected));
};

function toggleFav(gifoCardType, gifoIndex) {
    let gifosWrap;
    if (gifoCardType === "trending_type") {
        gifosWrap = document.querySelector(".gifos-carrousel");
    } else {
        gifosWrap = document.querySelector(".gifos-wrapper");
    };
    const addFavorite = gifosWrap.getElementsByClassName("fav-hover");
    const removeFavorite = gifosWrap.getElementsByClassName("fav-active");
    addFavorite[gifoIndex].classList.toggle("hidden");
    removeFavorite[gifoIndex].classList.toggle("hidden");

    const wrapBtnMax = document.querySelector(".fullsize-btn-wrap");
    wrapBtnMax.querySelector(".fav-hover").classList.toggle("hidden");
    wrapBtnMax.querySelector(".fav-active").classList.toggle("hidden");
};

/**
 * @method downloadGifo
 * @description Download Gifo
 * @param {array} gifoInfo
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
 * @param {array} gifoInfo
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
 * @param {string}
 */
function maximizeButtonsConf(gifoCardType, gifoIndex, gifoID) {
    document.querySelector(".fullsize-exit").addEventListener('click', toggleModal);
    const fullsizeButtons = document.querySelectorAll(".fullsize-button");
    fullsizeButtons.forEach(button => {
        button.setAttribute("data-cardType", gifoCardType);
        button.setAttribute("data-index", gifoIndex);
        button.addEventListener('click', cardButtonAction);
    });
    let isFavorite = checkFavorite(gifoID);
    const wrapBtnMax = document.querySelector(".fullsize-btn-wrap");
    if (isFavorite) {
        wrapBtnMax.querySelector(".fav-hover").classList.add("hidden");
        wrapBtnMax.querySelector(".fav-active").classList.remove("hidden");
    } else {
        wrapBtnMax.querySelector(".fav-hover").classList.remove("hidden");
        wrapBtnMax.querySelector(".fav-active").classList.add("hidden");
    }
};

function checkFavorite(gifoID) {
    let isFavorite = false;
    let favoriteGifosSelected = JSON.parse(localStorage.getItem(LOCAL_STORAGE_FAVORITES)) || [];
    for (let gifo = 0; gifo < favoriteGifosSelected.length; gifo++) {
        if (favoriteGifosSelected[gifo].id === gifoID) {
            isFavorite = true;
            break;
        };

    };
    return isFavorite;
}

export {

    cardButtonAction,
    checkFavorite
};