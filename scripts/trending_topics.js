import constant from './constants.js';
import { apiRequest } from './services.js';
import { capitalizeFirstLetter } from './helpers.js';
import { listenSelectedSuggestion } from './search.js';
/**
 * Global Variables
 */
const trendingList = document.querySelector(".trending-topics__list");
const trendingTopicsURL = constant.BASE_URL + "trending/searches" + constant.API_KEY;
let trendingTopicsArray = [];
let allTrengingTopics = "";
/**
 * @method trendingTopicsData
 * @description get trending topics data
 * @param string URL
 */
const trendingTopicsData = apiRequest(trendingTopicsURL);
trendingTopicsData.then((response) => {
    trendingTopicsArray = response.data.slice(0, 5);
    topicsToLink(trendingTopicsArray);
}).catch((error) => { console.log(error) });

/**
 * @method topicsToLink
 * @description Convert trending topics array to links
 * @param {array} 
 */
const topicsToLink = (array => {
    array.forEach(topic => {
        allTrengingTopics += topicsMarkup(topic);
        trendingList.innerHTML = allTrengingTopics;
        trendingList.querySelectorAll('.trending-topics__item').forEach((button) => button.addEventListener('click', listenSelectedSuggestion));
    });
});

/**
 * @method topicsMarkup
 * @description Links making method
 * @param string 
 * @returns string
 */
const topicsMarkup = (topic => {
    return (`<li class="trending-topics__item"><a class="prueba" href="#search_bar">${capitalizeFirstLetter(topic)}</a></li>`);
});