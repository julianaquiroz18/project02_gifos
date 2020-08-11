import constant from './constants.js';
import { apiRequest } from './services.js';

/**
 * Global Variables
 */
const LOCAL_STORAGE_MYGIFS = "My Gifos";
const downloadMyGifosBaseURL = constant.BASE_URL + "gifs";
const htmlNode = document.querySelector(".gifos-wrapper");
const seeMoreBtn = document.querySelector(".links-content__button");
let startingPage = 0;
let currentPage = 1;

/**
 * Events
 */
document.querySelector(".my-gifos__fullsize-exit").addEventListener('click', refreshMyGifs);
seeMoreBtn.addEventListener('click', seeMore);

/**
 * @method seeMore
 * @description Draw more gifos (12 per time)
 */
function seeMore() {
    startingPage++;
    currentPage++;
    drawMyGifs(window.myGifosInfo);
}

/**
 * @method getGifosIds
 * @description Get gifos IDs dfrom local storage
 * @returns {string} stringIds
 */
function getGifosIds() {
    let stringIds = [];
    const uploadedGifos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_MYGIFS)) || [];
    console.log(uploadedGifos);
    uploadedGifos.forEach(gifo => {
        stringIds.push(gifo.id);
    });
    stringIds = stringIds.join();
    console.log(stringIds);
    return stringIds;
}

/**
 * @method downloadMyGifos
 * @description Download Gifo Data from Giphy
 */
function downloadMyGifos() {
    const gifosIds = getGifosIds();
    const completeURL = `${downloadMyGifosBaseURL}${constant.API_KEY}&ids=${gifosIds}`;
    console.log(completeURL);
    const downloadMyGifos = apiRequest(completeURL);
    downloadMyGifos.then(gifosData => {
            window.myGifosInfo = gifosData.data;
            drawMyGifs(gifosData.data);
            if (currentPage > 1) {
                startingPage = currentPage - 1
            };
        })
        .catch((error) => { console.log(error) });
};

/**
 * @method drawMyGifs
 * @description Show gifos uploaded by user
 * @param {object} gifosData
 */
function drawMyGifs(gifosData) {
    const initialIndex = startingPage * 12;
    const finalIndex = currentPage * 12;
    const gifosDataSlice = gifosData.slice(initialIndex, finalIndex);

    if (gifosData.length === 0) {
        document.querySelector(".no-content").classList.remove("hidden");
        seeMoreBtn.classList.add("hidden");
        return;
    }
    if (startingPage === 0) {
        htmlNode.innerHTML = "";
    };
    document.querySelector(".no-content").classList.add("hidden");
    makeMyGifosCards(gifosDataSlice, htmlNode, startingPage);
    const deleteBtnNodes = Array.from(htmlNode.querySelectorAll(".delete"));
    deleteBtnNodes.forEach(node => node.addEventListener('click', refreshMyGifs));

    if (gifosData.slice(finalIndex, finalIndex + 12).length === 0) {
        seeMoreBtn.classList.add("hidden");
    };
};

/**
 * @method refreshMyGifs
 * @description Remove gifos deleted by user
 */
function refreshMyGifs() {
    htmlNode.innerHTML = "";
    startingPage = 0;
    downloadMyGifos();
};

/**
 * @method makeMyGifosCards
 * @description Get gifos data and create cards
 * @param {array} gifosInfo
 * @param {object} htmlNode
 * @param {number} page
 */
function makeMyGifosCards(gifosInfo, htmlNode, page = 0) {
    const gifosHTML = gifosInfo.map((gifo, index) => {
        const gifoURL = gifo.images.original.url;
        const gifoUser = gifo.username;
        const gifoTitle = gifo.title;
        return cardMarkup(gifoURL, gifoUser, gifoTitle, index + (page * 12));
    });
    htmlNode.innerHTML += gifosHTML.join("\n");
    htmlNode.querySelectorAll('.my-gifos__card-button').forEach((button) => button.addEventListener('click', cardButtonAction));
    htmlNode.querySelectorAll('.my-gifos__gifos-container-card__img').forEach((image) => image.addEventListener('click', cardButtonAction));
};

/**
 * @method cardMarkup
 * @description Card marking method
 * @param {string} url
 * @param {string} user
 * @param {string} title
 * @param {number} index
 * @returns {string}
 */
