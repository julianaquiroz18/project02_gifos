const LOCAL_STORAGE_FAVORITES = "Favorite Gifos";
const LOCAL_STORAGE_TEMPORAL_FAVORITE = "Gifo temporal Info";

import { makeGifosCards } from './gifos_card_maker.js';

const htmlNode = document.querySelector(".gifos-wrapper");
document.querySelector(".fullsize-exit").addEventListener('click', removeNode);


function prueba() {
    console.log("entra");
};


function drawFavorites() {
    const favoriteGifosSelected = JSON.parse(localStorage.getItem(LOCAL_STORAGE_FAVORITES)) || [];
    if (favoriteGifosSelected.length === 0) {
        document.querySelector(".no-content").classList.remove("hidden");
        document.querySelector(".links-content__button").classList.add("hidden");
    } else {
        makeGifosCards(favoriteGifosSelected, htmlNode, "favorites");
        const favoriteNodes = Array.from(htmlNode.querySelectorAll(".fav-active"));
        favoriteNodes.forEach(node => node.addEventListener('click', removeNode));
        const maximizeBtn = Array.from(htmlNode.querySelectorAll(".maximize"))
        maximizeBtn.forEach(node => node.addEventListener('click', temporalGifoInfo));
        document.querySelector(".links-content__button").classList.remove("hidden");
    };
};

function removeNode() {
    htmlNode.innerHTML = "";
    drawFavorites();
};

function temporalGifoInfo(e) {
    const gifoIndex = e.currentTarget.getAttribute('data-index');
    const favoriteGifosSelected = JSON.parse(localStorage.getItem(LOCAL_STORAGE_FAVORITES)) || [];
    localStorage.setItem(LOCAL_STORAGE_TEMPORAL_FAVORITE, JSON.stringify(favoriteGifosSelected[gifoIndex]));
}

drawFavorites();

export {

    drawFavorites
};