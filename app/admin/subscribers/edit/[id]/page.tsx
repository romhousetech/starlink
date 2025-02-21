'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Country, State, ICountry, IState } from 'country-state-city';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import toast from 'react-hot-toast';
import {
  getSubscriberById,
  updateSubscriber,
} from '@/app/actions/subscribersActions';
import type { SubscriberUpdate } from '@/app/actions/subscribersActions';
import PageLoader from '@/components/PageLoader';

interface EditSubscriberPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditSubscriberPage({
  params,
}: EditSubscriberPageProps) {
  const resolvedParams = React.use(params);
  const subscriberId = resolvedParams.id;

  const [subscriber, setSubscriber] = React.useState<any>(null);
  const [countries, setCountries] = React.useState<ICountry[]>([]);
  const [states, setStates] = React.useState<IState[]>([]);
  const [selectedCountry, setSelectedCountry] = React.useState<ICountry | null>(
    null
  );
  const [subscriptionDuration, setSubscriptionDuration] =
    React.useState<number>();

  const router = useRouter();

  React.useEffect(() => {
    const fetchSubscriber = async () => {
      try {
        const data = await getSubscriberById(subscriberId);
        setSubscriber(data);

        const allCountries = Country.getAllCountries();
        setCountries(allCountries);

        if (data.country) {
          const country = allCountries.find((c) => c.name === data.country);
          if (country) {
            setSelectedCountry(country);
            const statesList = State.getStatesOfCountry(country.isoCode);
            setStates(statesList);
          }
        }
      } catch (error) {
        toast.error('Failed to fetch subscriber data');
        router.push('/admin/subscribers');
      }
    };

    fetchSubscriber();
  }, [subscriberId, router]);

  const handleCountryChange = (countryName: string) => {
    if (!subscriber) return;

    const country = countries.find((c) => c.name === countryName);
    if (country) {
      setSelectedCountry(country);
      const statesList = State.getStatesOfCountry(country.isoCode);
      setStates(statesList);
      setSubscriber({ ...subscriber, country: countryName, state: '' });
    }
  };

  const handleStateChange = (stateName: string) => {
    if (!subscriber) return;
    setSubscriber({ ...subscriber, state: stateName });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscriber) return;

    try {
      const updateData: SubscriberUpdate = {
        starlinkId: subscriber.starlinkId,
        serialNumber: subscriber.serialNumber,
        longitude: subscriber.longitude,
        latitude: subscriber.latitude,
        country: subscriber.country,
        state: subscriber.state,
        subscriptionDuration,
      };
      if (subscriptionDuration) {
        updateData.subscriptionDuration = subscriptionDuration;
      }
      await updateSubscriber(subscriberId, updateData);
      toast.success('Subscriber updated successfully');
      router.push('/admin/subscribers');
    } catch (error) {
      toast.error('Failed to update subscriber');
    }
  };

  if (!subscriber) {
    return (
      <div>
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Subscriber</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <label htmlFor="starlinkId">Starlink ID</label>
              <Input
                id="starlinkId"
                value={subscriber.starlinkId}
                onChange={(e) =>
                  setSubscriber({ ...subscriber, starlinkId: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="serialNumber">Serial Number</label>
              <Input
                id="serialNumber"
                value={subscriber.serialNumber}
                onChange={(e) =>
                  setSubscriber({ ...subscriber, serialNumber: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="longitude">Longitude</label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.000001"
                  value={subscriber.longitude}
                  onChange={(e) =>
                    setSubscriber({
                      ...subscriber,
                      longitude: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="latitude">Latitude</label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.000001"
                  value={subscriber.latitude}
                  onChange={(e) =>
                    setSubscriber({
                      ...subscriber,
                      latitude: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="country">Country</label>
              <Select
                value={subscriber.country}
                onValueChange={handleCountryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent className="bg-slate-600">
                  {countries.map((country) => (
                    <SelectItem
                      key={country.isoCode}
                      value={country.name}
                      className="hover:bg-slate-500"
                    >
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <label htmlFor="state">State/Province</label>
              <Select
                value={subscriber.state}
                onValueChange={handleStateChange}
                disabled={!selectedCountry || states.length === 0}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      states.length === 0
                        ? 'No states available'
                        : 'Select state'
                    }
                  />
                </SelectTrigger>
                <SelectContent className="bg-slate-600">
                  {states.map((state) => (
                    <SelectItem
                      key={state.isoCode}
                      value={state.name}
                      className="hover:bg-slate-500"
                    >
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <label htmlFor="subscriptionDuration">
                Extend Subscription (months)
              </label>
              <Input
                id="subscriptionDuration"
                type="number"
                min="1"
                placeholder="Enter number of months"
                onChange={(e) =>
                  setSubscriptionDuration(
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/subscribers')}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
