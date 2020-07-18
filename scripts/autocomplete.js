import { autoComplete } from './services.js';


const searchBar = document.querySelector(".search-bar");
const searchBarBtn = document.querySelector(".search-bar__button");
const searchClose = document.querySelector(".active-search__close");
const suggestionsBlock = document.querySelector(".active-search__suggestions");
const searchInput = document.querySelector(".search-bar__input");
const autoCompleteURL = "https://api.giphy.com/v1/gifs/search/tags?api_key=9Bbx127nke90Ndmr1nuEio9LFbL62OpO";
let allSuggestions;
let isCurrentlySearching = false;

searchInput.addEventListener('keyup', search);
searchClose.addEventListener('click', clean);

function search() {
    if (searchInput.value === "") {
        clean();
        isCurrentlySearching = false;
        allSuggestions = "";
        return;
    }
    if (isCurrentlySearching) {
        console.log("currently searching" + allSuggestions);
        return;
    }
    isCurrentlySearching = true;
    allSuggestions = "";
    requestSuggestions();
}

function requestSuggestions() {
    const autoCompleteData = autoComplete(autoCompleteURL, searchInput.value);
    autoCompleteData.then((response) => {
        if (response.data.length === 0) {
            clean();
            showNoResultMesagge();
            isCurrentlySearching = false;
            return;
        }
        getSuggestions(response.data);
        updateSearchBar();
        isCurrentlySearching = false;
        console.log("ya temine la busqueda" + allSuggestions);
    }).catch((error) => { console.log(error) });
}

function showNoResultMesagge() {
    console.log("no hay resultados");
}

function updateSearchBar() {
    searchBar.classList.add("active-search");
    searchBarBtn.classList.add("active-search__search");
    searchClose.classList.remove("hidden");
    suggestionsBlock.classList.remove("hidden");

}

function clean() {
    suggestionsBlock.innerHTML = "";
    searchBar.classList.remove("active-search");
    searchBarBtn.classList.remove("active-search__search");
    searchClose.classList.add("hidden");
    suggestionsBlock.classList.add("hidden");
}


const getSuggestions = (response => {
    response.forEach(element => {
        suggestionsBlock.innerHTML = allSuggestionsLines(element.name);
    });
})

const allSuggestionsLines = (suggestion => {
    allSuggestions += suggestionMarkUp(suggestion);
    return allSuggestions;
});

const suggestionMarkUp = ((suggestion) => {
    return (
        `<li class="active-search__suggestion"><a class="suggestion-selected"><i class="icon-icon-search"></i>${suggestion}</a></li>`
    );
});