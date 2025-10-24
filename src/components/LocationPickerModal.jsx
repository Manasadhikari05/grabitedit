import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, MapPin, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';

export function LocationPickerModal({ isOpen, onClose, onLocationSelect, initialLocation = '' }) {
  const [searchQuery, setSearchQuery] = useState(initialLocation);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markerRef = useRef(null);

  // Initialize OpenStreetMap with Leaflet
  useEffect(() => {
    if (isOpen && !mapLoaded) {
      loadLeafletAndInitialize();
    }
  }, [isOpen, mapLoaded]);

  const loadLeafletAndInitialize = () => {
    // Check if Leaflet is already loaded
    if (window.L && window.L.map) {
      setMapLoaded(true);
      initializeMap();
      return;
    }

    // Check if scripts are already being loaded
    if (document.querySelector('link[href*="leaflet.css"]') ||
        document.querySelector('script[src*="leaflet.js"]')) {
      // Wait for them to load
      const checkLoaded = () => {
        if (window.L && window.L.map) {
          setMapLoaded(true);
          initializeMap();
        } else {
          setTimeout(checkLoaded, 100);
        }
      };
      checkLoaded();
      return;
    }

    // Load Leaflet CSS
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    cssLink.crossOrigin = '';
    document.head.appendChild(cssLink);

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = '';
    script.async = true;

    script.onload = () => {
      setMapLoaded(true);
      initializeMap();
    };

    script.onerror = () => {
      console.error('Failed to load Leaflet');
    };

    document.head.appendChild(script);
  };

  const initializeMap = () => {
    if (!mapRef.current || !window.L) return;

    try {
      // Clear any existing map
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }

      // Default center (India)
      const defaultCenter = [20.5937, 78.9629];

      // Ensure container is properly sized before creating map
      if (mapRef.current) {
        mapRef.current.style.height = '384px';
        mapRef.current.style.width = '100%';
      }

      leafletMapRef.current = window.L.map(mapRef.current, {
        center: defaultCenter,
        zoom: 5,
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        fadeAnimation: true,
        zoomAnimation: true,
      });

      // Add OpenStreetMap tiles
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(leafletMapRef.current);

      // Add click listener
      leafletMapRef.current.on('click', (e) => {
        handleMapClick(e.latlng);
      });

      // Force resize after map creation
      setTimeout(() => {
        if (leafletMapRef.current) {
          leafletMapRef.current.invalidateSize();
        }
      }, 100);

    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  const handleMapClick = async (latlng) => {
    try {
      // Reverse geocoding using Nominatim (OpenStreetMap)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}&addressdetails=1`
      );

      if (!response.ok) {
        throw new Error('Reverse geocoding failed');
      }

      const data = await response.json();

      const locationData = {
        address: data.display_name || `${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`,
        lat: latlng.lat,
        lng: latlng.lng,
        placeId: `osm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        addressComponents: data.address || {},
        osmData: data,
      };

      handleLocationSelect(locationData);
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      // Fallback to coordinates only
      const locationData = {
        address: `${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`,
        lat: latlng.lat,
        lng: latlng.lng,
        placeId: `osm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        addressComponents: {},
      };
      handleLocationSelect(locationData);
    }
  };

  const handleLocationSelect = (locationData) => {
    setSelectedLocation(locationData);
    setSearchQuery(locationData.address);

    // Update marker
    updateMarker([locationData.lat, locationData.lng]);

    // Center map
    if (leafletMapRef.current) {
      leafletMapRef.current.setView([locationData.lat, locationData.lng], 15);
    }

    // Clear search results
    setSearchResults([]);
  };

  const updateMarker = (latlng) => {
    if (!leafletMapRef.current || !window.L) return;

    try {
      // Remove existing marker
      if (markerRef.current) {
        leafletMapRef.current.removeLayer(markerRef.current);
      }

      // Create new marker
      markerRef.current = window.L.marker(latlng, {
        draggable: true,
      }).addTo(leafletMapRef.current);

      // Add drag listener
      markerRef.current.on('dragend', (e) => {
        handleMapClick(e.target.getLatLng());
      });

    } catch (error) {
      console.error('Error updating marker:', error);
    }
  };

  const searchLocations = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      // Search using Nominatim (OpenStreetMap)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`
      );

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();

      const results = data.map(item => ({
        place_id: item.place_id,
        name: item.display_name.split(',')[0], // First part of address
        formatted_address: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        addressComponents: item.address || {},
        osmData: item,
      }));

      setSearchResults(results);
    } catch (error) {
      console.error('Error searching locations:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchLocations(searchQuery);
  };

  const handleResultClick = (result) => {
    const locationData = {
      address: result.formatted_address,
      lat: result.lat,
      lng: result.lng,
      placeId: `osm_${result.place_id || Date.now()}`,
      addressComponents: result.addressComponents,
      osmData: result.osmData,
    };

    handleLocationSelect(locationData);

    // Center map on the selected search result
    if (leafletMapRef.current) {
      leafletMapRef.current.setView([result.lat, result.lng], 12);
    }
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
      handleClose();
    }
  };

  const handleClose = () => {
    setSearchQuery(initialLocation);
    setSearchResults([]);
    setSelectedLocation(null);
    setLoading(false);
    onClose();
  };

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery(initialLocation);
      setSearchResults([]);
      setSelectedLocation(null);
      setLoading(false);

      // Force multiple map resizes when modal opens
      const resizeMap = () => {
        if (leafletMapRef.current) {
          leafletMapRef.current.invalidateSize();
        }
      };

      setTimeout(resizeMap, 100);
      setTimeout(resizeMap, 300);
      setTimeout(resizeMap, 600);
    }
  }, [isOpen, initialLocation]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Select Location</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Search Bar */}
            <div className="p-6 border-b border-gray-200">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a location..."
                  className="pl-10 pr-12 h-12 text-base"
                  disabled={!mapLoaded}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  disabled={loading || !mapLoaded}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </Button>
              </form>

              {/* Loading State */}
              {!mapLoaded && (
                <div className="mt-4 text-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
                  <p className="text-sm text-gray-600">Loading OpenStreetMap...</p>
                </div>
              )}

              {/* Search Results */}
              {mapLoaded && searchResults.length > 0 && (
                <Card className="mt-4 p-2 max-h-48 overflow-y-auto">
                  {searchResults.map((result, index) => (
                    <div
                      key={result.place_id || index}
                      className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors flex items-start gap-3 cursor-pointer"
                      onClick={() => handleResultClick(result)}
                    >
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {result.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {result.formatted_address}
                        </p>
                      </div>
                      <div
                        className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded cursor-pointer transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResultClick(result);
                        }}
                      >
                        Select
                      </div>
                    </div>
                  ))}
                </Card>
              )}
            </div>

            {/* Map Container */}
            <div className="relative h-96 bg-gray-100 overflow-hidden">
              {mapLoaded ? (
                <div
                  ref={mapRef}
                  className="w-full h-full"
                  style={{
                    minHeight: '384px',
                    position: 'relative'
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-500" />
                    <p className="text-gray-600">Loading OpenStreetMap...</p>
                    <p className="text-xs text-gray-500 mt-1">This may take a few seconds</p>
                  </div>
                </div>
              )}

              {/* Selected Location Overlay */}
              {selectedLocation && mapLoaded && (
                <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg p-4 shadow-lg border border-gray-200">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">Selected Location</p>
                      <p className="text-sm text-gray-600">{selectedLocation.address}</p>
                      <p className="text-xs text-gray-500">
                        {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>


            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirmLocation}
                disabled={!selectedLocation || !mapLoaded}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Confirm Location
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}