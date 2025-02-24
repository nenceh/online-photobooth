import React from "react";
import { useNavigate } from "react-router-dom";

const Home = ({start}) => {
    // const navigate = useNavigate();

    return (
        <div className="welcome-container">
        <h1>Welcome!</h1>
        <p>
            You have <strong>3 seconds</strong> for each shot – no retakes! <br />
            This photobooth captures <strong>4 pictures</strong> in a row, so strike your best pose and have fun!
        </p>
        <p>
            After the session, <span style={{ color: "pink" }}>download your digital copy</span> and share the fun!
        </p>
        <button onClick={start}>START</button>
        </div>
    );
};

export default Home;