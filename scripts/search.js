import { autoCompleteRequest, searchGifosRequest } from './services.js';
import constant from './constants.js';
import { capitalizeFirstLetter } from './helpers.js';
import { makeGifosCards } from './gifos_card_maker.js';
/**
 * Global Variables
 */
const searchBar = document.querySelector(".search-bar");
const searchBarBtn = document.querySelector(".search-bar__button");
const searchClose = document.querySelector(".active-search__close");
const suggestionsBlock = document.querySelector(".active-search__suggestions");
const searchInput = document.querySelector(".search-bar__input");
const autoCompleteURL = constant.BASE_URL + "gifs/search/tags" + constant.API_KEY;
const searchURL = constant.BASE_URL + "gifs/search" + constant.API_KEY;
let allSuggestions;
let isCurrentlySearching = false;

/**
 * Events
 */
searchInput.addEventListener('keyup', searchSuggestions);
searchInput.addEventListener('keypress', searchGifos);
searchClose.addEventListener('click', function() { clean(true) });
searchClose.addEventListener('click', cleanInput);
searchBarBtn.addEventListener('click', searchGifos);

/**
 * @method searchSuggestions
 * @description Method to handle API request acording to input value 
 * and previous request status
 */
function searchSuggestions(e) {
    if (e.keyCode === 13) {
        return;
    }
    if (searchInput.value === "") {
        clean(true);
        isCurrentlySearching = false;
        allSuggestions = "";
        return;
    }
    if (isCurrentlySearching) {
        return;
    }
    isCurrentlySearching = true;
    allSuggestions = "";
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
            clean(false);
            isCurrentlySearching = false;
            return;
        }
        getSuggestions(response.data);
        updateSearchBar();
        isCurrentlySearching = false;
    }).catch((error) => { console.log(error) });
}

/**
 * @method getSuggestions
 * @description Get suggestion info
 * @param array Suggestion list
 */
const getSuggestions = (response => {
    if (response.length) {
        response.forEach(element => {
            suggestionsBlock.innerHTML = allSuggestionsLines(element.name);
        });
        const suggestionList = document.querySelectorAll(".active-search__suggestion");
        suggestionList.forEach((element) => element.addEventListener('click', selectAndSearch));
    } else {
        isCurrentlySearching = false;
    }

})

/**
 * @method allSuggestionsLines
 * @description create Suggestions list
 * @param string 
 * @returns string
 */
const allSuggestionsLines = (suggestion => {
    allSuggestions += suggestionMarkUp(suggestion);
    return allSuggestions;
});

/**
 * @method suggestionMarkUp
 * @description Suggestion marking method
 * @param string 
 * @returns string
 */
const suggestionMarkUp = ((suggestion) => {
    return (
        `<li class="active-search__suggestion"><a class="suggestion-selected"><i class="icon-icon-search"></i>${suggestion}</a></li>`
    );
});

/**
 * @method updateSearchBar
 * @description Update Search bar UI to show suggestions
 */
function updateSearchBar() {
    searchBar.classList.add("active-search");
    searchBarBtn.classList.add("active-search__search");
    searchClose.classList.remove("hidden");
    suggestionsBlock.classList.remove("hidden");

}

/**
 * @method clean
 * @description Update search bar to remove UI when there are not suggestions
 */
function clean(isOriginalState) {
    suggestionsBlock.innerHTML = "";
    searchBar.classList.remove("active-search");
    suggestionsBlock.classList.add("hidden");
    if (isOriginalState === true) {
        searchBarBtn.classList.remove("active-search__search");
        searchBarBtn.classList.remove("hidden");
        searchClose.classList.add("hidden");
    } else {
        searchClose.classList.remove("hidden");
    }
}

/**
 * @method cleanInput
 * @description Clear Input when X is clicked
 */
function cleanInput() {
    searchInput.value = "";
}

/**
 * @method selectAndSearch
 * @description select suggestion and active searching
 */
function selectAndSearch(e) {
    searchInput.value = e.target.innerText;
    clean(false);
    searchBarBtn.classList.add("hidden");
    searchGifos(e);
}


function searchGifos(e) {
    if (e.keyCode === 13 || e.type === "click") {
        clean(false);
        searchBarBtn.classList.add("hidden");
        document.querySelector(".search-results__title").textContent = capitalizeFirstLetter(searchInput.value);
        console.log(searchInput.value);
        requestGifos();
    }
}

function requestGifos() {
    const gifosData = searchGifosRequest(searchURL, searchInput.value, 0);
    gifosData.then((response) => {
        if (response.data.length === 0) {
            const noResults = document.querySelector(".search-without-results");
            noResults.classList.remove("hidden");
            return;
        }
        const htmlNode = document.querySelector(".gifos-wrapper");
        makeGifosCards(response, htmlNode, "search_type");
        console.log(response.data);
    }).catch((error) => { console.log(error) });
}