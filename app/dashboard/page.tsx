import { Suspense } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth0 } from '@/lib/auth0';
import { listAllProducts } from '@/lib/products/data';
import { archiveProductAction } from '@/lib/products/actions';
import ProductForm from '@/components/dashboard/product-form';
import ProductEditForm from '@/components/dashboard/product-edit-form';
import { formatPrice } from '@/lib/config/store';

async function DashboardContent() {
  const session = await auth0.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  const products = await listAllProducts();

  return (
    <main className='mx-auto max-w-5xl px-6 py-10'>
      <header className='flex flex-wrap items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold'>Store Dashboard</h1>
          <p className='mt-2 text-sm text-gray-600'>
            Signed in as {session.user.email}
          </p>
        </div>

        <div className='flex gap-4'>
          <Link
            href='/'
            className='rounded border px-4 py-2 text-sm'
          >
            View Store
          </Link>

          <a
            href='/auth/logout'
            className='rounded border px-4 py-2 text-sm'
          >
            Log Out
          </a>
        </div>
      </header>

      <section className='mt-10 rounded-lg border p-6'>
        <ProductForm />
      </section>

      <section className='mt-10'>
        <h2 className='text-2xl font-semibold'>Products</h2>

        {products.length === 0 ? (
          <p className='mt-4 text-gray-600'>
            No products yet. Add your first product above.
          </p>
        ) : (
          <div className='mt-4 space-y-4'>
            {products.map((product) => (
              <article
                key={product.id}
                className='rounded-lg border p-5'
              >
                <div className='flex flex-wrap items-start justify-between gap-4'>
                  <div>
                    <h3 className='text-lg font-semibold'>{product.name}</h3>

                    <p className='mt-1 text-sm text-gray-600'>
                      {product.description}
                    </p>
                  </div>

                  <span
                    className={`rounded px-3 py-1 text-sm font-medium capitalize ${
                      product.status === 'active'
                        ? 'bg-success text-success-foreground'
                        : product.status === 'draft'
                          ? 'bg-surface-secondary text-foreground'
                          : 'bg-danger text-danger-foreground'
                    }`}
                  >
                    {product.status.replace('_', ' ')}
                  </span>
                </div>

                <div className='mt-3 flex flex-wrap gap-4 text-sm'>
                  <p>Price: {formatPrice(product.price)}</p>
                  <p>Stock: {product.stockQuantity}</p>
                </div>

                <ProductEditForm product={product} />

                {product.status !== 'archived' && (
                  <div className='mt-3 flex gap-3'>
                    <form action={archiveProductAction}>
                      <input
                        type='hidden'
                        name='id'
                        value={product.id}
                      />

                      <button
                        type='submit'
                        className='rounded bg-red-600 px-3 py-2 text-sm text-white'
                      >
                        Archive
                      </button>
                    </form>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<p className='p-6'>Loading dashboard...</p>}>
      <DashboardContent />
    </Suspense>
  );
}
