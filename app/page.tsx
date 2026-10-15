import { Suspense } from 'react';
import { auth0 } from '@/lib/auth0';
import ProductCard from '@/components/store/product-card';
import Link from 'next/link';

import { getProductImageUrl } from '@/lib/products/image';

import { getProducts } from '@/lib/products/data';

async function HomeContent() {
  const session = await auth0.getSession();
  const products = await getProducts();
  return (
    <main className='mx-auto max-w-6xl px-6 py-8'>
      <header className='flex items-center justify-between gap-4'>
        <Link
          href='/'
          className='text-2xl font-bold'
        >
          E-commerce Store
        </Link>

        {session ? (
          <div className='flex items-center gap-4'>
            <span className='hidden text-sm sm:inline'>
              {session.user.email}
            </span>
            <Link
              href='/auth/logout'
              className='underline'
            >
              Logout
            </Link>
          </div>
        ) : (
          <nav className='flex gap-4'>
            <Link
              href='/auth/login'
              className='underline'
            >
              Login
            </Link>
            <Link
              href='/auth/login?screen_hint=signup'
              className='underline'
            >
              Sign up
            </Link>
          </nav>
        )}
      </header>

      <section className='py-12'>
        <h1 className='text-4xl font-bold'>Our Products</h1>
        <p className='mt-3 text-gray-600'>
          Discover our collection of everyday essentials.
        </p>
      </section>

      <section className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            description={product.description}
            price={product.price}
            imageUrl={
              product.imageFileId
                ? getProductImageUrl(product.imageFileId)
                : undefined
            }
          />
        ))}
      </section>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<p className='p-8'>Loading store...</p>}>
      <HomeContent />
    </Suspense>
  );
}
