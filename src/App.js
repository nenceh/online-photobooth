import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import WindowProvider from './contexts/WindowProvider';

import Page from './pages/Page';

export default function App() {
    return (
        <BrowserRouter basename="/online-photobooth" /*future={{ v7_startTransition: true }}*/>
            <WindowProvider>
                <Routes>
                    {/* <Route path="" element={<Home />} /> */}
                    {/* <Route path="" element={<Welcome />} /> */}
                    <Route path="" element={<Page/>} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </WindowProvider>
        </BrowserRouter>
    );
}