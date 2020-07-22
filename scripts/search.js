import { autoCompleteRequest, searchGifosRequest } from './services.js';
import constant from './constants.js';
import { capitalizeFirstLetter } from './helpers.js';
import { makeGifosCards } from './gifos_card_maker.js';
import { drawSuggestions } from './suggestions_maker.js';
/**
 * Global Variables
 */
const autoCompleteURL = constant.BASE_URL + "gifs/search/tags" + constant.API_KEY;
const searchURL = constant.BASE_URL + "gifs/search" + constant.API_KEY;
const searchBarBtn = document.querySelector(".search-bar__button");
const searchClose = document.querySelector(".active-search__close");
const suggestionsBlock = document.querySelector(".active-search__suggestions-list");
const searchInput = document.querySelector(".search-bar__input");

let isCurrentlySearching = false;

/**
 * Events
 */
searchInput.addEventListener('keyup', listenInputKeyEvent);
searchClose.addEventListener('click', function() { restoreSearchBarUI(true) });
searchClose.addEventListener('click', cleanInput);
searchBarBtn.addEventListener('click', searchGifos);

/**
 * @method listenInputKeyEvent
 * @description Method to handle API request acording to input value 
 * and previous request status
 */
function listenInputKeyEvent(e) {
    if (e.keyCode === 13) {
        searchGifos(e);
        return;
    }
    if (searchInput.value === "") {
        restoreSearchBarUI(true);
        searchBarBtn.classList.remove("hidden");
        isCurrentlySearching = false;
        return;
    }
    if (isCurrentlySearching) {
        return;
    }
    isCurrentlySearching = true;
    requestSuggestions();
}

/**
 * @method requestSuggestions
 * @description Method to request suggestions to API
 * @param string 
 */
function requestSuggestions() {
    const autoCompleteData = autoCompleteRequest(autoCompleteURL, searchInput.value);
    autoCompleteData.then((response) => {
        if (response.data.length === 0) {
            restoreSearchBarUI(false);
            searchBarBtn.classList.remove("hidden");
            isCurrentlySearching = false;
            return;
        }
        drawSuggestions(response.data);
        const suggestionList = document.querySelectorAll(".active-search__suggestion");
        suggestionList.forEach((element) => element.addEventListener('click', selectAndSearch));
        updateSearchBar();
        isCurrentlySearching = false;
    }).catch((error) => { console.log(error) });
}



/**
 * @method updateSearchBar
 * @description Update Search bar UI to show suggestions
 */
function updateSearchBar() {
    suggestionsBlock.classList.remove("hidden");
    searchBarBtn.classList.add("active-search__search");
    searchClose.classList.remove("hidden");
}

/**
 * @method restoreSearchBarUI
 * @description Update search bar to remove UI when there are not suggestions
 */
function restoreSearchBarUI(isOriginalState) {
    suggestionsBlock.innerHTML = "";
    suggestionsBlock.classList.add("hidden");
    if (isOriginalState === true) {
        searchBarBtn.classList.remove("active-search__search");
        searchClose.classList.add("hidden");
    } else {
        searchBarBtn.classList.add("active-search__search");
        searchClose.classList.remove("hidden");
        searchBarBtn.classList.add("hidden");
    }
}

/**
 * @method cleanInput
 * @description Clear Input when X is clicked and update search bar UI
 */
function cleanInput() {
    searchInput.value = "";
    searchBarBtn.classList.remove("hidden");
}





/**
 * @method selectAndSearch
 * @description select suggestion and active searching
 */
function selectAndSearch(e) {
    searchInput.value = e.target.innerText;
    restoreSearchBarUI(false);
    searchGifos(e);
}


function searchGifos(e) {
    restoreSearchBarUI(false);
    document.querySelector(".search-results__title").textContent = capitalizeFirstLetter(searchInput.value);
    document.querySelector(".search-results").classList.remove("hidden");
    console.log(searchInput.value);
    requestGifos();

}

function requestGifos() {
    const gifosData = searchGifosRequest(searchURL, searchInput.value, 0);
    gifosData.then((response) => {
        if (response.data.length === 0) {
            document.querySelector(".search-without-results").classList.remove("hidden");
            return;
        }
        document.querySelector(".search-results__button").classList.remove("hidden");
        const htmlNode = document.querySelector(".gifos-wrapper");
        makeGifosCards(response, htmlNode, "search_type");
        console.log(response.data);

    }).catch((error) => { console.log(error) });
}