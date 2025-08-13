import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Plus, Eye, Edit, XCircle, CheckCircle, Search, Filter, Clock, Users, DollarSign } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface TourItem {
  id: string;
  name: string;
  description: string;
  type: string;
  category: string;
  location: { id: string; name: string; city: string; district: string; province: string };
  duration: number;
  maxParticipants: number;
  minParticipants: number;
  pricePerPerson: number;
  currency: string;
  isAvailable: boolean;
  isVerified: boolean;
  images: string[];
  rating?: number;
  totalReviews?: number;
}

const ToursManagement: React.FC = () => {
  const { token } = useAuth();
  const mockTours: TourItem[] = [
    {
      id: 'tour_1',
      name: 'Kigali City Tour',
      description: 'Discover Kigali highlights with a local guide.',
      type: 'CITY_TOUR',
      category: 'STANDARD',
      location: { id: 'loc_kg', name: 'Kigali', city: 'Kigali', district: 'Gasabo', province: 'Kigali' },
      duration: 4,
      maxParticipants: 10,
      minParticipants: 1,
      pricePerPerson: 20000,
      currency: 'RWF',
      isAvailable: true,
      isVerified: true,
      images: ['/src/assets/Santorini, Greece, is a dream destination renowned….jpeg','/src/assets/761b7e71-c4f2-434c-a549-2f4ef326eaf3.jpeg'],
    },
    {
      id: 'tour_2',
      name: 'Gorilla Trekking Prep Tour',
      description: 'Learn about trekking preparation and conservation.',
      type: 'NATURE_TOUR',
      category: 'PREMIUM',
      location: { id: 'loc_mus', name: 'Musanze', city: 'Musanze', district: 'Musanze', province: 'Northern' },
      duration: 6,
      maxParticipants: 6,
      minParticipants: 1,
      pricePerPerson: 90000,
      currency: 'RWF',
      isAvailable: true,
      isVerified: false,
      images: ['/src/assets/23e63dfb-034f-4514-87cd-d0c452bdbef1.jpeg','/src/assets/Sarıyer konut projeleri, İstanbul\'un en değerli….jpeg'],
    },
  ];
  const [items, setItems] = useState<TourItem[]>(mockTours);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [availableFilter, setAvailableFilter] = useState<string>('all');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const url = new URL(window.location.origin + '/api/tours');
      url.searchParams.set('limit', '50');
      const res = await fetch(url.toString(), {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.data?.tours) && json.data.tours.length) {
        setItems(json.data.tours);
      }
    } catch (e) {
      console.error('Failed to load tours', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((t) => {
      const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.location?.city?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || t.type === typeFilter;
      const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
      const matchesAvailable = availableFilter === 'all' || (availableFilter === 'available' ? t.isAvailable : !t.isAvailable);
      return matchesSearch && matchesType && matchesCategory && matchesAvailable;
    });
  }, [items, searchTerm, typeFilter, categoryFilter, availableFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tours Management</h2>
          <p className="text-gray-600">Search, review and manage tours and experiences</p>
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
                <SelectItem value="CITY_TOUR">City Tour</SelectItem>
                <SelectItem value="CULTURAL_TOUR">Cultural Tour</SelectItem>
                <SelectItem value="ADVENTURE_TOUR">Adventure Tour</SelectItem>
                <SelectItem value="FOOD_TOUR">Food Tour</SelectItem>
                <SelectItem value="NATURE_TOUR">Nature Tour</SelectItem>
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
                  setCategoryFilter('all');
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
          <CardTitle>All Tours ({filteredItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-40 text-gray-500">Loading tours...</div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tours found</h3>
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
                          <Clock className="h-4 w-4 mr-1" /> {t.duration} hrs
                        </div>
                        <div className="flex items-center text-sm text-gray-700">
                          <Users className="h-4 w-4 mr-1" /> {t.minParticipants}-{t.maxParticipants}
                        </div>
                        <div className="flex items-center text-sm text-gray-700">
                          <DollarSign className="h-4 w-4 mr-1 text-green-600" /> {t.currency} {t.pricePerPerson.toLocaleString()} <span className="text-xs text-gray-500 ml-1">/ person</span>
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

export default ToursManagement;


