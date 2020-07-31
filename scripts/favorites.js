const LOCAL_STORAGE_FAVORITES = "Favorite Gifos";

import { makeGifosCards } from './gifos_card_maker.js';

const htmlNode = document.querySelector(".gifos-wrapper");

function drawFavorites() {
    const favoriteGifosSelected = JSON.parse(localStorage.getItem(LOCAL_STORAGE_FAVORITES)) || [];
    if (favoriteGifosSelected.length === 0) {
        document.querySelector(".no-content").classList.remove("hidden");
    } else {
        makeGifosCards(favoriteGifosSelected, htmlNode, "favorites");
        const favoriteNodes = Array.from(htmlNode.querySelectorAll(".fav-active"));
        favoriteNodes.forEach(node => {
            node.addEventListener('click', removeNode);
        });
        document.querySelector(".links-content__button").classList.remove("hidden");
    };
};

function removeNode() {
    htmlNode.innerHTML = "";
    drawFavorites();
};

drawFavorites();