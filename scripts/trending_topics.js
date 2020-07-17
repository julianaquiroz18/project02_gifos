/**
 * Global Variables
 */

const trendingList = document.querySelector(".trending-topics__list");
const trendingTopicsURL = "https://api.giphy.com/v1/trending/searches?api_key=9Bbx127nke90Ndmr1nuEio9LFbL62OpO"

/**
 * @method getTrendingTopics
 * @description Get trending topics from API
 * @param URL
 * @returns promise
 */
async function getTrendingTopics(URL) {
    const response = await fetch(URL);
    if (response.ok) {
        const json = await response.json();
        return (json);
    } else {
        throw new Error("Hay un error");
    }
}

const trendingTopics = getTrendingTopics(trendingTopicsURL);
trendingTopics.then((response) => {
    const trendingTopicsArray = response.data;
    trendingList.textContent = topicsString(trendingTopicsArray.slice(0, 5));
});

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