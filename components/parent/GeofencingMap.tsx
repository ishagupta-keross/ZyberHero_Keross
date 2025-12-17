'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Plus, Trash2, AlertTriangle, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface GeofencingMapProps {
  childName: string;
}

export function GeofencingMap({ childName }: GeofencingMapProps) {
  const [zones, setZones] = useState([
    { id: 1, name: 'Home', radius: 0.5, status: 'inside', color: 'bg-green-500' },
    { id: 2, name: 'School', radius: 0.3, status: 'outside', color: 'bg-blue-500' },
    { id: 3, name: 'Park', radius: 0.2, status: 'outside', color: 'bg-yellow-500' },
  ]);

  const currentLocation = {
    lat: 40.7128,
    lng: -74.0060,
    address: '123 Main St, New York, NY',
    lastUpdated: '2 minutes ago',
  };

  const locationHistory = [
    { time: '2:45 PM', location: 'Home', status: 'safe' },
    { time: '2:30 PM', location: 'Walking on Main St', status: 'safe' },
    { time: '12:00 PM', location: 'School', status: 'safe' },
    { time: '8:00 AM', location: 'Home', status: 'safe' },
  ];

  const addZone = () => {
    toast.success('New safe zone created');
  };

  const deleteZone = (id: number) => {
    setZones(zones.filter(z => z.id !== id));
    toast.success('Safe zone removed');
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Current Location
            </CardTitle>
            <CardDescription>Real-time tracking for {childName}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-gradient-to-br from-cyan-100 to-pink-100 dark:from-blue-950 dark:to-purple-950 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
              <div className="relative z-10 text-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block"
                >
                  <MapPin className="w-16 h-16 text-primary" />
                </motion.div>
                <p className="text-sm text-muted-foreground mt-2">Interactive Map View</p>
              </div>
              <div className="absolute top-4 right-4">
                <Badge className="bg-green-500 text-white">Inside Safe Zone</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-1" />
                <div>
                  <p className="font-semibold">{currentLocation.address}</p>
                  <p className="text-sm text-muted-foreground">
                    Lat: {currentLocation.lat}, Lng: {currentLocation.lng}
                  </p>
                  <p className="text-xs text-muted-foreground">Last updated: {currentLocation.lastUpdated}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                Safe Zones
              </CardTitle>
              <Button size="sm" onClick={addZone} className="gradient-cyan-blue text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Zone
              </Button>
            </div>
            <CardDescription>Manage geofencing boundaries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {zones.map((zone) => (
                <motion.div
                  key={zone.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${zone.color}`}></div>
                      <div>
                        <h4 className="font-semibold">{zone.name}</h4>
                        <p className="text-sm text-muted-foreground">Radius: {zone.radius} miles</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {zone.status === 'inside' ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <Check className="w-3 h-3 mr-1" />
                          Inside
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Outside</Badge>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteZone(zone.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Location History</CardTitle>
          <CardDescription>Recent locations visited by {childName}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {locationHistory.map((entry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-3 border rounded-lg"
              >
                <div className="w-12 text-center">
                  <p className="text-sm font-semibold">{entry.time}</p>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{entry.location}</p>
                </div>
                <Badge variant={entry.status === 'safe' ? 'secondary' : 'destructive'}>
                  {entry.status}
                </Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
