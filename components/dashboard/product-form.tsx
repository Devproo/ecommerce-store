import { createProductAction } from '@/lib/products/actions';

export default function ProductForm() {
  return (
    <form
      action={createProductAction}
      className='mt-6 space-y-4'
    >
      <h2 className='text-xl font-semibold'>Add Product</h2>

      <input
        name='name'
        className='w-full rounded-lg border p-3'
        placeholder='Product name'
        required
      />

      <textarea
        name='description'
        className='w-full rounded-lg border p-3'
        placeholder='Description'
        required
      />

      <div className='grid gap-4 sm:grid-cols-2'>
        <input
          name='price'
          className='w-full rounded-lg border p-3'
          type='number'
          min='0'
          step='0.01'
          placeholder='Price'
          required
        />

        <input
          name='stockQuantity'
          className='w-full rounded-lg border p-3'
          type='number'
          min='0'
          step='1'
          placeholder='Stock quantity'
          required
        />
      </div>

      <div>
        <label
          htmlFor='image'
          className='mb-2 block text-sm font-medium'
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
        <p className='mt-1 text-sm text-gray-500'>
          JPEG, PNG, WebP, or GIF. Maximum 5 MB.
        </p>
      </div>

      <button
        className='rounded-lg bg-black px-5 py-3 text-white'
        type='submit'
      >
        Add Product
      </button>

      <div className='space-y-2'>
        <label
          htmlFor='status'
          className='block text-sm font-medium'
        >
          Product status
        </label>
        <select
          id='status'
          name='status'
          defaultValue='draft'
          className='w-full rounded-lg border p-3'
        >
          <option value='draft'>Save as draft</option>
          <option value='active'>Activate and publish</option>
        </select>
      </div>
    </form>
  );
}
