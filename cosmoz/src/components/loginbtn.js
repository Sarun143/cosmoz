import React from "react";
import { useNavigate } from "react-router-dom";

function Loginbtn() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/login'); // Make sure this path matches your route for LoginPage
    };

    return (
        <button onClick={handleClick}>
            Login
        </button>
    );
}

export default Loginbtn;
