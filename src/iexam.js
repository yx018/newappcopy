
var add_button = document.getElementById("add");
var zoom_window_text = document.getElementById("zoom_window_text");
var process_window_text = document.getElementById("process_window_text");
var video = document.getElementById("cam_input");
var output = document.getElementById("canvas_output");
var container = document.getElementById("container");

console.log('iexam:', window.cv);
let utils = new Utils();


// add.addEventListener("click", function(e) {
//     navigator.mediaDevices.getDisplayMedia({ video: true, audio: false })
//     .then(function(stream) {
//         video.srcObject = stream;
//         let settings = stream.getVideoTracks()[0].getSettings();
//         console.log(settings);
//         add_button.style.display = "none";
//         zoom_window_text.style.display = "none";
//         process_window_text.style.display = "none";
//         // FPS = settings.frameRate;
//         output.style.width = video.style.width;
//         output.style.height = video.style.height;
//         video.play();
//     })
//     .then(()=> {
//         utils.loadOpenCv(openCvReady);
//     })
//     .catch(function(err) {
//         console.log("An error occurred! " + err);
//     });
// })

function openCvReady() {
    // console.log(cv);
    let FPS = 30;
    let video = document.getElementById("cam_input");
    let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
    let gray = new cv.Mat();
    let cap = new cv.VideoCapture(cam_input);
    let faces = new cv.RectVector();
    let classifier = new cv.CascadeClassifier();
    let minsize = new cv.Size(0, 0);
    let maxsize = new cv.Size(1000, 1000);
    let faceCascadeFile = 'haarcascade_frontalface_default.xml';
    utils.createFileFromUrl(faceCascadeFile, faceCascadeFile, () => {
        classifier.load(faceCascadeFile); // in the callback, load the cascade from file 
    });
    let face_row = -1;
    let face_col = -1;
    let clip_width = video.width/5;
    let clip_height = video.height/5;
    function processVideo() {
        let begin = Date.now();
        if (video.srcObject!=null){
            cap.read(src);
            src.copyTo(dst);
            cv.cvtColor(dst, gray, cv.COLOR_RGBA2GRAY, 0);
            try{
                classifier.detectMultiScale(gray, faces, 1.1, 3);
                console.log("face size: "+ faces.size());
            }catch(err){
                console.log(err);
            }
            for (let i = 0; i < faces.size(); ++i) {
                let face = faces.get(i);
                // console.log(face);
                let face_row = parseInt(face.y/clip_height);
                let face_col = parseInt(face.x/clip_width);

                let tmp_row = parseInt((face.y+face.height-5) / clip_height);
                let tmp_col = parseInt((face.x+face.width-5) / clip_width);
                // console.log([face_row, face_col, tmp_row, tmp_col]);
                if (face.width>=clip_width || face.height>=clip_height || tmp_row!=face_row || tmp_col!=face_col)
                    continue;

                let point1 = new cv.Point(face.x, face.y);
                let point2 = new cv.Point(face.x + face.width, face.y + face.height);
                cv.rectangle(dst, point1, point2, [255, 0, 0, 255]);
            }
            cv.imshow("canvas_output", dst);
        }
        // schedule next one.
        let delay = 1000/FPS - (Date.now() - begin);
        setTimeout(processVideo, delay);
    }
    // schedule first one.
    setTimeout(processVideo, 0); 
}

function Utils() {
    let self = this;
    this.createFileFromUrl = function(path, url, callback) {
        let request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        request.onload = function(ev) {
            if (request.readyState === 4) {
                if (request.status === 200) {
                    let data = new Uint8Array(request.response);
                    cv.FS_createDataFile('/', path, data, true, false, false);
                    callback();
                } else {
                    self.printError('Failed to load ' + url + ' status: ' + request.status);
                }
            }
        };
        request.send();
        
    };

    const OPENCV_URL = 'opencv.js';
    this.loadOpenCv = function(onloadCallback) {
        let script = document.createElement('script');
        script.setAttribute('async', '');
        script.setAttribute('type', 'text/javascript');
        script.addEventListener('load', async () => {
            if (cv.getBuildInformation)
            {
                console.log(cv.getBuildInformation());
                onloadCallback();
            }
            else
            {
                // WASM
                if (cv instanceof Promise) {
                    cv = await cv;
                    console.log(cv.getBuildInformation());
                    onloadCallback();
                } else {
                    cv['onRuntimeInitialized']=()=>{  //satisfy this condition
                        console.log(cv.getBuildInformation()); 
                        onloadCallback();
                    }
                }
            }
        });
        script.addEventListener('error', () => {
            self.printError('Failed to load ' + OPENCV_URL);
        });
        script.src = OPENCV_URL;
        let node = document.getElementsByTagName('script')[0];
        node.parentNode.insertBefore(script, node);
    };
}