import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';

// Import Leaflet CSS - This is crucial!
import 'leaflet/dist/leaflet.css';

// Fix for default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom bus icon
const busIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

const DraggableMarker = ({ position, stopName, time, onDragEnd }) => {
    const markerRef = useRef(null);

    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current;
                if (marker != null) {
                    const newPos = marker.getLatLng();
                    onDragEnd([newPos.lat, newPos.lng]);
                }
            },
        }),
        [onDragEnd],
    );

    // Validate position before rendering
    if (!position || !Array.isArray(position) || position.length !== 2) {
        console.warn(`Invalid position for stop ${stopName}:`, position);
        return null;
    }

    return (
        <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}
            icon={new L.Icon.Default()}
        >
            <Popup>
                <strong>{stopName}</strong><br/>
                {time && `Time: ${time}`}
            </Popup>
        </Marker>
    );
};

function LocationMarker({ setCurrentLocation }) {
    const [position, setPosition] = useState(null);
    const map = useMap();

    useEffect(() => {
        map.locate({ watch: true, enableHighAccuracy: true });
        
        map.on('locationfound', (e) => {
            setPosition(e.latlng);
            setCurrentLocation(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        });

        return () => {
            map.stopLocate();
        };
    }, [map, setCurrentLocation]);

    return position === null ? null : (
        <Marker position={position} icon={busIcon}>
            <Popup>Current Bus Location</Popup>
        </Marker>
    );
}

const LiveTracking = () => {
    const [routes, setRoutes] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const defaultCenter = [10.8505, 76.2711]; // Kerala center

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/routes');
                console.log('Fetched Routes:', response.data);
                setRoutes(response.data);
            } catch (error) {
                console.error('Error fetching routes:', error);
            }
        };
        fetchRoutes();
    }, []);

    const getStopCoordinates = (stopName) => {
        if (!stopName) {
            console.warn('No stop name provided');
            return defaultCenter;
        }
        
        const coordinates = {
            // Kerala stops with precise coordinates
            'Erumely': [9.5168, 76.8358],
            'kanjirapally': [9.5747, 76.7908],
            'ponkunnam': [9.6747, 76.9219],
            'pala': [9.7157, 76.6851],
            'koothattukulam': [9.8641, 76.5735],
            'muvattupuzha': [9.9894, 76.5790],
            'angamaly': [10.1960, 76.3860],
            'paliyekkara': [10.2321, 76.3495],
            
            // Karnataka stops with precise coordinates
            'hosur': [12.7409, 77.8253],
            'christ college': [12.8646, 77.6026],
            'electronic city': [12.8451, 77.6619],
            'madiwala': [12.9220, 77.6171],
            'kalasipalayam': [12.9625, 77.5775],
            'Bangalore': [12.9716, 77.5946],
            'Banglore': [12.9716, 77.5946],

            // Please share your new route stops and I'll add precise coordinates for them
        };

        // Make the lookup case-insensitive
        const stopNameLower = stopName.toLowerCase();
        const coords = coordinates[stopName] || coordinates[stopNameLower];
        
        if (!coords) {
            console.warn(`No coordinates found for stop: ${stopName}`);
            return defaultCenter;
        }
        return coords;
    };

    // Debug selected route
    useEffect(() => {
        if (selectedRoute) {
            console.log('Selected Route Details:', {
                name: selectedRoute.name,
                departure: selectedRoute.departureStop,
                arrival: selectedRoute.arrivalStop,
                stops: selectedRoute.stops
            });
        }
    }, [selectedRoute]);

    return (
        <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px' }}>
                <h2 style={{ marginBottom: '20px' }}>Live Bus Tracking</h2>
                
                <select 
                    onChange={(e) => {
                        const route = routes.find(r => r._id === e.target.value);
                        if (route) {
                            console.log('Selected Route Full Data:', route);
                            setSelectedRoute(route);
                        }
                    }}
                    style={{ 
                        width: '100%',
                        padding: '10px',
                        marginBottom: '20px',
                        borderRadius: '4px',
                        border: '1px solid #ddd'
                    }}
                >
                    <option value="">Select a Route</option>
                    {routes.map(route => (
                        <option key={route._id} value={route._id}>
                            {route.name} ({route.departureStop} to {route.arrivalStop})
                        </option>
                    ))}
                </select>
            </div>

            <div style={{ flex: 1, minHeight: '500px', margin: '0 20px 20px 20px' }}>
                <MapContainer 
                    center={defaultCenter} 
                    zoom={7} 
                    style={{ height: '100%', width: '100%', borderRadius: '8px' }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />

                    <LocationMarker setCurrentLocation={setCurrentLocation} />

                    {selectedRoute && (
                        <>
                            {/* Departure Stop */}
                            <DraggableMarker
                                position={getStopCoordinates(selectedRoute.departureStop)}
                                stopName={selectedRoute.name}
                                time={selectedRoute.departure}
                                onDragEnd={(newPos) => {
                                    console.log('Departure drag ended:', newPos);
                                    // Handle the new position
                                }}
                            />

                            {/* Intermediate Stops */}
                            {selectedRoute.stops && selectedRoute.stops.map((stop, index) => (
                                <DraggableMarker
                                    key={index}
                                    position={getStopCoordinates(stop.stop)}
                                    stopName={selectedRoute.name}
                                    time={stop.arrival}
                                    onDragEnd={(newPos) => {
                                        console.log('Stop drag ended:', newPos);
                                        // Handle the new position
                                    }}
                                />
                            ))}

                            {/* Arrival Stop */}
                            <DraggableMarker
                                position={getStopCoordinates(selectedRoute.arrivalStop)}
                                stopName={selectedRoute.name}
                                time={selectedRoute.arrival}
                                onDragEnd={(newPos) => {
                                    console.log('Arrival drag ended:', newPos);
                                    // Handle the new position
                                }}
                            />

                            {/* Route Line */}
                            <Polyline
                                positions={[
                                    getStopCoordinates(selectedRoute.departureStop),
                                    ...(selectedRoute.stops || []).map(stop => getStopCoordinates(stop.stop)),
                                    getStopCoordinates(selectedRoute.arrivalStop)
                                ]}
                                color="blue"
                                weight={3}
                            />
                        </>
                    )}
                </MapContainer>
            </div>
        </div>
    );
};

export default LiveTracking;
