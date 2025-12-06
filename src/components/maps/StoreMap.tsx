import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Navigation, Clock, Phone, Search, Loader2, X, Route, LocateFixed, Fuel, Building2, ShoppingBag, Coffee } from 'lucide-react';

const STORE_LOCATION = { lat: 9.5545, lng: -69.1956 };
const GOOGLE_MAPS_API_KEY = 'AIzaSyCO0kKndUNlmQi3B5mxy4dblg_8WYcuKuk';

const STORE_INFO = {
  name: 'Telecom La Roca',
  address: 'Centro Comercial Latin Center, Local 10-11, Av. 33',
  city: 'Acarigua, Estado Portuguesa, Venezuela',
  phone: '(+58) 424-5896062',
  hours: 'Lun - Sab: 8am - 6pm | Dom: 9am - 4pm',
};

const PLACE_TYPES = [
  { type: 'gas_station', label: 'Gasolineras', icon: Fuel, color: '#ff6b6b' },
  { type: 'pharmacy', label: 'Farmacias', icon: Building2, color: '#4ecdc4' },
  { type: 'shopping_mall', label: 'Tiendas', icon: ShoppingBag, color: '#ffe66d' },
  { type: 'cafe', label: 'Cafés', icon: Coffee, color: '#a8e6cf' },
];

interface NearbyPlace {
  name: string;
  location: google.maps.LatLngLiteral;
  type: string;
  vicinity?: string;
}

interface StoreMapProps {
  variant?: 'full' | 'compact';
  showDirections?: boolean;
  showSearch?: boolean;
  showNearbyPlaces?: boolean;
}

