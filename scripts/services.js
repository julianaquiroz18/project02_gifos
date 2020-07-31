/**
 * @method apiRequest
 * @description Get Gifos info from API
 * @param {string} URL
 * @returns {promise}
 */
function apiRequest(URL) {
    return new Promise((resolve, reject) => {
        fetch(URL)
            .then(response => { resolve(response.json()) })
            .catch(error => { reject(error) })
    });
}

/**
 * @method autoCompleteRequest
 * @description Get suggestions to seacrh autocomplete 
 * @param {string} URL
 * @returns {promise}
 */
function autoCompleteRequest(URL, queryTerm) {
    const completeURL = `${URL}&q=${queryTerm}`;
    return apiRequest(completeURL);
}

/**
 * @method searchGifosRequest
 * @description Get gifos according term searched
 * @param {string} URL
 * @param {string} queryTerm
 * @param {number} page
 * @returns {promise}
 */
function searchGifosRequest(URL, queryTerm, page) {
    const offset = page * 12;
    const completeURL = `${URL}&q=${queryTerm}&limit=12&offset=${offset}`;
    return apiRequest(completeURL);
}

export {

    apiRequest,
    autoCompleteRequest,
    searchGifosRequest
};