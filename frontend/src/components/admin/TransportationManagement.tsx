import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car, Plus, Eye, Edit, XCircle, CheckCircle, MapPin, Search, Filter, Users, DollarSign } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface TransportationItem {
  id: string;
  name: string;
  description: string;
  type: string;
  vehicleType: string;
  location: { id: string; name: string; city: string; district: string; province: string };
  capacity: number;
  pricePerTrip: number;
  pricePerHour?: number;
  currency: string;
  isAvailable: boolean;
  isVerified: boolean;
  images: string[];
}

const TransportationManagement: React.FC = () => {
  const { token } = useAuth();
  const mockTransportation: TransportationItem[] = [
    {
      id: 'trans_1',
      name: 'Airport Pickup - Sedan',
      description: 'Comfortable airport pickup within Kigali.',
      type: 'AIRPORT_PICKUP',
      vehicleType: 'STANDARD',
      location: { id: 'loc_kg', name: 'Kigali', city: 'Kigali', district: 'Gasabo', province: 'Kigali' },
      capacity: 3,
      pricePerTrip: 15000,
      pricePerHour: 10000,
      currency: 'RWF',
      isAvailable: true,
      isVerified: true,
      images: ['/src/assets/Did you ever wonder what the \'Big Ben\' really is_….jpeg','/src/assets/23e63dfb-034f-4514-87cd-d0c452bdbef1.jpeg'],
    },
    {
      id: 'trans_2',
      name: 'City Transport - Van',
      description: 'Group transportation across Kigali.',
      type: 'CITY_TRANSPORT',
      vehicleType: 'VAN',
      location: { id: 'loc_kg', name: 'Kigali', city: 'Kigali', district: 'Gasabo', province: 'Kigali' },
      capacity: 8,
      pricePerTrip: 30000,
      pricePerHour: 20000,
      currency: 'RWF',
      isAvailable: true,
      isVerified: false,
      images: ['/src/assets/fd6902fc-8030-44d8-a553-dec23b4680db.jpeg','/src/assets/55ba719c-88e5-4624-a347-eab7c1c42fb5.jpeg'],
    },
  ];
  const [items, setItems] = useState<TransportationItem[]>(mockTransportation);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [vehicleFilter, setVehicleFilter] = useState<string>('all');
  const [availableFilter, setAvailableFilter] = useState<string>('all');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const url = new URL(window.location.origin + '/api/transportation');
      url.searchParams.set('limit', '50');
      const res = await fetch(url.toString(), {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.data?.transportation) && json.data.transportation.length) {
        setItems(json.data.transportation);
      }
    } catch (e) {
      console.error('Failed to load transportation services', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((t) => {
      const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.location?.city?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || t.type === typeFilter;
      const matchesVehicle = vehicleFilter === 'all' || t.vehicleType === vehicleFilter;
      const matchesAvailable = availableFilter === 'all' || (availableFilter === 'available' ? t.isAvailable : !t.isAvailable);
      return matchesSearch && matchesType && matchesVehicle && matchesAvailable;
    });
  }, [items, searchTerm, typeFilter, vehicleFilter, availableFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Transportation Management</h2>
          <p className="text-gray-600">Search, review and manage transportation services</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search by name or city" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="AIRPORT_PICKUP">Airport Pickup</SelectItem>
                <SelectItem value="CITY_TRANSPORT">City Transport</SelectItem>
                <SelectItem value="TOUR_TRANSPORT">Tour Transport</SelectItem>
                <SelectItem value="PRIVATE_TRANSPORT">Private Transport</SelectItem>
              </SelectContent>
            </Select>
            <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Vehicle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vehicles</SelectItem>
                <SelectItem value="STANDARD">Standard</SelectItem>
                <SelectItem value="VIP">VIP</SelectItem>
                <SelectItem value="VAN">Van</SelectItem>
                <SelectItem value="BUS">Bus</SelectItem>
                <SelectItem value="MOTORCYCLE">Motorcycle</SelectItem>
              </SelectContent>
            </Select>
            <Select value={availableFilter} onValueChange={setAvailableFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setTypeFilter('all');
                  setVehicleFilter('all');
                  setAvailableFilter('all');
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Transportation ({filteredItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-40 text-gray-500">Loading transportation...</div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transportation found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredItems.map((t) => (
                <div key={t.id} className="border rounded-xl overflow-hidden bg-white shadow hover:shadow-lg transition">
                  <div className="aspect-video bg-muted">
                    <img src={t.images?.[0] || '/placeholder.svg'} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-lg font-semibold">{t.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="h-3.5 w-3.5 mr-1" /> {t.location?.city}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={t.isVerified ? 'default' : 'secondary'}>{t.isVerified ? 'Verified' : 'Unverified'}</Badge>
                        {t.isAvailable ? <Badge variant="outline">Available</Badge> : <Badge variant="destructive">Unavailable</Badge>}
                      </div>
                    </div>
                    <div className="text-sm line-clamp-2 text-gray-600">{t.description}</div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-700">
                          <Users className="h-4 w-4 mr-1" /> Up to {t.capacity}
                        </div>
                        <div className="flex items-center text-sm text-gray-700">
                          <DollarSign className="h-4 w-4 mr-1 text-green-600" /> {t.currency} {t.pricePerTrip.toLocaleString()} <span className="text-xs text-gray-500 ml-1">/ trip</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline"><Eye className="h-4 w-4" /></Button>
                        <Button size="sm" variant="outline"><Edit className="h-4 w-4" /></Button>
                        {!t.isVerified ? (
                          <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700"><CheckCircle className="h-4 w-4" /></Button>
                        ) : (
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700"><XCircle className="h-4 w-4" /></Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransportationManagement;


