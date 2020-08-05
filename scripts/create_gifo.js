const video = document.querySelector(".create-gifos__wrapper-image");
const startBtn = document.querySelector(".start");
const recordBtn = document.querySelector(".record");
const finishBtn = document.querySelector(".finish");
const uploadBtn = document.querySelector(".upload");
const counter = document.getElementsByClassName("counter");

startBtn.addEventListener("click", getStreamAndRecord);


async function getStreamAndRecord() {
    askCameraPermissionUI();
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                width: 480,
                height: 320
            }
        });
        showVideo(stream);
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
    startBtn.classList.toggle("hidden");
    recordBtn.classList.toggle("hidden");
    counter[0].classList.toggle("counter-process");
};

function showVideo(stream) {
    video.classList.toggle("hidden");
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
    return recorder;
};

function startRecording(recorder) {
    recorder.startRecording();
    recordBtn.classList.toggle("hidden");
    finishBtn.classList.toggle("hidden");
    counter[0].classList.toggle("counter-process");
    counter[1].classList.toggle("counter-process");
};

function stopRecording(recorder) {
    finishBtn.classList.toggle("hidden");
    uploadBtn.classList.toggle("hidden");
    counter[1].classList.toggle("counter-process");
    counter[2].classList.toggle("counter-process");
    recorder.stopRecording(() => prepareGifInfo(recorder));
};

function prepareGifInfo(recorder) {
    const form = new FormData();
    form.append('file', recorder.getBlob(), 'myGif.gif');
    console.log(form.get('file'));
};