/**
 * @method capitalizeFirstLetter
 * @description 
 * @param {string} string
 * @returns {string} 
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export {

    capitalizeFirstLetter

};