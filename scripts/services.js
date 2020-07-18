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

function searchGifos(URL, queryTerm, limit, offset) {
    const completeURL = `${URL}?q=${queryTerm}&limit=${limit}&offset=${offset}`;
    return apiRequest(completeURL);
}

export {

    apiRequest
};