'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct } from '@/app/actions/productAction';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast, { Toaster } from 'react-hot-toast';
import { Loader2, Upload } from 'lucide-react';
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

// Updated FormData interface
interface FormData {
  name: string;
  price: number;
  description: string;
  specification: string;
  image: File | null;
}

export default function AddProductForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    price: 0,
    description: '',
    specification: '',
    image: null,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Handle Kobo - store price as integer (Kobo)
    const priceInKobo = Math.round(parseFloat(value) * 100);
    if (!isNaN(priceInKobo) && priceInKobo >= 0) {
      setFormData((prev) => ({ ...prev, price: priceInKobo }));
    } else {
      toast.error(
        'Price must be a valid number and greater than or equal to 0'
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (
      !formData.name ||
      formData.price < 0 ||
      !formData.description ||
      !formData.image ||
      !formData.specification
    ) {
      toast.error('Please complete all fields');
      setLoading(false);
      return;
    }

    try {
      await createProduct(formData);
      toast.success('Product added successfully');
      router.push('/admin/products');
    } catch (error) {
      toast.error('Failed to add product');
      console.error('Error adding product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-6">
      <Toaster position="top-center" reverseOrder={false} />
      {/* Product Name */}
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Product</h2>
      <div className="mb-4">
        <label
          htmlFor="product-name"
          className="block text-sm font-medium mb-2"
        >
          Product Name
        </label>
        <Input
          id="product-name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="Enter product name"
          required
        />
      </div>

      {/* Product Price */}
      <div className="mb-4">
        <label
          htmlFor="product-price"
          className="block text-sm font-medium mb-2"
        >
          Product Price (₦)
        </label>
        <Input
          id="product-price"
          type="number"
          step="0.01"
          min="0"
          value={formData.price / 100}
          onChange={handlePriceChange}
          placeholder="Enter price (e.g. 99.99)"
          required
        />
        <p className="text-sm text-gray-500">
          Displayed price: ₦{(formData.price / 100).toFixed(2)} (stored as{' '}
          {formData.price} kobo)
        </p>
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Description</label>
        <RichTextEditor
          initialValue=""
          onChange={(content) =>
            setFormData((prev) => ({ ...prev, description: content }))
          }
          headerBackground="bg-blue-50"
          headerTextColor="text-blue-700"
        />
      </div>

      {/* Specification */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Specification</label>
        <RichTextEditor
          initialValue=""
          onChange={(content) =>
            setFormData((prev) => ({ ...prev, specification: content }))
          }
          headerBackground="bg-green-50"
          headerTextColor="text-green-700"
        />
      </div>

      {/* Product Image */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Product Image</label>
        <div className="flex items-center gap-4">
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <Upload className="w-5 h-5" />
            Choose Image
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

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
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
              Adding Product...
            </>
          ) : (
            'Add Product'
          )}
        </Button>
      </div>
    </form>
  );
}
