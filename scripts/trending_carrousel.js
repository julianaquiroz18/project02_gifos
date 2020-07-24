import constant from './constants.js';
import { apiRequest } from './services.js';
import { makeGifosCards } from './gifos_card_maker.js';
/**
 * Global Variables
 */
const trendingGifosURL = constant.BASE_URL + "gifs/trending" + constant.API_KEY;
const left = document.querySelector(".trending-box__button-left");
const right = document.querySelector(".trending-box__button-right");
const trendingGifosContainer = document.querySelector(".gifos-carrousel");
const LEFT = "left";
const RIGHT = "right";

/**
 * Events
 */
left.addEventListener('click', () => { scroll(LEFT) });
right.addEventListener('click', () => { scroll(RIGHT) });


/**
 * @method trendingGifosData
 * @description get trending gifod data
 * @param string URL
 */
const trendingGifosData = apiRequest(trendingGifosURL);
trendingGifosData.then((response) => {
    const htmlNode = document.querySelector(".gifos-carrousel");
    window.trendingGifosInfo = response.data;
    makeGifosCards(response, htmlNode, "trending_type");
}).catch((error) => { console.log(error) });

/**
 * @method scroll
 * @description Give movement to Gifos Carrousel
 * @param string Scroll direction
 */
function scroll(direction) {
    let scrollAmount = 0;
    const distanceToScroll = 500;
    const step = 10;
    const slideTimer = setInterval(function() {
        if (direction === "right") {
            trendingGifosContainer.scrollLeft += step;
        } else {
            trendingGifosContainer.scrollLeft -= step;
        }
        scrollAmount += step;
        if (scrollAmount >= distanceToScroll) {
            window.clearInterval(slideTimer);
        }
    }, 10);
}