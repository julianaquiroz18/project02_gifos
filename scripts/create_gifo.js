import constant from './constants.js';
import { apiRequest, uploadGifosRequest } from './services.js';


/**
 * Global Variables
 */
const LOCAL_STORAGE_MYGIFS = "My Gifos";
const video = document.querySelector(".create-gifos__wrapper-image");
const startBtn = document.querySelector(".start");
const recordBtn = document.querySelector(".record");
const finishBtn = document.querySelector(".finish");
const uploadBtn = document.querySelector(".upload");
const counter = document.getElementsByClassName("counter");
const repeatCaptureBtn = document.querySelector(".create-gifos-status__repeat-capture");
const uploadGifoURL = constant.UPLOAD_URL + "gifs" + constant.API_KEY;
const timerHTML = document.querySelector('.create-gifos-status__timming');
let gifoURL;
let gifoData;
let recordingStartDate;
let ticker;


/**
 * Events
 */
startBtn.addEventListener("click", startListener);
uploadBtn.addEventListener("click", uploadGifo);
repeatCaptureBtn.addEventListener("click", recordAgain);
document.querySelector(".card-button__link").addEventListener("click", () => copyURL(gifoURL));
document.querySelector(".card-button__download").addEventListener("click", () => downloadGifo(gifoURL));


/**
 * @method startListener
 * @description Listener function to click event in Start button
 */
function startListener() {
    askCameraPermissionUI();
    getStreamAndRecord();
}

/**
 * @method getStreamAndRecord
 * @description Start video streming
 */
async function getStreamAndRecord() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                width: 480,
                height: 320
            }
        });
        showVideo(stream);
        recordBtn.classList.remove("hidden");
        const recorder = createRecorder(stream);
        recordBtn.addEventListener("click", () => startRecording(recorder));
        finishBtn.addEventListener("click", () => stopRecording(recorder));

    } catch (error) {
        console.log(error);
    }
};


/**
 * @method askCameraPermissionUI
 * @description Change UI to show messages asking camera permission
 */
function askCameraPermissionUI() {
    document.querySelector(".create-gifos__wrapper-title").innerHTML = `¿Nos das acceso<span class="line-break"></span>a tu cámara?`;
    document.querySelector(".create-gifos__wrapper-info").innerHTML = `El acceso a tu camara será válido sólo<span class="line-break"></span>por el tiempo en el que estés creando el GIFO.`;
    startBtn.classList.add("hidden");
    counter[0].classList.toggle("counter-process");
};

/**
 * @method showVideo
 * @description Start camera streaming
 * @param {object} stream
 */
function showVideo(stream) {
    video.classList.remove("hidden");
    video.srcObject = stream;
    video.play();
}

/**
 * @method createRecorder
 * @description Create Recorder Object
 * @param {object} stream
 * @returns {object} recorder
 */
function createRecorder(stream) {
    const recorder = RecordRTC(stream, {
        type: 'gif',
        frameRate: 1,
        quality: 10,
        width: 360,
        hidden: 240,
        onGifRecordingStarted: function() {
            console.log('started');
        },
    });
    recorder.camera = stream;
    return recorder;
};

/**
 * @method startRecording
 * @description Start recording and change UI
 * @param {object} recorder
 */
function startRecording(recorder) {
    timerHTML.classList.remove("hidden");
    setupTicker();
    recorder.startRecording();
    recordBtn.classList.add("hidden");
    finishBtn.classList.remove("hidden");
    counter[0].classList.toggle("counter-process");
    counter[1].classList.toggle("counter-process");
};

/**
 * @method setupTicker
 * @description Start recording timer
 */
function setupTicker() {
    recordingStartDate = new Date().getTime();
    ticker = setInterval(updateRecordedTime, 1000);
}

/**
 * @method updateRecordedTime
 * @description Calculate redording time and show it in UI
 */
function updateRecordedTime() {
    const elapsedTimeInMilliseconds = new Date().getTime() - recordingStartDate;
    const elapsedTime = calculateTimeDuration(elapsedTimeInMilliseconds / 1000);
    timerHTML.textContent = elapsedTime;
}

