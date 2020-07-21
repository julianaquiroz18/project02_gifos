import { apiRequest } from './services.js';
import constant from './utils.js';
/**
 * Global Variables
 */
const trendingList = document.querySelector(".trending-topics__list");
const trendingTopicsURL = constant.BASE_URL + "trending/searches" + constant.API_KEY;

//const trendingTopicsURL = "https://api.giphy.com/v1/trending/searches?api_key=9Bbx127nke90Ndmr1nuEio9LFbL62OpO"


const trendingTopics = apiRequest(trendingTopicsURL);
trendingTopics.then((response) => {
    const trendingTopicsArray = response.data;
    trendingList.textContent = topicsString(trendingTopicsArray.slice(0, 5));
}).catch((error) => { console.log(error) });

/**
 * @method topicsString
 * @description Convert trending topics array to string
 * @param {array} pokemons
 * @returns {}
 */
const topicsString = (topics) => {
    let topicsString = "";
    topics.forEach(element => {
        topicsString += capitalizeFirstLetter(element) + ', '
    });
    return topicsString.slice(0, -2);
}

/**
 * @method capitalizeFirstLetter
 * @description 
 * @param string
 * @returns string
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}