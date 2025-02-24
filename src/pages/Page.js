import React, { useState, useEffect } from "react";

import { GetWindowContext } from '../contexts/WindowProvider';
import NavHeader, {getHeight} from '../components/NavHeader';
// import Footer from '../components/Footer';

// import Home from "./components/Home2";
import Home from "../components/Home";
import PhotoBooth from "../components/PhotoBooth";
import PhotoPreview from "../components/PhotoPreview";

export default function PageLayout({ children }){
    const win = GetWindowContext();
    // console.log(win.clientHeight, win.clientWidth)

    const [capturedImages, setCapturedImages] = useState([]);
    const [component, setComponent] = useState(null);

    function start() {
        setComponent(<PhotoBooth
            component={component}
            setCapturedImages={setCapturedImages}
            vw={win.clientWidth}
            vh={win.clientHeight}
        />)
    }

    function home(){setComponent(<Home start={start}/>)}

    useEffect(() => {
        home()
    }, [])

    useEffect(() => {
        if(capturedImages.length > 0) setTimeout(setComponent(<PhotoPreview start={start} capturedImages={capturedImages} />), 500)
    }, [capturedImages])

    return(<>
        <NavHeader home={home}/>
        <main>
            { component }
        </main>
        {/* <Footer /> */}
    </>);
}