/**
 * @method stopTicker
 * @description Stop recording timer
 */
function stopTicker() {
    recordingStartDate = null;
    clearInterval(ticker);
}

/**
 * @method stopRecording
 * @description Stop recording and change UI
 * @param {object} recorder
 */
function stopRecording(recorder) {
    stopTicker();
    timerHTML.textContent = calculateTimeDuration(0);
    timerHTML.classList.add("hidden");
    finishBtn.classList.add("hidden");
    uploadBtn.classList.remove("hidden");
    repeatCaptureBtn.classList.remove("hidden");
    recorder.stopRecording(() => prepareGifInfo(recorder));
    document.querySelector(".create-gifos__wrapper-title").innerHTML = `¿Quieres guardar tu Gifo?`;
    document.querySelector(".create-gifos__wrapper-info").innerHTML = "";
    video.srcObject = null;
    recorder.camera.stop();
    recorder = null;
};

/**
 * @method prepareGifInfo
 * @description Include recorder info in form
 * @param {object} recorder
 */
function prepareGifInfo(recorder) {
    const form = new FormData();
    form.append('file', recorder.getBlob(), 'myGif.gif');
    console.log(form.get('file'));
    gifoData = form;
};

/**
 * @method uploadGifo
 * @description Request to upload Gif to Giphy web
 */
function uploadGifo() {
    showUploadingUI()
    document.querySelector(".create-gifos__wrapper-title").innerHTML = "";
    const uploadGifoData = uploadGifosRequest(uploadGifoURL, gifoData);

    uploadGifoData
        .then((response) => {
            const gifoInfo = response.data;
            const gifoID = gifoInfo.id;
            let myGifosIDs = JSON.parse(localStorage.getItem(LOCAL_STORAGE_MYGIFS)) || [];
            myGifosIDs.push(gifoInfo);
            localStorage.setItem(LOCAL_STORAGE_MYGIFS, JSON.stringify(myGifosIDs));
            confirmUploadUI();

            const requestGifoInfoURL = `${constant.BASE_URL}gifs/${gifoID}${constant.API_KEY}`;
            return apiRequest(requestGifoInfoURL);
        }).then(response => {
            gifoURL = response.data.images.original.url;
        })
        .catch((error) => { console.log(error) });
};

/**
 * @method showUploadingUI
 * @description Change UI to show upload status
 */
function showUploadingUI() {
    repeatCaptureBtn.classList.toggle("hidden");
    document.querySelector(".overlay").classList.toggle("hidden");
    counter[1].classList.toggle("counter-process");
    counter[2].classList.toggle("counter-process");
    uploadBtn.classList.add("hidden");
}

/**
 * @method confirmUploadUI
 * @description Change UI to show upload success
 */
function confirmUploadUI() {
    document.querySelectorAll(".uploading").forEach(element => element.classList.toggle("hidden"));
    document.querySelectorAll(".uploaded").forEach(element => element.classList.toggle("hidden"));
}

/**
 * @method recordAgain
 * @description Change UI and re-start recording process
 */
function recordAgain() {
    uploadBtn.classList.add("hidden");
    repeatCaptureBtn.classList.toggle("hidden");
    recordBtn.classList.remove("hidden");
    getStreamAndRecord();
}

/**
 * @method calculateTimeDuration
 * @description Calcule recording timming
 * @param {number} secs
 */
function calculateTimeDuration(secs) {
    let hr = Math.floor(secs / 3600);
    let min = Math.floor((secs - (hr * 3600)) / 60);
    let sec = Math.floor(secs - (hr * 3600) - (min * 60));

    if (min < 10) {
        min = "0" + min;
    }

    if (sec < 10) {
        sec = "0" + sec;
    }

    if (hr <= 0) {
        return min + ':' + sec;
    }

    return hr + ':' + min + ':' + sec;
}

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
 * @method copyURL
 * @description Copy gifo URL
 * @param {string} gifoURL
 */
function copyURL(gifoURL) {
    const aux = document.createElement("input");
    aux.setAttribute("value", gifoURL);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
};