'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getSubscribers } from '@/app/actions/subscribersActions';

// Define types
type Subscriber = {
  id: string;
  starlinkId: string;
  serialNumber: string;
  longitude: number;
  latitude: number;
  active: boolean;
  country: string;
  state: string;
  subscriptionEndDate: Date | null;
};

type StateStats = {
  [key: string]: {
    active: number;
    inactive: number;
  };
};

// Create custom icons for active and inactive subscribers
const activeIcon = new L.Icon({
  iconUrl: '/images/green-pointer.svg',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const inactiveIcon = new L.Icon({
  iconUrl: '/images/red-pointer.svg',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const Map = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>(
    []
  );
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'active' | 'inactive'
  >('all');
  const [isLoading, setIsLoading] = useState(true);

  // Calculate stats
  const stats = {
    active: subscribers.filter((sub) => sub.active).length,
    inactive: subscribers.filter((sub) => !sub.active).length,
  };

  // Calculate state statistics
  const stateStats = subscribers.reduce((acc: StateStats, sub) => {
    if (!acc[sub.state]) {
      acc[sub.state] = { active: 0, inactive: 0 };
    }
    if (sub.active) {
      acc[sub.state].active++;
    } else {
      acc[sub.state].inactive++;
    }
    return acc;
  }, {});

  useEffect(() => {
    const loadSubscribers = async () => {
      try {
        const data = await getSubscribers();
        setSubscribers(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load subscribers:', error);
        setIsLoading(false);
      }
    };

    loadSubscribers();
  }, []);

  useEffect(() => {
    const filtered = subscribers.filter((sub) => {
      const matchesQuery =
        sub.state.toLowerCase().includes(query.toLowerCase()) ||
        sub.starlinkId.toLowerCase().includes(query.toLowerCase()) ||
        sub.serialNumber.toLowerCase().includes(query.toLowerCase());

      const matchesStatus =
        activeFilter === 'all' ||
        (activeFilter === 'active' && sub.active) ||
        (activeFilter === 'inactive' && !sub.active);

      return matchesQuery && matchesStatus;
    });

    setFilteredSubscribers(filtered);
  }, [query, activeFilter, subscribers]);

  return (
    <div className="relative w-full mt-6">
      {/* Filter Bar */}
      <div className="absolute z-10 bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 items-center bg-gray-800 p-2 rounded-lg shadow-lg w-fit text-xs">
        {/* Status Filter */}
        <select
          className="bg-gray-700 text-white px-3 py-2 rounded"
          value={activeFilter}
          onChange={(e) =>
            setActiveFilter(e.target.value as 'all' | 'active' | 'inactive')
          }
        >
          <option value="all">All Subscribers</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>

        {/* Stats */}
        <div className="flex gap-2">
          <div className="bg-green-600 text-white px-3 py-2 rounded flex gap-3">
            <p>Active:</p> <span>{stats.active}</span>
          </div>
          <div className="bg-red-600 text-white px-3 py-2 rounded flex gap-3">
            <p>Inactive: </p> <span>{stats.inactive}</span>
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by location, Starlink ID, or Serial Number"
          className="px-4 py-2 bg-gray-700 text-white rounded w-80"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="h-[70vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      ) : (
        <MapContainer
          center={[10, 10]}
          zoom={2}
          style={{ height: '70vh', width: '100%', zIndex: '1' }}
          dragging={false}
          touchZoom={false}
          scrollWheelZoom={false}
          doubleClickZoom={false}
          boxZoom={false}
          keyboard={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CartoDB</a> contributors'
          />
          {filteredSubscribers.map((sub) => (
            <Marker
              key={sub.id}
              position={[sub.latitude, sub.longitude]}
              icon={sub.active ? activeIcon : inactiveIcon}
            >
              <Popup>
                <div className="bg-gray-800 text-white p-2 rounded">
                  <strong>
                    {sub.state}, {sub.country}
                  </strong>
                  <br />
                  Starlink ID: {sub.starlinkId}
                  <br />
                  Serial: {sub.serialNumber}
                  <br />
                  Status: {sub.active ? 'Active' : 'Inactive'}
                </div>
              </Popup>
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                <div className="bg-gray-700 text-white p-2 rounded text-sm shadow-lg">
                  <strong>
                    {sub.state}, {sub.country}
                  </strong>
                  <br />
                  {sub.starlinkId} | {sub.serialNumber}
                  <br />
                  Active: {stateStats[sub.state].active} | Inactive:{' '}
                  {stateStats[sub.state].inactive}
                </div>
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default Map;
