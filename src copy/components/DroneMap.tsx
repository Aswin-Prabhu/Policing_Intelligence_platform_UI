import { useEffect, useRef } from 'react';
import * as L from 'leaflet';

interface DroneMapProps {
  lat: number;
  lng: number;
  className?: string;
  radius?: number; // radius in meters
}

export default function DroneMap({ lat, lng, className, radius = 500 }: DroneMapProps) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);

  useEffect(() => {
    if (!elRef.current || mapRef.current) return;

    const map = L.map(elRef.current, {
      zoomControl: true,
      attributionControl: false,
      preferCanvas: true,
    });

    // Use OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      subdomains: ['a', 'b', 'c'],
      maxZoom: 20,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
      circleRef.current = null;
    };
  }, []);

  // Add marker and circle after map is initialized
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove existing marker and circle if they exist
    if (markerRef.current) {
      map.removeLayer(markerRef.current);
    }
    if (circleRef.current) {
      map.removeLayer(circleRef.current);
    }

    // Create custom icon for drone position
    const droneIcon = L.divIcon({
      className: 'drone-marker',
      html: `<div style="
        width: 20px;
        height: 20px;
        background-color: #06b6d4;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(6, 182, 212, 0.8);
      "></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    // Add marker
    const marker = L.marker([lat, lng], { icon: droneIcon }).addTo(map);
    markerRef.current = marker;

    // Add circle to show approximate area
    const circle = L.circle([lat, lng], {
      radius: radius,
      color: '#06b6d4',
      fillColor: '#06b6d4',
      fillOpacity: 0.2,
      weight: 2,
    }).addTo(map);
    circleRef.current = circle;

    // Set view to show the circle with appropriate zoom
    map.setView([lat, lng], 15);
    map.fitBounds(circle.getBounds(), { padding: [20, 20] });
  }, [lat, lng, radius]);

  return <div ref={elRef} className={className} style={{ width: '100%', height: '100%' }} />;
}
