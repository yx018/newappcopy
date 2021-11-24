import { OpenCvProvider, useOpenCv } from 'opencv-react'
import {React, useCallback, useEffect} from 'react'

function Utils(cv) {

    // const { loaded, cv } = useOpenCv();

    // useEffect(() => {
    //     if (cv) {
    //         console.log('utils useEffect', cv);
    //     }
    // }, [cv])

    console.log('utils:', cv);

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

                } 
                else {
                    self.printError('Failed to load ' + url + ' status: ' + request.status);
                    return;
                }
            }
        };
        request.send();
    };

    const OPENCV_URL = './opencv/opencv.js';
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
                    cv['onRuntimeInitialized']=()=>{
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

export default Utils;