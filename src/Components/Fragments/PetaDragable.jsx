import React, { useState, useEffect, useRef } from "react";
import { APIProvider, Map, Marker, useMap } from "@vis.gl/react-google-maps";

const InnerMap = ({ position, onPositionChange, zoom, isDraggable }) => {
    const map = useMap();
    const markerRef = useRef(null);

    useEffect(() => {
        if (map && position) {
            map.panTo(position);
        }
    }, [map, position]);

    const handleMarkerDragEnd = (event) => {
        const newPosition = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
        };
        if (onPositionChange) onPositionChange(newPosition);
    };

    return (
        <>
            <Marker
                position={position}
                draggable={isDraggable}
                onDragEnd={handleMarkerDragEnd}
            />
        </>
    );
};

const PetaDragable = ({
    initialPosition,
    onPositionChange,
    mapId = "jualrumah_map",
    zoom = 14,
    width = "100%",
    height = "240px",
    isDraggable = true,
}) => {
    const [position, setPosition] = useState(initialPosition);

    useEffect(() => {
        setPosition(initialPosition);
    }, [initialPosition]);

    return (
        <div style={{ width, height, borderRadius: "8px", overflow: "hidden" }}>
            <APIProvider apiKey="AIzaSyDtRAmlhx3Ada5pVl5ilzeHP67TLxO6pyo">
                <Map
                    mapId={mapId}
                    defaultCenter={position} 
                    defaultZoom={zoom}
                    style={{ width: "100%", height: "100%" }}
                >
                    <InnerMap
                        position={position}
                        onPositionChange={(pos) => {
                            setPosition(pos);
                            if (onPositionChange) onPositionChange(pos);
                        }}
                        zoom={zoom}
                        isDraggable={isDraggable}
                    />
                </Map>
            </APIProvider>
        </div>
    );
};

export default PetaDragable;
