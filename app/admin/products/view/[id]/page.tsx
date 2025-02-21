'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { getProductById } from '@/app/actions/productAction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import toast, { Toaster } from 'react-hot-toast';
import PageLoader from '@/components/PageLoader';

interface Product {
  id: string;
  name: string;
  description: string;
  specification: string;
  price: number;
  image: string;
  createdAt: string;
}

interface ViewProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ViewProductPage({ params }: ViewProductPageProps) {
  const resolvedParams = React.use(params);
  const productId = resolvedParams.id;

  const [product, setProduct] = React.useState<Product | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(productId);

        if (!data) {
          throw new Error('Product not found');
        }

        setProduct({
          id: data.id || '',
          name: data.name || 'No name available',
          description: data.description || 'No description available',
          specification: data.specification || 'No specifications available',
          price: data.price ?? 0, // Use nullish coalescing for numbers
          image: data.image || '',
          createdAt: data.createdAt || new Date().toISOString(),
        });
      } catch (error) {
        toast.error('Failed to fetch product');
        router.push('/admin/products');
      }
    };

    fetchProduct();
  }, [productId, router]);

  if (!product) {
    return <PageLoader />;
  }

  // Format price from cents to dollars
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price / 100);
  };

  return (
    <div className="container mx-auto py-6">
      <Toaster position="top-center" reverseOrder={false} />
      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center mb-6">
            <img
              src={product.image}
              alt={product.name}
              className="max-w-md rounded-lg shadow-lg"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <div className="text-xl font-semibold text-emerald-600">
                {formatPrice(product.price)}
              </div>
            </div>
            <div className="text-gray-500">
              Added on {new Date(product.createdAt).toLocaleDateString()}
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Description</h3>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Specifications</h3>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: product.specification }}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <Button
              variant="outline"
              onClick={() => router.push('/admin/products')}
            >
              Back to Products
            </Button>
            <Button
              onClick={() => router.push(`/admin/products/edit/${product.id}`)}
            >
              Edit Product
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
