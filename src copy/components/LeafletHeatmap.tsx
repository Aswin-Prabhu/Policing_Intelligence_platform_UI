import { useEffect, useMemo, useRef } from 'react';
import * as L from 'leaflet';
import 'leaflet.heat';

import type { ActivityPoint } from '../api/cohorts';

type Props = {
  points: ActivityPoint[];
  className?: string;
  onPointHover?: (p: ActivityPoint | null) => void;
};

function toIntensity(level: ActivityPoint['activity_level']) {
  switch (level) {
    case 'HIGH':
      return 1.0;
    case 'MEDIUM':
      return 0.65;
    case 'LOW':
    default:
      return 0.35;
  }
}

function colors(level: ActivityPoint['activity_level']) {
  switch (level) {
    case 'HIGH':
      return { ring: '#ef4444', fill: '#ef4444' };
    case 'MEDIUM':
      return { ring: '#f59e0b', fill: '#f59e0b' };
    case 'LOW':
    default:
      return { ring: '#22c55e', fill: '#22c55e' };
  }
}

export default function LeafletHeatmap({ points, className, onPointHover }: Props) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const heatRef = useRef<any>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const bounds = useMemo(() => {
    const latlngs = points
      .filter((p) => Number.isFinite(p.latitude) && Number.isFinite(p.longitude))
      .map((p) => L.latLng(p.latitude, p.longitude));
    return latlngs.length ? L.latLngBounds(latlngs) : null;
  }, [points]);

  useEffect(() => {
    if (!elRef.current || mapRef.current) return;

    const map = L.map(elRef.current, {
      zoomControl: true,
      attributionControl: false,
      preferCanvas: true,
      zoomSnap: 0.25,
      zoomDelta: 0.5,
    });

    // Light street basemap (like the reference screenshot) — no API key required.
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      subdomains: ['a', 'b', 'c'],
      maxZoom: 20,
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);

    // Default view: Kakinada-ish
    map.setView([16.9891, 82.2475], 12.5);

    mapRef.current = map;

    // Invalidate size after initial render to ensure map displays correctly
    // This fixes the blank map issue
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 200);

    return () => {
      map.remove();
      mapRef.current = null;
      heatRef.current = null;
      markersLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Invalidate map size to ensure it renders correctly
    // This fixes issues where the map appears blank
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    // Heat data: [lat, lng, intensity]
    const heatData = points
      .filter((p) => Number.isFinite(p.latitude) && Number.isFinite(p.longitude))
      .map((p) => [p.latitude, p.longitude, toIntensity(p.activity_level)] as [number, number, number]);

    if (!heatRef.current) {
      heatRef.current = (L as any).heatLayer(heatData, {
        radius: 36,
        blur: 30,
        minOpacity: 0.32,
        maxZoom: 17,
        // Reference palette: green → yellow → dark red
        gradient: {
          0.2: '#22c55e',  // green
          0.55: '#facc15', // yellow
          0.8: '#f97316',  // orange
          1.0: '#7f1d1d',  // dark red
        },
      }).addTo(map);
    } else {
      heatRef.current.setLatLngs(heatData);
    }

    // Markers layer (camera dots)
    const markersLayer = markersLayerRef.current;
    if (markersLayer) {
      markersLayer.clearLayers();

      points.forEach((p) => {
        if (!Number.isFinite(p.latitude) || !Number.isFinite(p.longitude)) return;

        // No visible pins: use an invisible interactive hit-area so hover still shows details.
        const marker = L.circleMarker([p.latitude, p.longitude], {
          radius: 14,
          stroke: false,
          opacity: 0,
          fillOpacity: 0,
          interactive: true,
          bubblingMouseEvents: false,
        });

        const popupHtml = `
          <div class="kkn-popup">
            <div class="kkn-popup__title">${p.camera_id}</div>
            <div class="kkn-popup__row"><span class="kkn-popup__label">Zone</span><span class="kkn-popup__value">${p.zone || '—'}</span></div>
            <div class="kkn-popup__row"><span class="kkn-popup__label">Activity</span><span class="kkn-popup__value kkn-popup__pill kkn-pill-${p.activity_level.toLowerCase()}">${p.activity_level}</span></div>
          </div>
        `;

        marker.bindPopup(popupHtml, { closeButton: false, offset: L.point(0, -6) });

        marker.on('mouseover', () => {
          onPointHover?.(p);
          marker.openPopup();
        });
        marker.on('mouseout', () => {
          onPointHover?.(null);
          marker.closePopup();
        });

        marker.addTo(markersLayer);
      });
    }

    // Update bounds and invalidate size after data loads
    if (bounds && bounds.isValid()) {
      setTimeout(() => {
        map.invalidateSize();
        map.fitBounds(bounds.pad(0.18), { animate: false, maxZoom: 15.5 });
        map.invalidateSize(); // Invalidate again after fitBounds
      }, 150);
    } else {
      // Even without bounds, invalidate size to ensure map renders
      setTimeout(() => {
        map.invalidateSize();
      }, 150);
    }
  }, [points, bounds, onPointHover]);

  return (
    <div
      ref={elRef}
      className={className}
      style={{ width: '100%', height: '100%', outline: 'none' }}
      // Leaflet uses its own focus management; keep React quiet.
      suppressHydrationWarning
    />
  );
}


