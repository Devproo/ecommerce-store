import type { Product } from '@/lib/products/types';
import {
  activateProductAction,
  updateProductAction,
} from '@/lib/products/actions';

export default function ProductEditForm({ product }: { product: Product }) {
  if (product.status === 'archived') return null;

  return (
    <details className='mt-4'>
      <summary className='cursor-pointer text-sm font-medium text-primary'>
        Edit product
      </summary>

      <form
        action={updateProductAction}
        className='mt-4 space-y-3'
      >
        <input
          type='hidden'
          name='id'
          value={product.id}
        />

        <input
          name='name'
          defaultValue={product.name}
          required
          aria-label='Product name'
          className='w-full rounded-md px-3 py-2'
        />

        <textarea
          name='description'
          defaultValue={product.description}
          required
          aria-label='Product description'
          className='w-full rounded-md px-3 py-2'
        />

        <input
          name='price'
          type='number'
          min='0'
          step='0.01'
          defaultValue={product.price}
          required
          aria-label='Price'
          className='w-full rounded-md px-3 py-2'
        />

        <input
          name='stockQuantity'
          type='number'
          min='0'
          step='1'
          defaultValue={product.stockQuantity}
          required
          aria-label='Stock quantity'
          className='w-full rounded-md px-3 py-2'
        />

        <div className='space-y-2'>
          <label
            htmlFor='image'
            className='block text-sm font-medium'
          >
            Product image (optional)
          </label>
          <input
            id='image'
            name='image'
            type='file'
            accept='image/jpeg,image/png,image/webp,image/gif'
            className='w-full rounded-lg border p-3'
          />
          <p className='text-sm text-gray-500'>
            Choose an image to replace the current one. Leave empty to keep it.
            Maximum size: 5 MB.
          </p>
        </div>

        <div className='flex flex-wrap gap-3'>
          <button
            type='submit'
            className='rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover'
          >
            Save changes
          </button>

          {product.status === 'draft' && (
            <button
              type='submit'
              formAction={activateProductAction}
              formNoValidate
              className='rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white'
            >
              Activate
            </button>
          )}
        </div>
      </form>
    </details>
  );
}
