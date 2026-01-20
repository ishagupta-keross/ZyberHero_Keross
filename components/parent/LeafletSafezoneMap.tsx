'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LeafletSafezoneMapProps {
    center: [number, number];
    radius: number;
    onMapClick: (lat: number, lng: number) => void;
}

// Helper component to handle map clicks and flyTo
function MapController({
    center,
    onMapClick
}: {
    center: [number, number],
    onMapClick: (lat: number, lng: number) => void
}) {
    const map = useMap();

    useEffect(() => {
        map.flyTo(center, map.getZoom());
    }, [center, map]);

    useMapEvents({
        click(e) {
            onMapClick(e.latlng.lat, e.latlng.lng);
        },
    });

    return null;
}

export default function LeafletSafezoneMap({ center, radius, onMapClick }: LeafletSafezoneMapProps) {
    // Fix for default Leaflet markers not showing
    useEffect(() => {
        // This part essentially fixes the marker icon issue in Next.js/Leaflet
        // We already use a custom divIcon below, but just in case we switch to default markers later.
        // However, since we are using a custom DivIcon, we might not strictly need the default icon fix
        // but importing CSS is crucial (done at top).
    }, []);

    const markerIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: #3b82f6; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });

    return (
        <>
            <link
                rel="stylesheet"
                href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
                crossOrigin=""
            />
            <MapContainer
                center={center}
                zoom={14}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapController center={center} onMapClick={onMapClick} />
                <Marker position={center} icon={markerIcon} />
                <Circle
                    center={center}
                    radius={radius}
                    pathOptions={{ fillColor: 'green', color: 'green', opacity: 0.5, fillOpacity: 0.2 }}
                />
            </MapContainer>
        </>
    );
}
