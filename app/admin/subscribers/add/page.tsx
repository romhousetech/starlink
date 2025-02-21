'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Country, State } from 'country-state-city';
import { createSubscriber } from '@/app/actions/subscribersActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast, { Toaster } from 'react-hot-toast';

const Select = dynamic(() => import('react-select'), { ssr: false });

type SelectOption = { label: string; value: string };

// Common select styles
const selectStyles = {
  control: (provided: any) => ({
    ...provided,
    backgroundColor: '#1F2937',
    borderColor: '#4A4A4A',
    color: '#FFF',
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: '#FFF',
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: '#252525',
  }),
  option: (provided: any, state: { isFocused: boolean }) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#3498db' : 'transparent',
    color: '#FFF',
  }),
};

const convertToOptions = (
  data: any[],
  labelKey: string,
  valueKey: string
): SelectOption[] =>
  data.map((item) => ({ label: item[labelKey], value: item[valueKey] }));

export default function AddSubscriberForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    starlinkId: '',
    serialNumber: '',
    longitude: '',
    latitude: '',
    country: null as SelectOption | null,
    state: null as SelectOption | null,
    subscriptionDuration: 1,
  });

  const handleCountryChange = (newValue: unknown) => {
    const selectedCountry = newValue as SelectOption | null;
    setFormData({
      ...formData,
      country: selectedCountry,
      state: null,
    });
  };

  const handleStateChange = (newValue: unknown) => {
    const selectedState = newValue as SelectOption | null;
    setFormData({ ...formData, state: selectedState });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.country || !formData.state) {
      toast.error('Please select country and state');
      return;
    }

    try {
      await createSubscriber({
        starlinkId: formData.starlinkId,
        serialNumber: formData.serialNumber,
        longitude: parseFloat(formData.longitude),
        latitude: parseFloat(formData.latitude),
        active: true,
        country: formData.country.label,
        state: formData.state.label,
        subscriptionDuration: formData.subscriptionDuration,
      });

      toast.success('Subscriber added successfully');
      router.push('/admin/subscribers');
    } catch (error) {
      toast.error('Failed to add subscriber');
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-8 bg-gray-900 text-white rounded-lg shadow-lg"
      >
        <Toaster position="top-center" />
        <h2 className="text-2xl font-bold mb-6 text-center">
          Add New Subscriber
        </h2>

        {/* Starlink ID */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Starlink ID</label>
          <Input
            placeholder="Enter Starlink ID"
            value={formData.starlinkId}
            onChange={(e) =>
              setFormData({ ...formData, starlinkId: e.target.value })
            }
            required
          />
        </div>

        {/* Serial Number */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Serial Number
          </label>
          <Input
            placeholder="Enter Serial Number"
            value={formData.serialNumber}
            onChange={(e) =>
              setFormData({ ...formData, serialNumber: e.target.value })
            }
            required
          />
        </div>

        {/* Latitude & Longitude */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Latitude</label>
            <Input
              placeholder="Latitude"
              type="number"
              value={formData.latitude}
              onChange={(e) =>
                setFormData({ ...formData, latitude: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Longitude</label>
            <Input
              placeholder="Longitude"
              type="number"
              value={formData.longitude}
              onChange={(e) =>
                setFormData({ ...formData, longitude: e.target.value })
              }
              required
            />
          </div>
        </div>

        {/* Country Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Country</label>
          <Select
            id="country"
            options={convertToOptions(
              Country.getAllCountries(),
              'name',
              'isoCode'
            )}
            value={formData.country}
            onChange={handleCountryChange}
            styles={selectStyles}
          />
        </div>

        {/* State Selection */}
        {formData.country && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">State</label>
            <Select
              id="state"
              options={convertToOptions(
                State.getStatesOfCountry(formData.country.value),
                'name',
                'isoCode'
              )}
              value={formData.state}
              onChange={handleStateChange}
              styles={selectStyles}
            />
          </div>
        )}

        {/* Subscription Duration */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Subscription Duration (Months)
          </label>
          <Input
            type="number"
            value={formData.subscriptionDuration}
            onChange={(e) =>
              setFormData({
                ...formData,
                subscriptionDuration: parseInt(e.target.value, 10),
              })
            }
            min={1}
            required
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" className="mt-4 w-full py-2 text-lg">
          Add Subscriber
        </Button>
      </form>
    </div>
  );
}
