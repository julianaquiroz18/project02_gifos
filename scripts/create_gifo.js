import constant from './constants.js';
import { uploadGifosRequest } from './services.js';

const LOCAL_STORAGE_MYGIFS = "My Gifos";
const video = document.querySelector(".create-gifos__wrapper-image");
const startBtn = document.querySelector(".start");
const recordBtn = document.querySelector(".record");
const finishBtn = document.querySelector(".finish");
const uploadBtn = document.querySelector(".upload");
const counter = document.getElementsByClassName("counter");
const repeatCaptureBtn = document.querySelector(".create-gifos-status__repeat-capture");
const uploadGifoURL = constant.UPLOAD_URL + "gifs" + constant.API_KEY;
let gifoData;


startBtn.addEventListener("click", startListener);
uploadBtn.addEventListener("click", uploadGifo);
repeatCaptureBtn.addEventListener("click", recordAgain);

function startListener() {
    askCameraPermissionUI();
    getStreamAndRecord();
}

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


function askCameraPermissionUI() {
    document.querySelector(".create-gifos__wrapper-title").innerHTML = `¿Nos das acceso<span class="line-break"></span>a tu cámara?`;
    document.querySelector(".create-gifos__wrapper-info").innerHTML = `El acceso a tu camara será válido sólo<span class="line-break"></span>por el tiempo en el que estés creando el GIFO.`;
    startBtn.classList.add("hidden");
    counter[0].classList.toggle("counter-process");
};

function showVideo(stream) {
    video.classList.remove("hidden");
    video.srcObject = stream;
    video.play();
}

function createRecorder(stream) {
    const recorder = RecordRTC(stream, {
        type: 'gif',
        onGifRecordingStarted: function() {
            console.log('started');
        },
    });
    recorder.camera = stream;
    return recorder;
};

function startRecording(recorder) {
    recorder.startRecording();
    recordBtn.classList.add("hidden");
    finishBtn.classList.remove("hidden");
    counter[0].classList.toggle("counter-process");
    counter[1].classList.toggle("counter-process");
};

function stopRecording(recorder) {
    finishBtn.classList.add("hidden");
    uploadBtn.classList.remove("hidden");
    repeatCaptureBtn.classList.remove("hidden");
    recorder.stopRecording(() => prepareGifInfo(recorder));
    recorder.camera.stop();
    recorder = null;


};

function prepareGifInfo(recorder) {
    const form = new FormData();
    form.append('file', recorder.getBlob(), 'myGif.gif');
    console.log(form.get('file'));
    gifoData = form;
};


function uploadGifo() {
    showUploadingUI()
    const uploadGifoData = uploadGifosRequest(uploadGifoURL, gifoData);
    uploadGifoData.then((response) => {
            const gifoID = response.data;
            let myGifosIDs = JSON.parse(localStorage.getItem(LOCAL_STORAGE_MYGIFS)) || [];
            myGifosIDs.push(gifoID);
            localStorage.setItem(LOCAL_STORAGE_MYGIFS, JSON.stringify(myGifosIDs));
            confirmUploadUI();
        })
        .catch((error) => { console.log(error) });
};

function showUploadingUI() {
    repeatCaptureBtn.classList.toggle("hidden");
    document.querySelector(".overlay").classList.toggle("hidden");
    counter[1].classList.toggle("counter-process");
    counter[2].classList.toggle("counter-process");
    uploadBtn.classList.add("hidden");
}

function confirmUploadUI() {
    document.querySelectorAll(".uploading").forEach(element => element.classList.toggle("hidden"));
    document.querySelectorAll(".uploaded").forEach(element => element.classList.toggle("hidden"));
    newRecordBtn.classList.remove("hidden");
}

function recordAgain() {
    uploadBtn.classList.add("hidden");
    repeatCaptureBtn.classList.toggle("hidden");
    recordBtn.classList.remove("hidden");
    getStreamAndRecord();
}