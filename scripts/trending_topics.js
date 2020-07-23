import constant from './constants.js';
import { apiRequest } from './services.js';
import { capitalizeFirstLetter } from './helpers.js';
/**
 * Global Variables
 */
const trendingList = document.querySelector(".trending-topics__list");
const trendingTopicsURL = constant.BASE_URL + "trending/searches" + constant.API_KEY;

/**
 * @method trendingTopicsData
 * @description get trending topics data
 * @param string URL
 */
const trendingTopicsData = apiRequest(trendingTopicsURL);
trendingTopicsData.then((response) => {
    const trendingTopicsArray = response.data;
    trendingList.textContent = topicsString(trendingTopicsArray.slice(0, 5));
}).catch((error) => { console.log(error) });

/**
 * @method topicsString
 * @description Convert trending topics array to string
 * @param {array} 
 * @returns string
 */
const topicsString = (topics) => {
    let topicsString = "";
    topics.forEach(element => {
        topicsString += capitalizeFirstLetter(element) + ', '
    });
    return topicsString.slice(0, -2);
}