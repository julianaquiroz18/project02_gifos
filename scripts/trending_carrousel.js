import { apiRequest } from './services.js';
/**
 * Global Variables
 */
const trendingGifosURL = "https://api.giphy.com/v1/gifs/trending?api_key=9Bbx127nke90Ndmr1nuEio9LFbL62OpO";
const gifosCarrousel = document.querySelector(".gifos-carrousel");
let allGifosCards = "";

const trendingGifosData = apiRequest(trendingGifosURL);
trendingGifosData.then((response) => {
    getGifos(response.data);
});
/**
 * @method getGifos
 * @description Get gifo URL
 * @param array gifos
 */
const getGifos = (gifosInfo) => {
    gifosInfo.forEach((gifo) => {
        const gifoURL = gifo.images.original.url;
        gifosCarrousel.innerHTML = allTrendingGifos(gifoURL);
    });
};
/**
 * @method allTrendingGifos
 * @description create all Gifos Cards HTML
 * @param string 
 * @returns string
 */
const allTrendingGifos = ((gifoURL) => {
    allGifosCards += cardMarkup(gifoURL);
    return allGifosCards;
})

/**
 * @method cardMarkup
 * @description Card marking method
 * @param string 
 * @returns string
 */
const cardMarkup = ((img) => {
    return (
        `<div class="gifos-container-card trending-card">
            <img class="gifos-container-card__img" src=${img} alt="Gifo">
            <div class="overlay">
                <div class="gifos-container-card__buttons">
                    <button class="card-button" type="button"><i class="icon-icon-fav-hover"></i></button>
                    <button class="card-button" type="button"><i class="icon-icon-download"></i></button>
                    <button class="card-button" type="button"><i class="icon-icon-max"></i></button>
                </div>
            <div class="gifos-container-card__info">
                <p class="card__user">User</p>
                <p class="card__title">Titulo GIFO</p>
            </div>
        </div>
    </div>`
    );
});