import { apiRequest } from './services.js';
import constant from './utils.js';
/**
 * Global Variables
 */
const trendingGifosURL = constant.BASE_URL + "gifs/trending" + constant.API_KEY;
const gifosCarrousel = document.querySelector(".gifos-carrousel");
let allGifosCards = "";

const trendingGifosData = apiRequest(trendingGifosURL);
trendingGifosData.then((response) => {
    getGifos(response.data);
}).catch((error) => { console.log(error) });
/**
 * @method getGifos
 * @description Get gifo URL
 * @param array gifos
 */
const getGifos = (gifosInfo) => {
    gifosInfo.forEach((gifo) => {
        const gifoURL = gifo.images.original.url;
        const gifoUser = gifo.username;
        const gifoTitle = gifo.title;
        gifosCarrousel.innerHTML = allTrendingGifos(gifoURL, gifoUser, gifoTitle);
    });
};
/**
 * @method allTrendingGifos
 * @description create all Gifos Cards HTML
 * @param string 
 * @returns string
 */
const allTrendingGifos = ((gifoURL, gifoUser, gifoTitle) => {
    allGifosCards += cardMarkup(gifoURL, gifoUser, gifoTitle);
    return allGifosCards;
})

/**
 * @method cardMarkup
 * @description Card marking method
 * @param string 
 * @returns string
 */
const cardMarkup = ((url, user, title) => {
    return (
        `<div class="gifos-container-card trending-card">
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
        </div>
    </div>`
    );
});