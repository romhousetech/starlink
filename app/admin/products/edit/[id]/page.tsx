'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import toast, { Toaster } from 'react-hot-toast';
import { getProductById, updateProduct } from '@/app/actions/productAction';
import type { ProductUpdate } from '@/app/actions/productAction';
import PageLoader from '@/components/PageLoader';
import { Upload, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

// Import RichTextEditor dynamically to avoid SSR issues
const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="border rounded-md p-4 min-h-[200px] bg-gray-50">
      Loading editor...
    </div>
  ),
});

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface ProductData {
  id: string;
  name: string;
  description: string;
  specification: string;
  price: number;
  image: string;
  newImage?: File;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const resolvedParams = React.use(params);
  const productId = resolvedParams.id;

  const [product, setProduct] = React.useState<ProductData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(productId);
        setProduct({
          ...data,
          price: data.price || 0,
        });
        setImagePreview(data.image);
      } catch (error) {
        toast.error('Failed to fetch product data');
        router.push('/admin/products');
      }
    };

    fetchProduct();
  }, [productId, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && product) {
      setProduct({ ...product, newImage: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (product && !isNaN(value) && value >= 0) {
      // Store price in cents
      const priceInCents = Math.round(value * 100);
      setProduct({ ...product, price: priceInCents });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setLoading(true);

    try {
      const updateData: ProductUpdate = {
        name: product.name,
        description: product.description,
        specification: product.specification,
        price: product.price,
      };

      if (product.newImage) {
        updateData.image = product.newImage;
      }

      await updateProduct(productId, updateData);
      toast.success('Product updated successfully');
      router.push('/admin/products');
    } catch (error) {
      toast.error('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return <PageLoader />;
  }

  return (
    <div className="container mx-auto py-6">
      <Toaster position="top-center" reverseOrder={false} />
      <Card>
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-lg font-medium">
                Product Name
              </label>
              <Input
                id="name"
                value={product.name}
                onChange={(e) =>
                  setProduct({ ...product, name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="price" className="text-lg font-medium">
                Price ($)
              </label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={(product.price / 100).toFixed(2)}
                onChange={handlePriceChange}
                required
                placeholder="Enter price (e.g. 99.99)"
              />
              <p className="text-sm text-gray-500">
                Current price: ${(product.price / 100).toFixed(2)} (stored as{' '}
                {product.price} cents)
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-lg font-medium">Description</label>
              <RichTextEditor
                initialValue={product.description}
                onChange={(value) =>
                  setProduct({ ...product, description: value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-lg font-medium">Specification</label>
              <RichTextEditor
                initialValue={product.specification}
                onChange={(value) =>
                  setProduct({ ...product, specification: value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-lg font-medium">Product Image</label>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  Change Image
                </label>
                {imagePreview && (
                  <div className="relative w-32 h-32">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/products')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
