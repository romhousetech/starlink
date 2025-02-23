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
  state: string; // Removed null possibility to match the defined type
  subscriptionEndDate: Date | null;
};

type StateStats = {
  [key: string]: {
    active: number;
    inactive: number;
  };
};

// Fix 1: Move icon definition inside component to avoid SSR issues
const Map = () => {
  // Create custom icons for active and inactive subscribers
  const activeIcon = React.useMemo(
    () =>
      new L.Icon({
        iconUrl: '/images/green-pointer.svg',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      }),
    []
  );

  const inactiveIcon = React.useMemo(
    () =>
      new L.Icon({
        iconUrl: '/images/red-pointer.svg',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      }),
    []
  );

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
        // Fix type error: Map the data to ensure state is never null
        const typedData: Subscriber[] = data.map((sub: any) => ({
          ...sub,
          state: sub.state || 'Unknown', // Provide default value for null states
        }));

        setSubscribers(typedData);
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

  // Fix 2: Define map center as a LatLngExpression
  const defaultCenter: [number, number] = [10, 10];

  return (
    <div className="relative w-full mt-6">
      {/* Filter Bar */}
      <div className="absolute z-10 bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col md:flex-row gap-4 items-center bg-gray-800 p-2 rounded-lg shadow-lg w-fit text-xs">
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
        // Fix 3: Use proper typing for MapContainer props
        <MapContainer
          center={defaultCenter}
          zoom={2}
          style={{
            height: '70vh',
            width: '100%',
            zIndex: 1,
            overflow: 'auto',
          }}
          scrollWheelZoom={false}
          doubleClickZoom={false}
          dragging={true}
          touchZoom={false}
          boxZoom={false}
          keyboard={false}
        >
          {/* Fix 4: Fix the TileLayer attribution */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CartoDB</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          {filteredSubscribers.map((sub) => (
            // Fix 5: Fix Marker props
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
              {/* Fix 6: Fix Tooltip props */}
              <Tooltip
                permanent={false}
                direction="top"
                offset={[0, -10]}
                opacity={1}
              >
                <div className="bg-gray-700 text-white p-2 rounded text-sm shadow-lg">
                  <strong>
                    {sub.state}, {sub.country}
                  </strong>
                  <br />
                  {sub.starlinkId} | {sub.serialNumber}
                  <br />
                  Active: {stateStats[sub.state]?.active || 0} | Inactive:{' '}
                  {stateStats[sub.state]?.inactive || 0}
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
