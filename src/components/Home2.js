import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <h1>picapica</h1>
            <p>Welcome to Agnes' photobooth! This is your personal photobooth at home.</p>
            
            <img src="/photobooth-strip.png" alt="photobooth strip" className="photobooth-strip"/>
            
            <button onClick={() => navigate("/welcome")}>START</button>
            {/* <footer>
                made by{" "}
                <a
                href="https://agneswei.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ color: "pink", textDecoration: "none" }}>agneswei</a>
            </footer> */}
        </div>
    );
};

export default Home;