/**
 * @method apiRequest
 * @description Get Gifos info from API
 * @param string URL
 * @returns promise
 */
function apiRequest(URL) {
    return new Promise((resolve, reject) => {
        fetch(URL)
            .then(response => { resolve(response.json()) })
            .catch(error => { reject(error) })
    });
}

function autoCompleteRequest(URL, queryTerm) {
    const completeURL = `${URL}&q=${queryTerm}`;
    return apiRequest(completeURL);
}


function searchGifosRequest(URL, queryTerm, offset) {
    const completeURL = `${URL}&q=${queryTerm}&limit=12&offset=${offset}`;
    return apiRequest(completeURL);
}

export {

    apiRequest,
    autoCompleteRequest,
    searchGifosRequest
};