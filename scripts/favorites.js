import { makeGifosCards } from './gifos_card_maker.js';
/**
 * Global Variables
 */
const LOCAL_STORAGE_FAVORITES = "Favorite Gifos";
const LOCAL_STORAGE_TEMPORAL_FAVORITE = "Gifo temporal Info";
const htmlNode = document.querySelector(".gifos-wrapper");
const seeMoreBtn = document.querySelector(".links-content__button");
let currentPage = 0;
/**
 * Events
 */
document.querySelector(".fullsize-exit").addEventListener('click', removeNode);
seeMoreBtn.addEventListener('click', seeMore);

/**
 * @method seeMore
 * @description Draw more gifos (12 per time)
 */
function seeMore() {
    currentPage++;
    drawFavorites(currentPage);
}

/**
 * @method drawFavorites
 * @description Show the gifos favorites storage in local storage
 */
function drawFavorites(page = 0) {
    const favoriteGifosSelected = JSON.parse(localStorage.getItem(LOCAL_STORAGE_FAVORITES)) || [];
    const initialIndex = page * 12;
    const finalIndex = initialIndex + 12;
    const favoriteGifosSlice = favoriteGifosSelected.slice(initialIndex, finalIndex);
    if (favoriteGifosSlice.length === 0 & page === 0) {
        document.querySelector(".no-content").classList.remove("hidden");
        seeMoreBtn.classList.add("hidden");
        return;
    }
    if (page === 0) {
        htmlNode.innerHTML = "";
    };
    document.querySelector(".no-content").classList.add("hidden");
    makeGifosCards(favoriteGifosSlice, htmlNode, "favorites");
    const favoriteNodes = Array.from(htmlNode.querySelectorAll(".fav-active"));
    favoriteNodes.forEach(node => node.addEventListener('click', removeNode));
    const maximizeBtn = Array.from(htmlNode.querySelectorAll(".maximize"))
    maximizeBtn.forEach(node => node.addEventListener('click', temporalGifoInfo));
    const containerImg = Array.from(htmlNode.querySelectorAll(".gifos-container-card__img"))
    containerImg.forEach(node => node.addEventListener('click', temporalGifoInfo));
    seeMoreBtn.classList.remove("hidden");
    if (favoriteGifosSelected.slice(finalIndex, finalIndex + 12).length === 0 & page != 0) {
        seeMoreBtn.classList.add("hidden");
    };
};

/**
 * @method removeNode
 * @description Remove gifos deselected as favorite
 */
function removeNode() {
    htmlNode.innerHTML = "";
    drawFavorites();
};

/**
 * @method temporalGifoInfo
 * @description Save temporally gifo Information in local storage
 * @param {object} e event information
 */
function temporalGifoInfo(e) {
    const gifoIndex = e.currentTarget.getAttribute('data-index');
    const favoriteGifosSelected = JSON.parse(localStorage.getItem(LOCAL_STORAGE_FAVORITES)) || [];
    localStorage.setItem(LOCAL_STORAGE_TEMPORAL_FAVORITE, JSON.stringify(favoriteGifosSelected[gifoIndex]));
}

drawFavorites();