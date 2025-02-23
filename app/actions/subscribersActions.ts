'use server';

import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { addMonths, isBefore } from 'date-fns';

const prisma = new PrismaClient();

// Create a new subscriber
export async function createSubscriber(data: {
  starlinkId: string;
  serialNumber: string;
  longitude: number;
  latitude: number;
  active: boolean;
  country: string;
  state: string;
  subscriptionDuration: number;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error('Unauthorized');

  const subscriptionEndDate = addMonths(new Date(), data.subscriptionDuration);

  return await prisma.subscribersMapDistribution.create({
    data: {
      starlinkId: data.starlinkId,
      serialNumber: data.serialNumber,
      longitude: data.longitude,
      latitude: data.latitude,
      active: true,
      country: data.country,
      state: data.state,
      subscriptionEndDate,
    },
  });
}

// Update subscriber
export type SubscriberUpdate = {
  starlinkId?: string;
  serialNumber?: string;
  longitude?: number;
  latitude?: number;
  country?: string;
  state?: string;
  subscriptionDuration?: number;
};

export async function updateSubscriber(
  id: string,
  data: Partial<{
    starlinkId: string;
    serialNumber: string;
    longitude: number;
    latitude: number;
    active: boolean;
    country: string;
    state: string;
    subscriptionDuration: number;
    subscriptionEndDate: Date | null;
  }>
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error('Unauthorized');

  const updateData: any = { ...data };
  delete updateData.subscriptionDuration; // Remove subscriptionDuration from update data

  if (data.subscriptionDuration !== undefined) {
    updateData.subscriptionEndDate = addMonths(
      new Date(),
      data.subscriptionDuration
    );
  }

  return await prisma.subscribersMapDistribution.update({
    where: { id },
    data: updateData,
  });
}

// Delete subscriber
export async function deleteSubscriber(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error('Unauthorized');

  return await prisma.subscribersMapDistribution.delete({
    where: { id },
  });
}

// Activate Subscription
export async function activateSubscription(
  id: string,
  durationInMonths: number
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error('Unauthorized');

  const subscriptionEndDate = addMonths(new Date(), durationInMonths);

  return await prisma.subscribersMapDistribution.update({
    where: { id },
    data: { active: true, subscriptionEndDate },
  });
}

// Get subscribers and auto-deactivate expired ones
export async function getSubscribers() {
  const subscribers = await prisma.subscribersMapDistribution.findMany();

  const updatedSubscribers = await Promise.all(
    subscribers.map(async (sub) => {
      if (
        sub.active &&
        sub.subscriptionEndDate &&
        isBefore(new Date(), sub.subscriptionEndDate)
      ) {
        return sub; // Still active
      }

      return await prisma.subscribersMapDistribution.update({
        where: { id: sub.id },
        data: { active: false },
      });
    })
  );

  return updatedSubscribers;
}

//get subscriber by id
export async function getSubscriberById(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error('Unauthorized');

  const subscriber = await prisma.subscribersMapDistribution.findUnique({
    where: { id },
  });

  if (!subscriber) throw new Error('Subscriber not found');

  return subscriber;
}
