import { apiRequest } from './services.js';
import constant from './constants.js';
import { makeGifosCards } from './gifos_card_maker.js';
/**
 * Global Variables
 */
const trendingGifosURL = constant.BASE_URL + "gifs/trending" + constant.API_KEY;

/**
 * @method trendingGifosData
 * @description get trending gifod data
 * @param string URL
 */
const trendingGifosData = apiRequest(trendingGifosURL);
trendingGifosData.then((response) => {
    const htmlNode = document.querySelector(".gifos-carrousel");
    makeGifosCards(response, htmlNode, "trending_type");
}).catch((error) => { console.log(error) });