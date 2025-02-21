'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Create new user (Admin Only)
export async function createUser(
  name: string,
  email: string,
  password: string,
  role: 'ADMIN' | 'STAFF'
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return await prisma.user.create({
    data: { name, email, password: hashedPassword, role },
  });
}

// Update user (Admin Only)
export async function updateUser(
  id: string,
  name: string,
  email: string,
  role: 'ADMIN' | 'STAFF'
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  return await prisma.user.update({
    where: { id },
    data: { name, email, role },
  });
}

// Reset user password (Admin Only)
export async function resetUserPassword(id: string, newPassword: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  return await prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
  });
}

// Fetch all users
export async function getUsers() {
  return await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
  });
}

// Delete user (Admin Only)
export async function deleteUser(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  return await prisma.user.delete({ where: { id } });
}
