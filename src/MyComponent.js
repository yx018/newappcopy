import { OpenCvProvider, useOpenCv } from 'opencv-react'
import {useEffect, useState} from 'react'
import './MyComponent.css';
import Utils from './Utils';
import axios from 'axios';

function MyComponent() {

    const { loaded, cv } = useOpenCv();
    const [videoLoaded, setVideoLoaded] = useState(false);


    useEffect(() => {
        console.log(loaded, cv);
        if (loaded) {
            console.log('component cv loaded');
            if(videoLoaded){
                console.log('video loaded');

                openCvReady();
            }
        }
    }, [loaded, videoLoaded])

    // const [count, setCount] = useState(0);

    const catchZoomWindow = () => {
        navigator.mediaDevices.getDisplayMedia({ video: true, audio: false })
        .then(function(stream) {
            var video = document.getElementById("cam_input");
            var add_button = document.getElementById("add");
            var zoom_window_text = document.getElementById("zoom_window_text");
            var process_window_text = document.getElementById("process_window_text");
            var output = document.getElementById("canvas_output");
            // console.log(video);
            // console.log(stream);
            video.srcObject = stream;
            console.log(stream);
            let settings = stream.getVideoTracks()[0].getSettings();
            console.log(settings);
            add_button.style.display = "none";
            zoom_window_text.style.display = "none";
            process_window_text.style.display = "none";
            // FPS = settings.frameRate;
            output.style.width = video.style.width;
            output.style.height = video.style.height;
            video.play();
        })
        .then(()=> {
            // openCvReady();
            // utils.loadOpenCv(openCvReady);
            setVideoLoaded(true);
            
        })
        .catch((err) =>{
            console.log("An error occurred! " + err);
        });

    }

    function openCvReady() {
        // const { loaded, cv } = useOpenCv();
        
        console.log('opencvReady', cv.Mat, loaded);
        let utils = new Utils(cv);


    
        let FPS = 0.25;
        let video = document.getElementById("cam_input");
        let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
        let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
        let gray = new cv.Mat();
        let cap = new cv.VideoCapture(video);
        let faces = new cv.RectVector();
        let classifier = new cv.CascadeClassifier();
        let minsize = new cv.Size(0, 0);
        let maxsize = new cv.Size(1000, 1000);
        let faceCascadeFile = "haarcascade_frontalface_default.xml";
        let clip_width = video.width/5;
        let clip_height = video.height/5;

        console.log('cvReady classifier', classifier);
        
        console.log('here');

        utils.createFileFromUrl(faceCascadeFile, faceCascadeFile, ()=>{
            classifier.load(faceCascadeFile);
        });

        
        // utils.createFileFromUrl(faceCascadeFile, faceCascadeFile, () => {
        //     console.log('here2');
        //     classifier.load(faceCascadeFile) // in the callback, load the cascade from file
        //     .then(()=>{
        //         console.log('AAA'); 
        //         processVideo();
        //     })
        //     .catch((err)=>{console.log('load classifier:', err)});
            
        // });

    
        // let face_row = -1;
        // let face_col = -1;
    
        // while(true){
        //     let begin = Date.now();
            
        //     cap.read(src);
        //     src.copyTo(dst);
        //     cv.cvtColor(dst, gray, cv.COLOR_RGBA2GRAY, 0);
        //     console.log('process classifier:', classifier);
        //     // console.log(classifier.load);
        //     // console.log(gray);
        //     // console.log(faces);
            

        //     try{
        //         classifier.detectMultiScale(gray, faces, 1.1, 3);

        //     }catch(err){
        //         console.log(err);
        //     }
    
        // }

        function captureImageFromVideo() {
            var canvas = document.createElement('canvas');
            canvas.width = video.width * 0.5;
            canvas.height = video.height * 0.5;
            canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
            // var img = document.createElement('img');
            var base64Canvas = canvas.toDataURL('image/ipeg').split(';base64,')[1];
            return base64Canvas;
            
        }

        async function getFaceFromFaceplusplus() {
            var post_img = captureImageFromVideo();
            let formData = new FormData();
            formData.append('api_key', 'ZK0tSZ-34wMRkeWaCivkN4Ty5MFV4a9j');
            formData.append('api_secret', 'Kqt6dM83UsEoudBS0egUgYPIt_WOFFhQ');
            formData.append('image_base64', post_img);

            let response = await fetch('https://api-cn.faceplusplus.com/facepp/v3/detect', {
                method: 'post',
                mode: 'no-cors',
                body: formData
            });

            // let data = await JSON.parse({"request_id": "1636947607,16ad0124-2bfb-436d-9636-de57d16e23c9","time_used": 519});
            // let tmp_response ='{"request_id": "1636947607,16ad0124-2bfb-436d-9636-de57d16e23c9","time_used": 519}';
            
            let data = response.json();
            return data;
        }

        function processVideo() {
            let begin = Date.now();
            if (video.srcObject!=null){
                cap.read(src);
                src.copyTo(dst);
                cv.cvtColor(dst, gray, cv.COLOR_RGBA2GRAY, 0);
                // console.log('process classifier:', classifier);


                var post_img = captureImageFromVideo();
                let formData = new FormData();
                formData.append('api_key', 'ZK0tSZ-34wMRkeWaCivkN4Ty5MFV4a9j');
                formData.append('api_secret', 'Kqt6dM83UsEoudBS0egUgYPIt_WOFFhQ');
                formData.append('image_base64', post_img);

                // console.log(post_img);

                
                // axios.post('https://api-cn.faceplusplus.com/facepp/v3/detect', {
                //     // headers: {
                //     //     'Access-Control-Allow-Origin': '*',
                //     // },
                //     mode: 'no-cors',
                //     body: formData
                // }).then(function (response) {
                //     console.log(response);
                // })
                // .catch(function (error) {
                // console.log(error);
                // });

                // fetch('https://api-cn.faceplusplus.com/facepp/v3/detect', {
                //     method: 'post',
                //     mode: 'no-cors',
                //     body: formData
                // })
                // // .then(res => res.json())
                // .then(res => {
                //     console.log(typeof(res));
                //     console.log(res);
                //     console.log(res.json());
                // })
                // .catch(function(err) {
                //     console.log('fetch err:', err);
                // });
                

                // let data = getFaceFromFaceplusplus();
                // console.log('data:', data);


                // var http = new XMLHttpRequest();
                // var url = 'https://api-cn.faceplusplus.com/facepp/v3/detect';

                // http.open('POST', url, true);
                // http.setRequestHeader('Access-Control-Allow-Origin','*');

                // http.onload = function() {//Call a function when the state changes.
                //     if(http.readyState == 4 && http.status == 200) {
                //         console.log(http.responseText);
                //     }
                //     else {
                //         console.log('Failed to load ' + url + ' status: ' + http.status);
                //     }
                // }
                // http.send(formData);

                // error Message location
                // classifier.detectMultiScale(gray, faces, 1.1, 3);
    
                try{
                    classifier.detectMultiScale(gray, faces, 1.1, 3);
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


    // const cv = useOpenCv()
    // console.log(cv)

    // const video = document.getElementById("video");
    // let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    // let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
    // let gray = new cv.Mat();
    // let cap = new cv.VideoCapture(video);
    // let faces = new cv.RectVector();
    // let classifier = new cv.CascadeClassifier();

    // let faceCascadeFile = 'haarcascade_frontalface_default.xml'; // path to xml
    // classifier.load(faceCascadeFile);
    // console.log(classifier);

    // function onOpenUtilsReady() {
    //     let utils = new Utils('errorMessage');
    //     utils.loadOpenCv(() => {
    //     let faceCascadeFile = 'haarcascade_frontalface_default.xml';
    //         utils.createFileFromUrl(faceCascadeFile, faceCascadeFile, () => {
    //             document.getElementById('status').innerHTML = 'OpenCV.js is ready.';
    //         });
    //     });
    // }

    return (
        <>
        <div className="container">
            <h2 id="title">iExam</h2>
            <h6 id="tip">Please click add button to import the Zoom stream. Then you can scroll down to the iExam window.</h6>
            <p id="zoom_window_text">Zoom window</p>
            <video id="cam_input" width="1200" height="690" autoPlay muted></video>
            {/* <img id="add" src="add.svg" alt="upload video window" width="128" height="128" /> */}
            <svg xmlns="http://www.w3.org/2000/svg" id="add" onClick={catchZoomWindow} width="120" height="120" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
            <p id="process_window_text">iExam window</p>
            <canvas id="canvas_output" width="1200" height="690">This box is for capturing student face</canvas>
        </div>
        <div className="footer">
            <p>Details for iExam please refer to slides: <a href="https://daoyuan14.github.io/slides/Expo21_iExam.pdf" target="_blank">https://daoyuan14.github.io/slides/Expo21_iExam.pdf</a></p>
            <p>Post-exam recording analysis for desktop version, please view: <a href="https://github.com/VPRLab/iExam/tree/test" target="_blank">https://github.com/VPRLab/iExam/tree/test </a></p>
            {/* <p id="author">Author: YANG Xu, Supervisor: WU Daoyuan (VPRLab)</p>
            <p>Last Modified: Mon Oct 25 2021 23:12:29 GMT+0800 (Hong Kong Standard Time)</p> */}
        </div>
        </>
        
    )
}

// function Utils() {
//     let self = this;
//     this.createFileFromUrl = function(path, url, callback) {
//         console.log(cv);
//         let request = new XMLHttpRequest();
//         request.open('GET', url, true);
//         request.responseType = 'arraybuffer';
//         request.onload = function(ev) {
//             if (request.readyState === 4) {
//                 if (request.status === 200) {
//                     let data = new Uint8Array(request.response);
//                     cv.FS_createDataFile('/', path, data, true, false, false);
//                     callback();
//                 } else {
//                     self.printError('Failed to load ' + url + ' status: ' + request.status);
//                 }
//             }
//         };
//         request.send();
        
//     };

//     const OPENCV_URL = './opencv/opencv.js';
//     this.loadOpenCv = function(onloadCallback) {
//         let script = document.createElement('script');
//         script.setAttribute('async', '');
//         script.setAttribute('type', 'text/javascript');
//         script.addEventListener('load', async () => {
//             if (cv.getBuildInformation)
//             {
//                 console.log(cv.getBuildInformation());
//                 onloadCallback();
//             }
//             else
//             {
//                 // WASM
//                 if (cv instanceof Promise) {
//                     cv = await cv;
//                     console.log(cv.getBuildInformation());
//                     onloadCallback();
//                 } else {
//                     cv['onRuntimeInitialized']=()=>{  //satisfy this condition
//                         console.log(cv.getBuildInformation()); 
//                         onloadCallback();
//                     }
//                 }
//             }
//         });
//         script.addEventListener('error', () => {
//             self.printError('Failed to load ' + OPENCV_URL);
//         });
//         script.src = OPENCV_URL;
//         let node = document.getElementsByTagName('script')[0];
//         node.parentNode.insertBefore(script, node);
//     };
// }



export default MyComponent;


