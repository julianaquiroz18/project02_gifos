import { capitalizeFirstLetter } from './helpers.js';
const suggestionsBlock = document.querySelector(".active-search__suggestions-list");

/**
 * @method drawSuggestions
 * @description Get suggestion info
 * @param array Suggestion list
 */
function drawSuggestions(suggestions) {
    if (suggestions.length) {
        let htmlSuggestions = ""
        suggestions.forEach(element => {
            htmlSuggestions += suggestionMarkUp(capitalizeFirstLetter(element.name));
            suggestionsBlock.innerHTML = htmlSuggestions;
        });
    }
};

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

export {

    drawSuggestions
};