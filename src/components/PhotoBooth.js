import React, { useRef, useState, useEffect, useLayoutEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import 'context-filter-polyfill/dist/index.js';

import Webcam from "react-webcam";

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import { GetWindowContext } from '../contexts/WindowProvider';

import timer_db from '../database/timers.json';
import filter_db from '../database/filters.json';

const MAX_NUM = 4;

const PhotoBooth = ({ component, setCapturedImages, vw, vh }) => {
    const win = GetWindowContext();

    const pb_container = useRef(null);
    const video_container = useRef(null);
    const capture_container = useRef(null);

    const [timerCount, updateTimerCount] = useState(3);

    const CAPTURE_CONTRAINTS = {
        facingMode: "user",
            audio: false,
            width: { ideal: 1920 },  // Set to Full HD
            height: { ideal: 1080, min: 280 },
            frameRate: { ideal: 30 }, // Keep a good frame rate
            aspectRatio: parseFloat(3/2)
        // video: {
            
        // }
    };
    // const navigate = useNavigate();
    var stream;
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [capturedImages, setImages] = useState([]);
    const [filter, updateFilter] = useState("none");
    const [countdown, setCountdown] = useState(null);
    const [capturing, setCapturing] = useState(false);
    const [pic, addPic] = useState(0);

    const [loaded, setLoaded] = useState(false);

    const [userMediaError, setUserMediaError] = useState(null)

    const [isFlashing, setIsFlashing] = useState(false);

    const [valid, setValid] = useState(false);

    useEffect(() => {
        setValid(true);
        setTimeout(() => setLoaded(true), 1500);
    }, [video_container.current])

    // useLayoutEffect(() => {
    //     document.addEventListener("visibilitychange", onVisibilityChange);

    //     return () => document.removeEventListener("visibilitychange", onVisibilityChange);
    // }, []);

    useEffect(() => {
        window.scrollTo(0, document.getElementById('pb').offsetTop);

        if (stream) stream = null;

        const onVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
            //   console.log("Tab reopened, refetch the data!");
            } else{
                // console.log(stream)
                // stream.getTracks()[0].stop();
            }
        };

        document.addEventListener("visibilitychange", onVisibilityChange);

        // updateContainerHeight()

        // start camera
        // (async() => {
        //     await navigator.mediaDevices.getUserMedia({video: true});   
        //     let devices = await navigator.mediaDevices.enumerateDevices();   
        //     console.log(devices);

        //     try {
        //         if (videoRef.current && videoRef.current.srcObject) {
        //             return; // Prevent restarting the camera if it's already running
        //         }
                
        //         stream = await navigator.mediaDevices.getUserMedia(constraints);
                
        //         if (videoRef.current) {
        //             videoRef.current.srcObject = stream;
        //             videoRef.current.play().catch(err => console.error("Error playing video:", err));
    
        //             // Fix mirroring issue
        //             videoRef.current.style.transform = "scaleX(-1)";
        //             videoRef.current.style.objectFit = "cover"; 
        //         }
        //     } catch (error) {
        //         setWebcam(true)
        //         console.log("here?")
        //         console.error("Error accessing camera:", error);
        //     }
        // })();

        // const web = () => setWebcam(true)
        // startCamera();
    
        // const handleVisibilityChange = () => {
        //     if (!document.hidden) {
        //         startCamera();
        //     }
        // };
    
        // document.addEventListener("visibilitychange", handleVisibilityChange);
        
        return () => {
            document.removeEventListener("visibilitychange", onVisibilityChange);
            // console.log(devices)
            // stop camera
            if(stream) stream.getTracks()[0].stop();
        };
    }, []);

    // Countdown to take 4 pictures automatically
    const startCountdown = () => {
        if (capturing) return;
        setCapturing(true);
    
        let photosTaken = 0;
        const newCapturedImages = [];
    
        const captureSequence = async () => {
            if (photosTaken >= MAX_NUM) {
                setCountdown(null);
                setCapturing(false);

                try {
                    setCapturedImages([...newCapturedImages]);
                    setImages([...newCapturedImages]);

                    // Delay navigation slightly to ensure state update
                    // setTimeout(
                    //     preview
                    //     // () => {
                        
                    //     // navigate("/preview");
                    // , 100);
                } catch (error) {
                    console.error("Error navigating to preview:", error);
                }
                return;
            }

            let timeLeft = timerCount;
            setCountdown(timeLeft);
            setIsFlashing(false);

            const timer = setInterval(() => {
                timeLeft -= 1;
                setCountdown(timeLeft);

                if (timeLeft === 0) {
                    setIsFlashing(true);
                    clearInterval(timer);
                    const imageUrl = capturePhoto(photosTaken);
                    if (imageUrl) {
                        newCapturedImages.push(imageUrl);
                        setImages((prevImages) => [...prevImages, imageUrl]);

                        // console.log(newCapturedImages)
                    }
                    photosTaken += 1;
                    addPic(photosTaken);
                    // console.log(pic)
                    setTimeout(captureSequence, 1000);
                }
            }, 1000);
        };

        captureSequence();
    };

    const checkUserMedia = (event) => setUserMediaError(event instanceof Error);

    // Capture Photo
    const capturePhoto = (x) => {
        const video = videoRef.current.video;
        const canvas = canvasRef.current;

        if (video && canvas) {
            const context = canvas.getContext("2d");
            context.reset();

            // Set fixed dimensions matching our photo strip
            const targetWidth = 1200;
            const targetHeight = 800;

            canvas.width = targetWidth;
            canvas.height = targetHeight;

            const videoRatio = video.videoWidth / video.videoHeight;
            const targetRatio = targetWidth / targetHeight;
            
            let drawWidth = video.videoWidth;
            let drawHeight = video.videoHeight;
            let startX = 0;
            let startY = 0;

            if (videoRatio > targetRatio) {
                drawWidth = drawHeight * targetRatio;
                startX = (video.videoWidth - drawWidth) / 2;
            } else {
                drawHeight = drawWidth / targetRatio;
                startY = (video.videoHeight - drawHeight) / 2;
            }

            // console.log(video)

            // Flip canvas for mirroring
            context.save();
            context.filter = filter !== 'none' ? filter : 'none';
            context.translate(canvas.width, 0);
            context.scale(-1, 1);

            // if (x == 1 || x == 3){context.scale(-1, 1); context.restore();}

            // console.log(context)

            context.drawImage(
                video,
                startX, startY, drawWidth, drawHeight,  
                0, 0, targetWidth, targetHeight        
            );
            
            context.restore()

            // console.log(canvas)
            

            return canvas.toDataURL("image/png");
            // return videoRef.current.getScreenshot();
        }
    };

    return (
        <div id="pb" className={`photobooth`} ref={pb_container}>

            {/* {countdown !== null && <h2 className="countdown animate">{countdown}</h2>} */}

            {/* <div className="camera-container"> */}

            <div
                ref={video_container}
                className={`video-container${!loaded ? ` load` : ``}`}
                // THANK YOU: https://stackoverflow.com/a/77965501

                //  || win.clientHeight < 400
                {...valid && (win.clientWidth >= 844) ?
                    {style:{'height' : `min(calc(100dvh - 160px), ${pb_container.current.offsetWidth * 2/3}px`}}
                :
                    {}
                }

                // {...!loaded && {style:{'width': 'calc(' + video_container.offsetHeight + 'px * (3/2))'}}}
                // {...valid && loaded && {style:{'width': 'fit-content'}}}
                
            >
                {!loaded && valid &&
                    <div className="video-temp" style={
                        win.clientWidth < 844 ?
                            {'width': 'calc(' + video_container.current.offsetHeight + 'px * (3/2))', 'opacity' : 1}
                        :
                            {'width': 'calc((100dvh - ' + capture_container.current.offsetHeight + 'px) * (3/2))', 'opacity' : 1}
                    }>
                        <Skeleton duration={1.5} style={{'height':'100%'}}/>
                    </div>
                }
                <Webcam className="video"
                    audio={false}
                    mirrored={true}
                    ref={videoRef}
                    videoConstraints={CAPTURE_CONTRAINTS}
                    screenshotFormat="image/png"
                    style={{ filter }}
                    onUserMedia={checkUserMedia}
                    onUserMediaError={checkUserMedia}
                    // height={win.clientHeight - 120}
                />

                {/* <video ref={videoRef} autoPlay className="video-feed" style={{ filter }} /> */}
                <canvas ref={canvasRef} className="hidden" />

                {isFlashing &&
                    <div
                        className="flash"
                        onAnimationEnd={() => setIsFlashing(false)}
                    >
                    </div>
                }

                {!capturing && !userMediaError &&
                    <div className="customize" aria-hidden={capturing}>
                        <div className="container">
                            <div className="timer">
                                {win.clientWidth >= 844 && win.clientHeight >= 480 ? <>
                                    <div className="heading">Timer</div>
                                    <ul>
                                        {timer_db.map((option, i) => (
                                            <li key={i}>
                                                <input type='radio' name='timer' value={option.value} id={option.id} defaultChecked={timerCount == option.value} onChange={() => updateTimerCount(option.value)}/>
                                                <label htmlFor={option.id} className='btn-secondary'>{option.label}</label>
                                            </li>
                                        ))}
                                    </ul>
                                </> : <>
                                    <label htmlFor="timer" className="heading">Timer</label>
                                    <select name="timer" id="timer" value={timerCount} onChange={event => updateTimerCount(event.target.value)} required>
                                        {timer_db.map((option, i) => (
                                            <option key={i} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </>}
                            </div>
                        </div>
                        <div className="container">
                            <div className="filter">
                                {win.clientWidth >= 844 && win.clientHeight >= 480 ? <>
                                    <div className="heading">Filter</div>
                                    <ul>
                                        {filter_db.map((option, i) => (
                                            <li key={i}>
                                                <input type='radio' name='filter' id={option.id} defaultChecked={filter == option.value} onChange={() => updateFilter(option.value)}/>
                                                <label htmlFor={option.id} className='btn-secondary'>{option.label}</label>
                                            </li>
                                        ))}
                                    </ul>
                                </> : <>
                                    <label htmlFor="filter" className="heading">Filter</label>
                                    <select name="filter" id="filter" value={filter} onChange={event => updateFilter(event.target.value)} required>
                                        {filter_db.map((option, i) => (
                                            <option key={i} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </>}
                            </div>
                        </div>
                    </div>
                }
            </div>

                {/* <div className="preview-side">
                {capturedImages.map((image, index) => (
                    <img key={index} src={image} alt={`Captured ${index + 1}`} className="side-preview" />
                ))}
                </div> */}
            {/* </div> */}

            
            <div className="capture" ref={capture_container}
                {...win.clientWidth < 844 ?
                    loaded || valid ? 
                        {style:{'height': 'max(calc(100dvh - ' + pb_container.current.offsetWidth + 'px * (2/3)), calc((100dvh - ' + video_container.current.offsetHeight + 'px))', 'width': 'calc(' + video_container.current.offsetHeight + 'px * (3/2))'}}
                    :
                        {style:{'height':'220px'}}
                :
                    valid && {style:{'width': 'min(100%, calc((100vh - ' + capture_container.current.offsetHeight + 'px) * (3/2)))'}}
                }
            > {loaded &&
                <div className="container capture-1">
                    {pic >= 1 && <figure className="pic"><img src={capturedImages[0]} className="size-preview"/></figure>}
                    {pic >= 2 && <figure className="pic"><img src={capturedImages[1]} className="size-preview"/></figure>}
                </div>}
                {valid && <div className="control">
                    <button onClick={startCountdown} disabled={!loaded || userMediaError || capturing} className={`btn-primary btn-icon${capturing ? ` capturing`:``}${userMediaError ? ` usermediaerror` : ``}`}>
                        {userMediaError ? <i class="fa fa-solid fa-ban"></i> :
                            capturing ? countdown : <i className="fa fa-solid fa-camera"></i>
                        }
                    </button>
                </div>}
                {loaded &&<div className="container capture-2">
                    {pic >= 3 && <figure className="pic"><img src={capturedImages[2]} className="size-preview"/></figure>}
                    {pic >= 4 && <figure className="pic"><img src={capturedImages[3]} className="size-preview"/></figure>}
                </div>}
            </div>
            
            {/* <div className="controls">
                <button onClick={startCountdown} disabled={capturing}>
                {capturing ? "Capturing..." : "Start Capture :)"}
                </button>
            </div> */}

            {/* <div className="filters">
                <button onClick={() => setFilter("none")}>No Filter</button>
                <button onClick={() => setFilter("grayscale(100%)")}>Grayscale</button>
                <button onClick={() => setFilter("sepia(100%)")}>Sepia</button>
            </div> */}
        </div>
    );
};

export default PhotoBooth;