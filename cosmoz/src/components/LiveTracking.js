import React from "react";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet's default icon path issues
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const busIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/346/346188.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
});

const LiveTracking = () => {
    const [busLocation, setBusLocation] = useState({
        lat: 20.5937,
        lng: 78.9629
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getCurrentLocation = () => {
            if (!navigator.geolocation) {
                setError('Geolocation is not supported by your browser');
                setIsLoading(false);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setBusLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                    setIsLoading(false);
                    setError(null);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setError('Unable to retrieve your location. Please enable location services.');
                    setIsLoading(false);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        };

        getCurrentLocation();
        const interval = setInterval(getCurrentLocation, 10000);
        return () => clearInterval(interval);
    }, []);

    if (error) {
        return (
            <div className="h-screen w-full flex items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                Loading location...
            </div>
        );
    }

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <MapContainer
                center={[busLocation.lat, busLocation.lng]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[busLocation.lat, busLocation.lng]} icon={busIcon}>
                    <Popup>Current Bus Location</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default LiveTracking;
