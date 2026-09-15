import React, { useEffect, useRef } from 'react';
import './OpenStreetMap.css';

const OpenStreetMap = ({ 
  center = { lat: 23.8103, lng: 90.4125 }, // Default to Gulshan, Dhaka
  zoom = 15,
  markers = [],
  className = "w-full h-64"
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    // Load Leaflet CSS and JS dynamically
    const loadLeaflet = async () => {
      // Check if Leaflet is already loaded
      if (window.L) {
        initializeMap();
        return;
      }

      // Load Leaflet CSS
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        link.crossOrigin = '';
        document.head.appendChild(link);
      }

      // Load Leaflet JS
      if (!document.querySelector('script[src*="leaflet"]')) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
        script.crossOrigin = '';
        script.onload = initializeMap;
        document.head.appendChild(script);
      }
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.L) return;

      // Clean up existing map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      // Create map instance
      mapInstanceRef.current = window.L.map(mapRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        touchZoom: true,
        dragging: true,
        attributionControl: true
      }).setView([center.lat, center.lng], zoom);

      // Add OpenStreetMap tiles
      const tileLayer = window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        tileSize: 256,
        zoomOffset: 0
      }).addTo(mapInstanceRef.current);

      // Hide loading overlay when tiles are loaded
      tileLayer.on('load', () => {
        const loadingElement = document.getElementById('map-loading');
        if (loadingElement) {
          loadingElement.style.display = 'none';
        }
      });

      // Clear existing markers
      markersRef.current.forEach(marker => {
        mapInstanceRef.current.removeLayer(marker);
      });
      markersRef.current = [];

      // Add markers
      if (markers.length > 0) {
        markers.forEach(markerData => {
          const marker = window.L.marker([markerData.position.lat, markerData.position.lng])
            .addTo(mapInstanceRef.current);
          
          if (markerData.title) {
            marker.bindPopup(markerData.title);
          }
          
          markersRef.current.push(marker);
        });
      } else {
        // Default marker at center
        const defaultMarker = window.L.marker([center.lat, center.lng])
          .addTo(mapInstanceRef.current)
          .bindPopup('Property Location')
          .openPopup();
        
        markersRef.current.push(defaultMarker);
      }

      // Custom red marker icon
      const redIcon = window.L.divIcon({
        className: 'custom-red-marker',
        html: `
          <div style="
            width: 25px;
            height: 25px;
            background-color: #EF4444;
            border: 3px solid white;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            position: relative;
          ">
            <div style="
              position: absolute;
              top: 50%;
              left: 50%;
              width: 8px;
              height: 8px;
              background-color: white;
              border-radius: 50%;
              transform: translate(-50%, -50%) rotate(45deg);
            "></div>
          </div>
        `,
        iconSize: [25, 25],
        iconAnchor: [12, 24],
        popupAnchor: [0, -24]
      });

      // Apply custom icon to markers
      markersRef.current.forEach(marker => {
        marker.setIcon(redIcon);
      });

      // Add custom controls
      const customControl = window.L.Control.extend({
        onAdd: function(map) {
          const container = window.L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
          
          container.style.backgroundColor = 'white';
          container.style.backgroundSize = '20px 20px';
          container.style.width = '30px';
          container.style.height = '30px';
          container.style.borderRadius = '4px';
          container.style.cursor = 'pointer';
          container.style.display = 'flex';
          container.style.alignItems = 'center';
          container.style.justifyContent = 'center';
          container.innerHTML = '📍';
          container.title = 'Center on Property';
          
          container.onclick = function() {
            map.setView([center.lat, center.lng], zoom);
          };
          
          return container;
        },
        onRemove: function() {
          // Nothing to do here
        }
      });
      
      // Add custom control to map
      new customControl({ position: 'topright' }).addTo(mapInstanceRef.current);
    };

    loadLeaflet();

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center.lat, center.lng, zoom, markers]);

  return (
    <div className={`${className} relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md`}>
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{ minHeight: '200px' }}
      />
      
      {/* Custom overlay with property info */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 max-w-xs z-[1000] border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">Property Location</span>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Gulshan 2, Dhaka, Bangladesh
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          OpenStreetMap • Interactive
        </p>
      </div>

      {/* Loading overlay */}
      <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center" id="map-loading">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 dark:border-primary-400 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading map...</p>
        </div>
      </div>


    </div>
  );
};

export default OpenStreetMap;