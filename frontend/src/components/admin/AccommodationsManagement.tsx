import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Hotel, Plus, Eye, Edit, CheckCircle, XCircle, MapPin, Search, Filter, DollarSign } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface Accommodation {
  id: string;
  name: string;
  description: string;
  type: string;
  category: string;
  location: { id: string; name: string; city: string; district: string; province: string };
  pricePerNight: number;
  currency: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  isAvailable: boolean;
  isVerified: boolean;
  rating?: number;
  totalReviews?: number;
}

const AccommodationsManagement: React.FC = () => {
  const { token } = useAuth();
  const mockAccommodations: Accommodation[] = [
    {
      id: 'acc_1',
      name: 'Kigali Heights Hotel',
      description: 'Modern hotel in the city center with skyline views.',
      type: 'HOTEL',
      category: 'PREMIUM',
      location: { id: 'loc_kg', name: 'Kigali', city: 'Kigali', district: 'Gasabo', province: 'Kigali' },
      pricePerNight: 120000,
      currency: 'RWF',
      maxGuests: 2,
      bedrooms: 1,
      bathrooms: 1,
      amenities: ['WiFi','Pool','Gym'],
      images: ['/src/assets/23e63dfb-034f-4514-87cd-d0c452bdbef1.jpeg','/src/assets/fd6902fc-8030-44d8-a553-dec23b4680db.jpeg'],
      isAvailable: true,
      isVerified: true,
      rating: 4.6,
      totalReviews: 132,
    },
    {
      id: 'acc_2',
      name: 'Lake Kivu Villa',
      description: 'Lakeside villa with private deck and serene views.',
      type: 'VILLA',
      category: 'LUXURY',
      location: { id: 'loc_rub', name: 'Rubavu', city: 'Gisenyi', district: 'Rubavu', province: 'Western' },
      pricePerNight: 250000,
      currency: 'RWF',
      maxGuests: 6,
      bedrooms: 3,
      bathrooms: 2,
      amenities: ['WiFi','Kitchen','Parking'],
      images: ['/src/assets/55ba719c-88e5-4624-a347-eab7c1c42fb5.jpeg','/src/assets/761b7e71-c4f2-434c-a549-2f4ef326eaf3.jpeg'],
      isAvailable: true,
      isVerified: false,
      rating: 4.8,
      totalReviews: 78,
    },
    {
      id: 'acc_3',
      name: 'Nyungwe Guesthouse',
      description: 'Cozy guesthouse near Nyungwe Forest trails.',
      type: 'GUESTHOUSE',
      category: 'STANDARD',
      location: { id: 'loc_nyu', name: 'Nyungwe', city: 'Nyamagabe', district: 'Nyamagabe', province: 'Southern' },
      pricePerNight: 60000,
      currency: 'RWF',
      maxGuests: 3,
      bedrooms: 1,
      bathrooms: 1,
      amenities: ['Breakfast','Guided Tours'],
      images: ['/src/assets/Santorini, Greece, is a dream destination renowned….jpeg','/src/assets/Sarıyer konut projeleri, İstanbul\'un en değerli….jpeg'],
      isAvailable: false,
      isVerified: true,
      rating: 4.2,
      totalReviews: 41,
    },
  ];
  const [items, setItems] = useState<Accommodation[]>(mockAccommodations);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [verifiedFilter, setVerifiedFilter] = useState<string>('all');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const url = new URL(window.location.origin + '/api/accommodations');
      url.searchParams.set('limit', '50');
      const res = await fetch(url.toString(), {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.data?.accommodations) && json.data.accommodations.length) {
        setItems(json.data.accommodations);
      }
    } catch (e) {
      console.error('Failed to load accommodations', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((a) => {
      const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.location?.city?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || a.type === typeFilter;
      const matchesCategory = categoryFilter === 'all' || a.category === categoryFilter;
      const matchesVerified = verifiedFilter === 'all' || (verifiedFilter === 'verified' ? a.isVerified : !a.isVerified);
      return matchesSearch && matchesType && matchesCategory && matchesVerified;
    });
  }, [items, searchTerm, typeFilter, categoryFilter, verifiedFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Accommodations Management</h2>
          <p className="text-gray-600">Search, review and verify accommodations</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>

      {/* Filters */}
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
                <SelectItem value="HOTEL">Hotel</SelectItem>
                <SelectItem value="GUESTHOUSE">Guesthouse</SelectItem>
                <SelectItem value="APARTMENT">Apartment</SelectItem>
                <SelectItem value="VILLA">Villa</SelectItem>
                <SelectItem value="HOSTEL">Hostel</SelectItem>
                <SelectItem value="CAMPING">Camping</SelectItem>
                <SelectItem value="HOMESTAY">Homestay</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="BUDGET">Budget</SelectItem>
                <SelectItem value="STANDARD">Standard</SelectItem>
                <SelectItem value="PREMIUM">Premium</SelectItem>
                <SelectItem value="LUXURY">Luxury</SelectItem>
              </SelectContent>
            </Select>
            <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Verification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setTypeFilter('all');
                  setCategoryFilter('all');
                  setVerifiedFilter('all');
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid */}
      <Card>
        <CardHeader>
          <CardTitle>All Accommodations ({filteredItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-40 text-gray-500">Loading accommodations...</div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <Hotel className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No accommodations found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredItems.map((a) => (
                <div key={a.id} className="border rounded-xl overflow-hidden bg-white shadow hover:shadow-lg transition">
                  <div className="aspect-video bg-muted">
                    <img src={a.images?.[0] || '/placeholder.svg'} alt={a.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-lg font-semibold">{a.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="h-3.5 w-3.5 mr-1" /> {a.location?.city}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={a.isVerified ? 'default' : 'secondary'}>{a.isVerified ? 'Verified' : 'Unverified'}</Badge>
                        {a.isAvailable ? <Badge variant="outline">Available</Badge> : <Badge variant="destructive">Unavailable</Badge>}
                      </div>
                    </div>
                    <div className="text-sm line-clamp-2 text-gray-600">{a.description}</div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                        <span className="font-semibold">{a.currency} {a.pricePerNight?.toLocaleString?.() || a.pricePerNight}</span>
                        <span className="ml-1 text-xs text-gray-500">/ night</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline"><Eye className="h-4 w-4" /></Button>
                        <Button size="sm" variant="outline"><Edit className="h-4 w-4" /></Button>
                        {!a.isVerified ? (
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

export default AccommodationsManagement;