export function StoreMap({ variant = 'full', showDirections = true, showSearch = true, showNearbyPlaces = true }: StoreMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const nearbyMarkersRef = useRef<google.maps.Marker[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
  const [selectedPlaceType, setSelectedPlaceType] = useState<string | null>(null);
  const [showPlacesPanel, setShowPlacesPanel] = useState(false);

  // Load Google Maps Script
  useEffect(() => {
    if (window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsLoaded(true);
    script.onerror = () => setError('Error cargando Google Maps');
    document.head.appendChild(script);
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return;

    const darkStyle: google.maps.MapTypeStyle[] = [
      { elementType: 'geometry', stylers: [{ color: '#0a0a1a' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#0a0a1a' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
      { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#2d3748' }] },
      { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
      { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#ff00cc' }] },
    ];

    const map = new google.maps.Map(mapRef.current, {
      center: STORE_LOCATION,
      zoom: variant === 'compact' ? 14 : 15,
      styles: darkStyle,
      disableDefaultUI: variant === 'compact',
      zoomControl: variant === 'full',
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: variant === 'full',
    });

    mapInstanceRef.current = map;

    // Store Marker
    markerRef.current = new google.maps.Marker({
      position: STORE_LOCATION,
      map,
      title: STORE_INFO.name,
      icon: {
        url: '/logo-magenta.png',
        scaledSize: new google.maps.Size(50, 50),
      },
    });

    // Info Window
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="padding: 12px; min-width: 200px; background: #0a0a1a; color: white; border-radius: 8px;">
          <h3 style="color: #00f2ff; font-weight: bold; margin-bottom: 8px;">${STORE_INFO.name}</h3>
          <p style="color: #9ca3af; font-size: 12px; margin-bottom: 4px;">${STORE_INFO.address}</p>
          <p style="color: #9ca3af; font-size: 12px; margin-bottom: 4px;">${STORE_INFO.city}</p>
          <p style="color: #ff00cc; font-size: 12px;">${STORE_INFO.phone}</p>
        </div>
      `,
    });

    markerRef.current.addListener('click', () => {
      infoWindow.open(map, markerRef.current);
    });

    infoWindow.open(map, markerRef.current);

    // Directions Renderer
    directionsRendererRef.current = new google.maps.DirectionsRenderer({
      map,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#ff00cc',
        strokeWeight: 4,
        strokeOpacity: 0.8,
      },
    });

    // Autocomplete
    if (inputRef.current && showSearch) {
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: 've' },
        fields: ['geometry', 'name'],
      });

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        if (place?.geometry?.location) {
          const origin = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };
          calculateRoute(origin);
        }
      });
    }
  }, [isLoaded, variant, showSearch]);

  // Search for nearby places
  const searchNearbyPlaces = useCallback((placeType: string) => {
    if (!mapInstanceRef.current || !window.google) return;

    // Clear existing nearby markers
    nearbyMarkersRef.current.forEach(marker => marker.setMap(null));
    nearbyMarkersRef.current = [];

    const service = new google.maps.places.PlacesService(mapInstanceRef.current);
    
    service.nearbySearch(
      {
        location: STORE_LOCATION,
        radius: 1000,
        type: placeType,
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const places: NearbyPlace[] = results.slice(0, 5).map(place => ({
            name: place.name || 'Sin nombre',
            location: {
              lat: place.geometry?.location?.lat() || 0,
              lng: place.geometry?.location?.lng() || 0,
            },
            type: placeType,
            vicinity: place.vicinity,
          }));

          setNearbyPlaces(places);
          setSelectedPlaceType(placeType);

          // Add markers for nearby places
          const placeConfig = PLACE_TYPES.find(p => p.type === placeType);
          places.forEach(place => {
            const marker = new google.maps.Marker({
              position: place.location,
              map: mapInstanceRef.current,
              title: place.name,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: placeConfig?.color || '#ffffff',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
              },
            });

            const infoWindow = new google.maps.InfoWindow({
              content: `
                <div style="padding: 8px; background: #0a0a1a; color: white; border-radius: 6px;">
                  <h4 style="color: ${placeConfig?.color}; font-weight: bold; margin-bottom: 4px;">${place.name}</h4>
                  <p style="color: #9ca3af; font-size: 11px;">${place.vicinity || ''}</p>
                </div>
              `,
            });

            marker.addListener('click', () => {
              infoWindow.open(mapInstanceRef.current, marker);
            });

            nearbyMarkersRef.current.push(marker);
          });
        }
      }
    );
  }, []);

  const clearNearbyPlaces = () => {
    nearbyMarkersRef.current.forEach(marker => marker.setMap(null));
    nearbyMarkersRef.current = [];
    setNearbyPlaces([]);
    setSelectedPlaceType(null);
  };

  const calculateRoute = useCallback(async (origin: google.maps.LatLngLiteral) => {
    if (!mapInstanceRef.current || !directionsRendererRef.current) return;

    const directionsService = new google.maps.DirectionsService();
    
    try {
      const result = await directionsService.route({
        origin,
        destination: STORE_LOCATION,
        travelMode: google.maps.TravelMode.DRIVING,
      });

      directionsRendererRef.current.setDirections(result);
      
      if (userMarkerRef.current) userMarkerRef.current.setMap(null);
      userMarkerRef.current = new google.maps.Marker({
        position: origin,
        map: mapInstanceRef.current,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#00f2ff',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3,
        },
      });

      if (result.routes[0]?.legs[0]) {
        setRouteInfo({
          distance: result.routes[0].legs[0].distance?.text || '',
          duration: result.routes[0].legs[0].duration?.text || '',
        });
      }
    } catch (err) {
      console.error('Route error:', err);
      setError('No se pudo calcular la ruta');
    }
  }, []);

  const getUserLocation = useCallback(() => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocalización no soportada');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        calculateRoute({ lat: position.coords.latitude, lng: position.coords.longitude });
        setIsLoading(false);
      },
      () => {
        setError('No se pudo obtener tu ubicación');
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [calculateRoute]);

  const clearRoute = () => {
    directionsRendererRef.current?.setDirections({ routes: [] } as google.maps.DirectionsResult);
    userMarkerRef.current?.setMap(null);
    setRouteInfo(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const openInGoogleMaps = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${STORE_LOCATION.lat},${STORE_LOCATION.lng}`, '_blank');
  };

  const height = variant === 'compact' ? 'h-64' : 'h-[500px]';

  if (!isLoaded) {
    return (
      <div className={`${height} rounded-2xl bg-midnight/50 border border-cyan/30 flex items-center justify-center`}>
        <Loader2 className="w-10 h-10 text-cyan animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden border border-cyan/30">
      {/* Search Bar */}
      {showSearch && variant === 'full' && (
        <div className="absolute top-4 left-4 right-4 z-10 flex gap-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="¿Desde dónde vienes?"
              className="w-full px-4 py-3 pl-10 bg-midnight/95 backdrop-blur-sm border border-cyan/30 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan text-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan" />
          </div>
          
          <button
            onClick={getUserLocation}
            disabled={isLoading}
            className="p-3 bg-gradient-to-r from-magenta to-cyan rounded-xl text-white hover:shadow-glow-magenta transition-all disabled:opacity-50"
            title="Usar mi ubicación"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LocateFixed className="w-5 h-5" />}
          </button>
          
          {routeInfo && (
            <button onClick={clearRoute} className="p-3 bg-midnight/95 border border-cyan/30 rounded-xl text-gray-400 hover:text-white transition-all">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {/* Route Info */}
      {routeInfo && variant === 'full' && (
        <div className="absolute top-20 left-4 z-10 bg-midnight/95 border border-magenta/50 rounded-xl px-4 py-3 shadow-glow-magenta">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Route className="w-4 h-4 text-cyan" />
              <span className="text-white font-bold">{routeInfo.distance}</span>
            </div>
            <div className="w-px h-4 bg-cyan/30" />
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-magenta" />
              <span className="text-white font-bold">{routeInfo.duration}</span>
            </div>
          </div>
        </div>
      )}

      {/* Nearby Places Panel */}
      {showNearbyPlaces && variant === 'full' && (
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setShowPlacesPanel(!showPlacesPanel)}
            className="p-3 bg-midnight/95 border border-violet/50 rounded-xl text-violet hover:text-white hover:border-violet transition-all"
            title="Lugares cercanos"
          >
            <Building2 className="w-5 h-5" />
          </button>
          
          {showPlacesPanel && (
            <div className="absolute top-14 right-0 bg-midnight/95 border border-cyan/30 rounded-xl p-4 min-w-[200px] shadow-lg">
              <h4 className="text-white font-bold text-sm mb-3">Lugares Cercanos</h4>
              <div className="grid grid-cols-2 gap-2">
                {PLACE_TYPES.map((placeType) => {
                  const Icon = placeType.icon;
                  const isSelected = selectedPlaceType === placeType.type;
                  return (
                    <button
                      key={placeType.type}
                      onClick={() => isSelected ? clearNearbyPlaces() : searchNearbyPlaces(placeType.type)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                        isSelected 
                          ? 'bg-violet/30 border border-violet' 
                          : 'bg-midnight/50 border border-cyan/20 hover:border-cyan'
                      }`}
                    >
                      <Icon className="w-5 h-5" style={{ color: placeType.color }} />
                      <span className="text-xs text-gray-400">{placeType.label}</span>
                    </button>
                  );
                })}
              </div>
              
              {nearbyPlaces.length > 0 && (
                <div className="mt-3 pt-3 border-t border-cyan/20">
                  <p className="text-cyan text-xs font-semibold mb-2">{nearbyPlaces.length} lugares encontrados</p>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {nearbyPlaces.map((place, i) => (
                      <div key={i} className="text-xs text-gray-400 truncate">{place.name}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="absolute top-20 left-4 z-10 bg-red-900/90 border border-red-500 rounded-xl px-4 py-2 text-white text-sm">
          {error}
        </div>
      )}

      {/* Map */}
      <div ref={mapRef} className={height} />

      {/* Actions */}
      {showDirections && variant === 'full' && (
        <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-center">
          <button
            onClick={openInGoogleMaps}
            className="flex items-center gap-2 bg-gradient-to-r from-magenta to-cyan px-6 py-3 rounded-xl font-bold text-white shadow-glow-magenta hover:scale-105 transition-all"
          >
            <Navigation className="w-5 h-5" />
            Cómo Llegar
          </button>
        </div>
      )}
    </div>
  );
}
