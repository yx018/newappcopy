import './App.css';
import {React, useEffect} from 'react';
import { browserName, browserVersion } from "react-device-detect";
import MyComponent from './MyComponent'
// import Utils from './Utils';

import CreateZone from './test/CreateZone'
import Zones from './test/Zones';
import Zone from './test/Zone';

import { OpenCvProvider, useOpenCv } from 'opencv-react'



function LoadOpenCv() {

  const { loaded, cv } = useOpenCv()
  const cv_status = document.getElementById("status");

  useEffect(() => {
    console.log(loaded, cv);
    console.log(window.cv);
    if (loaded) {
      cv_status.style.display = "none";
    }
  }, [loaded])
  if (loaded)
    return(<MyComponent />)
  else
    return (<p id="status" style={{display: 'block'}, {fontSize: 20}}>OpenCV.js is loading...</p>)
}

const App = () => {

  useEffect(()=>{
    console.log(`${browserName} ${browserVersion}`);
    console.log(typeof(browserName));
    console.log(browserName);
    if (browserName == 'Safari'){
      console.log("yes");
      while(true)
        alert("You use Safari now, please change another browser because Safari not support capture window function");
    }
  })

  const onLoaded = () => {
    console.log('opencv loaded, cv')
  }
    
  return (
    <div> 
    <OpenCvProvider>
      <LoadOpenCv />
      {/* <MyComponent /> */}
      {/* <CreateZone /> */}
      {/* <Zones /> */}
    </OpenCvProvider>
    </div>
  )
}

export default App;
