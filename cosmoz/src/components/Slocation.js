import React, { useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const SendLocation = () => {
    useEffect(() => {
        // Function to get bus location
        const updateBusLocation = () => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const { latitude, longitude } = position.coords;
                    socket.emit("busLocationUpdate", { lat: latitude, lng: longitude });
                });
            } else {
                console.log("Geolocation not supported");
            }
        };

        // Update location every 5 seconds
        const interval = setInterval(updateBusLocation, 5000);
        return () => clearInterval(interval);
    }, []);

    return <h3>Bus Location is being shared...</h3>;
};

export default SendLocation;
