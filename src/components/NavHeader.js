import { useState, useLayoutEffect, useRef, useContext, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { GetWindowContext } from '../contexts/WindowProvider';

export default function Header({home}) {
    // const win = GetWindowContext();
    const refContainer = useRef(null);

    // useLayoutEffect(() => {
    //     if(refContainer.current && win.headerHeight != refContainer.current.offsetHeight){
    //         win.updateHeaderHeight(refContainer.current.offsetHeight);

    //         console.log(win.headerHeight)
    //     }
    // }, [win.clientWidth, refContainer.current]);

    return (<>
        <div className='header-container' ref={refContainer}>
            <nav className={`header`}>
                <NavLink onClick={home} to="/" end>
                    Home
                </NavLink>
            </nav>
        </div>
    </>);
}