import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

const customIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
    iconSize: [32, 32],
});

const BusLocation = () => {
    const [busLocation, setBusLocation] = useState(null);

    // Function to fetch live bus location from the backend
    const fetchBusLocation = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/bus/location");
            setBusLocation(response.data);
        } catch (error) {
            console.error("Error fetching bus location:", error);
        }
    };

    useEffect(() => {
        fetchBusLocation();
        const interval = setInterval(fetchBusLocation, 5000); // Fetch location every 5 sec
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ height: "500px", width: "100%" }}>
            <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="© OpenStreetMap contributors"
                />
                {busLocation && (
                    <Marker position={[busLocation.latitude, busLocation.longitude]} icon={customIcon}>
                        <Popup>Bus is here!</Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
};

export default BusLocation;
