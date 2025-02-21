'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { writeFile } from 'fs/promises';
import path from 'path';

// Helper function to handle image upload
async function saveImage(image: File): Promise<string> {
  const bytes = await image.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create unique filename
  const filename = `${Date.now()}-${image.name}`;
  const imagePath = path.join(
    process.cwd(),
    'public',
    'images',
    'product',
    filename
  );

  // Save the file
  await writeFile(imagePath, buffer);
  return `/images/product/${filename}`;
}

// Create a new product
export async function createProduct(data: {
  name: string;
  price: number;
  description: string;
  image: File | null; // Allow null here to avoid TypeScript errors
  specification: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error('Unauthorized');

  if (data.price < 0 || isNaN(data.price)) {
    throw new Error('Invalid price. Price must be a positive number.');
  }

  if (!data.image) {
    throw new Error('Product image is required.');
  }

  const imageUrl = await saveImage(data.image);

  return await prisma.product.create({
    data: {
      name: data.name,
      price: data.price,
      description: data.description,
      image: imageUrl,
      specification: data.specification,
    },
  });
}

// Get single product
export async function getProductById(id: string) {
  return await prisma.product.findUnique({
    where: { id },
  });
}

// Update product
export type ProductUpdate = {
  name?: string;
  price?: number;
  description?: string;
  image?: File | string;
  specification?: string;
};

export async function updateProduct(id: string, data: ProductUpdate) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error('Unauthorized');

  const updateData: Record<string, any> = { ...data };

  if (data.image instanceof File) {
    updateData.image = await saveImage(data.image);
  }

  if (data.price !== undefined) {
    if (data.price < 0 || isNaN(data.price)) {
      throw new Error('Invalid price. Price must be a positive number.');
    }
    updateData.price = data.price;
  }

  return await prisma.product.update({
    where: { id },
    data: updateData,
  });
}

// Delete product
export async function deleteProduct(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error('Unauthorized');

  return await prisma.product.delete({
    where: { id },
  });
}

// Get all products
export async function getProducts() {
  return await prisma.product.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
}
