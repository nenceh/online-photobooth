import React, { createContext, useContext, useCallback, useEffect, useState, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const WindowContext = createContext();

export function GetWindowContext() {
    return useContext(WindowContext);
}

export default function WindowProvider({ children }){
    const getVh = useCallback(() => {
        return Math.max(
            document.documentElement.clientHeight || 0,
            window.innerHeight || 0
        );
    }, []);

    const getVw = useCallback(() => {
        return Math.max(
            document.documentElement.clientWidth || 0,
            window.innerWidth || 0
        );
    }, []);

    const [clientHeight, setVh] = useState(getVh());
    const [clientWidth, setVw] = useState(getVw());
    const [isLargeDevice, toggleIsLargeDevice] = useState(false);
    const [headerHeight, updateHeaderHeight] = useState(0); // HEADER HEIGHT

    useEffect(() => {
        const handleResize = () => {
            let w = getVw(), h = getVh()
            setVh(h);
            setVw(w);

            if(w > 844) toggleIsLargeDevice(true)
            else toggleIsLargeDevice(false)

        }
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [getVh, getVw]);

    useLayoutEffect(() => {
        setVh(getVh());
        setVw(getVw());

        if (getVw() >= 844) toggleIsLargeDevice(true)
        else toggleIsLargeDevice(false)
    }, [])

    // useLayoutEffect(() => {
    //     //
    // }, isLargeDevice)

    return (
        <WindowContext.Provider value={{ clientHeight, clientWidth, isLargeDevice, headerHeight, updateHeaderHeight }}>
            {children}
        </WindowContext.Provider>
    );
}