import React, { useState, useEffect } from "react";
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

const PetaDragable = ({ initialPosition, onPositionChange, mapId = 'jualrumah_map', zoom = 14, width = '100%', height = '240px', isDraggable = true }) => {
    const [position, setPosition] = useState(initialPosition);

    useEffect(() => {
        setPosition(initialPosition);
    }, [initialPosition]);

    const handleMarkerDragEnd = (event) => {
        const newPosition = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        };
        setPosition(newPosition);
        if (onPositionChange) {
            onPositionChange(newPosition);
        }
    };

    return (
        <div style={{ width, height, borderRadius: '8px', overflow: 'hidden' }}>
            <APIProvider apiKey="AIzaSyDtRAmlhx3Ada5pVl5ilzeHP67TLxO6pyo">
                <Map
                    mapId={mapId}
                    defaultCenter={position}
                    defaultZoom={zoom}
                    style={{ width: '100%', height: '100%' }}
                >
                    <Marker
                        position={position}
                        draggable={isDraggable} 
                        onDragEnd={handleMarkerDragEnd}
                    />
                </Map>
            </APIProvider>
        </div>
    );
};

export default PetaDragable;