const cardMarkup = ((url, user, title, index) => {
    return (
        `<div class="gifos-container-card">
        <img class="my-gifos__gifos-container-card__img" src="${url}" alt="Gifo" data-typeMyGifos="maximize" data-indexMyGifos="${index}">
        <div class="overlay">
            <div class="gifos-container-card__buttons">
                <button class="my-gifos__card-button delete" data-typeMyGifos="delete" data-indexMyGifos="${index}" type="button"><i class="icon-icon_trash"></i></i></button>
                <button class="my-gifos__card-button" data-typeMyGifos="download" data-indexMyGifos="${index}" type="button"><i class="icon-icon-download"></i></button>
                <button class="my-gifos__card-button maximize" data-typeMyGifos="maximize" data-indexMyGifos="${index}" type="button"><i class="icon-icon-max"></i></button>
            </div>
            <div class="gifos-container-card__info">
                <p class="my-gifos__card__user">${user}</p>
                <p class="my-gifos__card__title">${title}</p>
            </div>
        </div>
    </div>`
    );
});


/**
 * @method cardButtonAction
 * @description select function to be executed accordint to button type
 * @param {object} e event information 
 */
function cardButtonAction(e) {
    const gifoIndex = e.currentTarget.getAttribute('data-indexMyGifos');
    const gifoInfo = getGifoInformation(gifoIndex);
    const deleteFrom = e.currentTarget.getAttribute('data-delete');
    switch (e.currentTarget.getAttribute('data-typeMyGifos')) {
        case "delete":
            removeFGifo(gifoInfo[3]);
            if (deleteFrom === "full-screen") {
                refreshMyGifs();
                toggleModal();
            };
            break;
        case "download":
            downloadGifo(gifoInfo[0]);
            break;
        case "maximize":
            maximizeGifo(gifoInfo);
            maximizeButtonsConf(gifoIndex);
            break;
        default:
            break;
    };
};

/**
 * @method getGifoInformation
 * @description Get Gifo information
 * @param {number} gifoIndex
 * @returns {array}
 */
function getGifoInformation(gifoIndex) {
    let gifoURL = window.myGifosInfo[gifoIndex].images.original.url;
    let gifoUser = window.myGifosInfo[gifoIndex].username;
    let gifoTitle = window.myGifosInfo[gifoIndex].title;
    let gifoID = window.myGifosInfo[gifoIndex].id;
    return [gifoURL, gifoUser, gifoTitle, gifoID];
};

/**
 * @method removeGifo
 * @description Remove ID from array in localStorage
 * @param {number} gifoID
 */
function removeFGifo(gifoID) {
    let myGifs = JSON.parse(localStorage.getItem(LOCAL_STORAGE_MYGIFS)) || [];
    let gifIndexInLocalStorage;
    myGifs.forEach((gifoInfo, index) => {
        if (gifoInfo.id === gifoID) {
            gifIndexInLocalStorage = index;
        };
    });
    myGifs.splice(gifIndexInLocalStorage, 1);
    localStorage.setItem(LOCAL_STORAGE_MYGIFS, JSON.stringify(myGifs));
};

/**
 * @method downloadGifo
 * @description Download Gifo
 * @param {string} gifoURL
 */
async function downloadGifo(gifoURL) {
    let fetchResponse = await fetch(gifoURL);
    let blobObject = await fetchResponse.blob();
    let imgURL = URL.createObjectURL(blobObject);
    const saveGif = document.createElement("a");
    saveGif.href = imgURL;
    saveGif.download = `myGif.gif`;
    document.body.appendChild(saveGif);
    saveGif.click();
    document.body.removeChild(saveGif);
};


/**
 * @method maximizeGifo
 * @description maximize Gifo
 * @param {array} gifoInfo
 */
function maximizeGifo(gifoInfo) {
    document.querySelector(".my-gifos__fullsize-gifo").src = gifoInfo[0];
    document.querySelector(".my-gifos__fullsize-user").textContent = gifoInfo[1];
    document.querySelector(".my-gifos__fullsize-title").textContent = gifoInfo[2];
    toggleModal();
};

function toggleModal() {
    document.querySelector(".my-gifs__modal").classList.toggle("hidden");
};

/**
 * @method maximizeButtonsConf
 * @description including data information and event listener to modal buttons
 * @param {number} gifoIndex
 */
function maximizeButtonsConf(gifoIndex) {
    document.querySelector(".my-gifos__fullsize-exit").addEventListener('click', toggleModal);
    const fullsizeButtons = document.querySelectorAll(".my-gifs__fullsize-button");
    fullsizeButtons.forEach(button => {
        button.setAttribute("data-indexMyGifos", gifoIndex);
        button.addEventListener('click', cardButtonAction);
    });
};

downloadMyGifos();