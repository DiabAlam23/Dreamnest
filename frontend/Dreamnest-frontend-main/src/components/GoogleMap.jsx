import React, { useState, useEffect } from 'react';

const GoogleMap = ({ 
  zoom = 15,
  className = "w-full h-64"
}) => {
  const [isInteractive, setIsInteractive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const [currentZoom, setCurrentZoom] = useState(zoom);

  // Create a mock interactive map without requiring API key
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - mapOffset.x, y: e.clientY - mapOffset.y });
    setIsInteractive(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setMapOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setCurrentZoom(prev => Math.min(prev + 1, 20));
    setIsInteractive(true);
  };

  const handleZoomOut = () => {
    setCurrentZoom(prev => Math.max(prev - 1, 1));
    setIsInteractive(true);
  };

  const handleReset = () => {
    setMapOffset({ x: 0, y: 0 });
    setCurrentZoom(zoom);
    setIsInteractive(false);
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e) => handleMouseMove(e);
    const handleGlobalMouseUp = () => handleMouseUp();

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragStart]);

  return (
    <div className={`${className} relative rounded-lg overflow-hidden bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 border border-gray-200 dark:border-gray-700`}>
      {/* Map Background with Street Pattern */}
      <div 
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(45deg, rgba(34,197,94,0.1) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(59,130,246,0.1) 25%, transparent 25%)
          `,
          backgroundSize: `${20 * (currentZoom / zoom)}px ${20 * (currentZoom / zoom)}px, ${20 * (currentZoom / zoom)}px ${20 * (currentZoom / zoom)}px, ${40 * (currentZoom / zoom)}px ${40 * (currentZoom / zoom)}px, ${40 * (currentZoom / zoom)}px ${40 * (currentZoom / zoom)}px`,
          transform: `translate(${mapOffset.x}px, ${mapOffset.y}px) scale(${currentZoom / zoom})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.3s ease'
        }}
      >
        {/* Street Network Overlay */}
        <div className="absolute inset-0 opacity-20">
          {/* Major Roads */}
          <div className="absolute top-1/3 left-0 right-0 h-1 bg-gray-400 dark:bg-gray-500"></div>
          <div className="absolute bottom-1/3 left-0 right-0 h-1 bg-gray-400 dark:bg-gray-500"></div>
          <div className="absolute top-0 bottom-0 left-1/4 w-1 bg-gray-400 dark:bg-gray-500"></div>
          <div className="absolute top-0 bottom-0 right-1/4 w-1 bg-gray-400 dark:bg-gray-500"></div>
          
          {/* Secondary Roads */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
        </div>

        {/* Green Spaces (Parks) */}
        <div className="absolute top-1/4 right-1/3 w-16 h-12 bg-green-200 dark:bg-green-800 rounded-lg opacity-60"></div>
        <div className="absolute bottom-1/4 left-1/4 w-12 h-16 bg-green-200 dark:bg-green-800 rounded-lg opacity-60"></div>

        {/* Water Bodies */}
        <div className="absolute top-3/4 right-1/4 w-20 h-6 bg-blue-200 dark:bg-blue-800 rounded-full opacity-60"></div>
      </div>

      {/* Property Marker */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full z-10 transition-transform duration-300"
        style={{
          transform: `translate(${-50 + (mapOffset.x * 0.1)}%, ${-100 + (mapOffset.y * 0.1)}%) scale(${Math.max(0.8, currentZoom / zoom)})`
        }}
      >
        <div className="relative">
          {/* Pin Shadow */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-black bg-opacity-20 rounded-full blur-sm"></div>
          
          {/* Pin */}
          <svg className="w-8 h-8 text-red-500 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          
          {/* Pin Pulse Animation */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-red-500 rounded-full animate-ping opacity-30"></div>
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
        <button
          onClick={handleZoomIn}
          className="w-8 h-8 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-md hover:shadow-lg transition-shadow flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        <button
          onClick={handleZoomOut}
          className="w-8 h-8 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-md hover:shadow-lg transition-shadow flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
          </svg>
        </button>
        {isInteractive && (
          <button
            onClick={handleReset}
            className="w-8 h-8 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-md hover:shadow-lg transition-shadow flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            title="Reset View"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </button>
        )}
      </div>

      {/* Location Info Overlay */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 max-w-xs z-20 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">Property Location</span>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Gulshan 2, Dhaka, Bangladesh
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          Zoom: {currentZoom}x • Interactive Map
        </p>
      </div>

      {/* Compass */}
      <div className="absolute top-4 left-4 w-8 h-8 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full shadow-md flex items-center justify-center z-20">
        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l3-3 3 3m-3-3v8" />
        </svg>
        <span className="absolute -bottom-5 text-xs text-gray-500 dark:text-gray-400">N</span>
      </div>
    </div>
  );
};

export default GoogleMap;