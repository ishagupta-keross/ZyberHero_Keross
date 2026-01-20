'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Search, MapPin, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';

// Dynamic import for the Map component to avoid SSR issues
const LeafletSafezoneMap = dynamic(() => import('./LeafletSafezoneMap'), {
    ssr: false,
    loading: () => (
        <div className="h-full w-full flex items-center justify-center bg-muted">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
    )
});

interface AddSafezoneModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (zone: { name: string; lat: number; lng: number; radius: number; address: string }) => void;
}

export function AddSafezoneModal({ isOpen, onClose, onSave }: AddSafezoneModalProps) {
    // Default to Delhi or user's current location if available
    const [center, setCenter] = useState<[number, number]>([28.6139, 77.2090]);
    const [name, setName] = useState('');
    const [radius, setRadius] = useState([500]); // in meters
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [address, setAddress] = useState('');

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
            );
            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon, display_name } = data[0];
                const newCenter: [number, number] = [parseFloat(lat), parseFloat(lon)];
                setCenter(newCenter);
                setAddress(display_name);
            } else {
                toast.error('Location not found');
            }
        } catch (error) {
            console.error('Search error:', error);
            toast.error('Failed to search location');
        } finally {
            setIsSearching(false);
        }
    };

    const handleMapClick = async (lat: number, lng: number) => {
        setCenter([lat, lng]);
        // Optionally reverse geocode based on click
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await response.json();
            if (data && data.display_name) {
                setAddress(data.display_name);
            }
        } catch (error) {
            console.error('Reverse geocoding error:', error);
        }
    };

    const handleSave = () => {
        if (!name.trim()) {
            toast.error('Please enter a name for the safe zone');
            return;
        }

        onSave({
            name,
            lat: center[0],
            lng: center[1],
            radius: radius[0], // meters
            address
        });

        // Reset and close
        setName('');
        setSearchQuery('');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Safe Zone</DialogTitle>
                    <DialogDescription>
                        Search for a location or click on the map to set the safe zone center.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid md:grid-cols-2 gap-6 py-4">
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Search location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <Button onClick={handleSearch} disabled={isSearching}>
                                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="zoneName">Zone Name</Label>
                            <Input
                                id="zoneName"
                                placeholder="e.g. Home, School"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <Label>Radius: {radius[0]} meters</Label>
                                <span className="text-xs text-muted-foreground">
                                    (~{Math.round(radius[0] * 0.000621371 * 100) / 100} miles)
                                </span>
                            </div>
                            <Slider
                                value={radius}
                                onValueChange={setRadius}
                                max={5000}
                                step={50}
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2 p-4 bg-muted rounded-lg text-sm">
                            <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 mt-0.5 text-primary" />
                                <div className="break-all">
                                    <p className="font-semibold text-xs uppercase text-muted-foreground mb-1">Selected Location</p>
                                    <p>{address || 'No address selected'}</p>
                                    <p className="text-xs text-muted-foreground mt-1 font-mono">
                                        {center[0].toFixed(6)}, {center[1].toFixed(6)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-[400px] rounded-lg overflow-hidden border relative">
                        <LeafletSafezoneMap
                            center={center}
                            radius={radius[0]}
                            onMapClick={handleMapClick}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave}>Create Safe Zone</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
