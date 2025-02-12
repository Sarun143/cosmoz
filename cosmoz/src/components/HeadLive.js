import React, { useState } from "react";
import BusLocation from "./BusLocation";

const HeadLive = () => {
    const [showMap, setShowMap] = useState(false);

    return (
        <header style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "#333", color: "#fff" }}>
            <h2>Travel Management</h2>
            <button onClick={() => setShowMap(!showMap)} style={{ padding: "8px 12px", cursor: "pointer" }}>
                {showMap ? "Hide Location" : "Track Bus"}
            </button>
            {showMap && <BusLocation />}
        </header>
    );
};

export default HeadLive;
