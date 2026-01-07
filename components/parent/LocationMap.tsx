'use client';

import { useEffect, useState, useCallback } from 'react';
import { MapPin, Navigation, Clock, RefreshCw, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import dynamic from 'next/dynamic';

import { baseApiRequest } from '@/app/utils/apiRequests/baseApiRequest';

const API_BASE = process.env.NEXT_PUBLIC_IKON_API_URL || 'http://localhost:8060/api';

interface LocationData {
  id: number;
  deviceId: number;
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  timestamp: string;
}

interface LocationMapProps {
  childId: number | string;
  childName: string;
  deviceIds: number[];
}

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

const Polyline = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polyline),
  { ssr: false }
);

function LeafletMap({ 
  currentLocation, 
  locationHistory 
}: { 
  currentLocation: LocationData | null;
  locationHistory: LocationData[];
}) {
  const [isClient, setIsClient] = useState(false);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);
    });
  }, []);

  if (!isClient || !L) {
    return (
      <div className="h-[400px] bg-muted rounded-lg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const defaultCenter: [number, number] = currentLocation 
    ? [currentLocation.latitude, currentLocation.longitude]
    : [28.6139, 77.2090]; // Default to Delhi

  const customIcon = L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: #3b82f6; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  const historyIcon = L.divIcon({
    className: 'history-marker',
    html: `<div style="background-color: #9ca3af; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 2px rgba(0,0,0,0.2);"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });

  const pathCoordinates: [number, number][] = locationHistory.map(loc => [loc.latitude, loc.longitude]);

  return (
    <MapContainer
      center={defaultCenter}
      zoom={15}
      style={{ height: '400px', width: '100%', borderRadius: '0.5rem' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {currentLocation && (
        <Marker 
          position={[currentLocation.latitude, currentLocation.longitude]} 
          icon={customIcon}
        >
          <Popup>
            <div className="p-2">
              <p className="font-semibold">Current Location</p>
              <p className="text-sm text-gray-600">
                {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
              </p>
              {currentLocation.accuracy && (
                <p className="text-xs text-gray-500">Accuracy: ±{currentLocation.accuracy.toFixed(0)}m</p>
              )}
              <p className="text-xs text-gray-500">
                {new Date(currentLocation.timestamp).toLocaleString()}
              </p>
            </div>
          </Popup>
        </Marker>
      )}

      {locationHistory.slice(1).map((loc, index) => (
        <Marker
          key={loc.id}
          position={[loc.latitude, loc.longitude]}
          icon={historyIcon}
        >
          <Popup>
            <div className="p-1">
              <p className="text-sm">{new Date(loc.timestamp).toLocaleString()}</p>
            </div>
          </Popup>
        </Marker>
      ))}

      {pathCoordinates.length > 1 && (
        <Polyline 
          positions={pathCoordinates}
          color="#3b82f6"
          weight={3}
          opacity={0.6}
          dashArray="5, 10"
        />
      )}
    </MapContainer>
  );
}

export function LocationMap({ childId, childName, deviceIds }: LocationMapProps) {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [locationHistory, setLocationHistory] = useState<LocationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocationData = useCallback(async () => {
    if (deviceIds.length === 0) {
      setError('No devices linked to this child');
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      
      // Fetch latest location from first device
      const deviceId = deviceIds[0];
      
      const [latestResp, historyResp] = await Promise.all([
        baseApiRequest(
          `${API_BASE}/location/latest?deviceId=${deviceId}`,
          { method: 'GET' },
          { isAccessTokenRequird: true }
        ),
        baseApiRequest(
          `${API_BASE}/location/history?deviceId=${deviceId}&limit=20`,
          { method: 'GET' },
          { isAccessTokenRequird: true }
        ),
      ]);

      // latest endpoint
      if (latestResp && (latestResp as any).status === 'Failure') {
        const msg = (latestResp as any).message || 'Failed to fetch latest location';
        // If backend returns 404 for no data, some wrappers treat it as error text.
        // We'll just show a friendly message.
        if (String(msg).includes('404')) {
          setCurrentLocation(null);
        } else {
          throw new Error(msg);
        }
      } else {
        // latestResp might be null/undefined if no data
        setCurrentLocation((latestResp as any) ?? null);
      }

      // history endpoint
      if (historyResp && (historyResp as any).status === 'Failure') {
        throw new Error((historyResp as any).message || 'Failed to fetch location history');
      }

      const historyData: any = historyResp ?? [];
      setLocationHistory(Array.isArray(historyData) ? historyData : historyData?.history ?? []);

    } catch (err) {
      console.error('Error fetching location:', err);
      setError('Failed to fetch location data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [deviceIds]);

  useEffect(() => {
    fetchLocationData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchLocationData, 30000);
    return () => clearInterval(interval);
  }, [fetchLocationData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchLocationData();
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading location data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <CardTitle>Live Location</CardTitle>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  {isRefreshing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  <span className="ml-2">Refresh</span>
                </Button>
              </div>
              <CardDescription>Real-time tracking for {childName}</CardDescription>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="h-[400px] bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">{error}</p>
                  </div>
                </div>
              ) : !currentLocation ? (
                <div className="h-[400px] bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No location data available yet</p>
                    <p className="text-sm text-muted-foreground mt-1">Location will appear once the device reports its position</p>
                  </div>
                </div>
              ) : (
                <>
                  <link
                    rel="stylesheet"
                    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
                    crossOrigin=""
                  />
                  <LeafletMap 
                    currentLocation={currentLocation}
                    locationHistory={locationHistory}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="w-5 h-5" />
              Location Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentLocation ? (
              <>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Coordinates</p>
                  <p className="font-mono text-sm">
                    {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                  </p>
                </div>
                
                {currentLocation.accuracy && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Accuracy</p>
                    <p className="font-semibold">±{currentLocation.accuracy.toFixed(0)} meters</p>
                  </div>
                )}

                {currentLocation.altitude && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Altitude</p>
                    <p className="font-semibold">{currentLocation.altitude.toFixed(0)} meters</p>
                  </div>
                )}

                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-semibold">{formatTimestamp(currentLocation.timestamp)}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(currentLocation.timestamp).toLocaleString()}
                  </p>
                </div>

                <Badge className="w-full justify-center bg-green-100 text-green-700">
                  <Clock className="w-3 h-3 mr-1" />
                  Tracking Active
                </Badge>
              </>
            ) : (
              <div className="text-center py-8">
                <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">No location data</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {locationHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Location History
            </CardTitle>
            <CardDescription>Recent locations visited by {childName}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {locationHistory.map((loc, index) => (
                <div
                  key={loc.id}
                  className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-blue-500' : 'bg-gray-400'}`} />
                  <div className="flex-1">
                    <p className="font-mono text-sm">
                      {loc.latitude.toFixed(6)}, {loc.longitude.toFixed(6)}
                    </p>
                    {loc.accuracy && (
                      <p className="text-xs text-muted-foreground">Accuracy: ±{loc.accuracy.toFixed(0)}m</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatTimestamp(loc.timestamp)}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(loc.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
