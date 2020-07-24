import constant from './constants.js';
import { autoCompleteRequest, searchGifosRequest } from './services.js';
import { capitalizeFirstLetter } from './helpers.js';
import { makeGifosCards } from './gifos_card_maker.js';
import { displaySuggestions } from './suggestions_maker.js';

/**
 * Global Variables
 */
const autoCompleteURL = constant.BASE_URL + "gifs/search/tags" + constant.API_KEY;
const searchURL = constant.BASE_URL + "gifs/search" + constant.API_KEY;
const searchBarBtn = document.querySelector(".search-bar__button");
const searchClose = document.querySelector(".active-search__close");
const suggestionsBlock = document.querySelector(".active-search__suggestions-list");
const searchInput = document.querySelector(".search-bar__input");
const searchBarState = {
    INITIAL: "initial",
    WITH_SUGGESTIONS: "with_suggestions",
    WITHOUT_SUGGESTIONS: "without_suggestions",
    AFTER_SEARCH: "after_search",
}
let isCurrentlySearching = false;

/**
 * Events
 */
searchInput.addEventListener('keyup', listenInputKeyEvent);
searchClose.addEventListener('click', listenCloseEvent);
searchBarBtn.addEventListener('click', listenSearchClick);

/**
 * @method listenInputKeyEvent
 * @description Method to handle API request acording to input value 
 * and previous request status
 */
function listenInputKeyEvent(e) {
    const isEnterKey = e.keyCode === 13;
    if (isEnterKey === true) {
        updateSearchBarState(searchBarState.AFTER_SEARCH);
        searchGifos();
        return;
    }
    if (searchInput.value === "") {
        updateSearchBarState(searchBarState.INITIAL);
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
            updateSearchBarState(searchBarState.WITHOUT_SUGGESTIONS);
            isCurrentlySearching = false;
            return;
        }
        displaySuggestions(response.data);
        const suggestionList = document.querySelectorAll(".active-search__suggestion");
        suggestionList.forEach((element) => element.addEventListener('click', listenSelectedSuggestion));
        updateSearchBarState(searchBarState.WITH_SUGGESTIONS);
        isCurrentlySearching = false;
    }).catch((error) => { console.log(error) });
}

/**
 * @method listenSelectedSuggestion
 * @description This function is called when any suggestion is clicked
 */
function listenSelectedSuggestion(e) {
    searchInput.value = e.target.innerText;
    updateSearchBarState(searchBarState.AFTER_SEARCH);
    searchGifos();
}

/**
 * @method listenCloseEvent
 * @description This function is called when X is clicked
 */
function listenCloseEvent() {
    updateSearchBarState(searchBarState.INITIAL)
}

/**
 * @method listenSearchClick
 * @description This function is called when "magnifying glass" is clicked
 */
function listenSearchClick() {
    updateSearchBarState(searchBarState.AFTER_SEARCH);
    searchGifos();
}

/**
 * @method updateSearchBarState
 * @description Update search bar UI according events
 */
function updateSearchBarState(state) {

    switch (state) {
        case searchBarState.INITIAL:
            searchInput.value = "";
            suggestionsBlock.innerHTML = "";
            suggestionsBlock.classList.add("hidden");
            searchClose.classList.add("hidden");
            searchBarBtn.classList.remove("active-search__search");
            searchBarBtn.classList.remove("hidden");
            break;
        case searchBarState.WITH_SUGGESTIONS:
            suggestionsBlock.classList.remove("hidden");
            searchBarBtn.classList.add("active-search__search");
            searchClose.classList.remove("hidden");
            break;
        case searchBarState.WITHOUT_SUGGESTIONS:
            suggestionsBlock.innerHTML = "";
            suggestionsBlock.classList.add("hidden");
            searchClose.classList.remove("hidden");
            searchBarBtn.classList.remove("hidden");
            searchBarBtn.classList.add("active-search__search");
            break;
        case searchBarState.AFTER_SEARCH:
            suggestionsBlock.innerHTML = "";
            suggestionsBlock.classList.add("hidden");
            searchBarBtn.classList.add("active-search__search");
            searchClose.classList.remove("hidden");
            searchBarBtn.classList.add("hidden");
            break;
        default:
            break;
    }
}


/**
 * @method searchGifos
 * @description This function request UI update and API information to show the GIFOS 
 */
function searchGifos() {
    displayGifosSection()
    requestGifos();
}

/**
 * @method displayGifosSection
 * @description This function update GIFOS UI 
 */
function displayGifosSection() {
    document.querySelector(".search-results__title").textContent = capitalizeFirstLetter(searchInput.value);
    document.querySelector(".search-results").classList.remove("hidden");
    document.querySelector(".search-without-results").classList.add("hidden");
    document.querySelector(".search-results__button").classList.add("hidden");
}

/**
 * @method displayGifosSection
 * @description This function request GIFOS information to API
 */
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

    }).catch((error) => { console.log(error) });
}