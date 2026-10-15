type ProductCardProps = {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
};

export default function ProductCard({
  name,
  description,
  price,
  imageUrl,
}: ProductCardProps) {
  return (
    <article className='rounded-xl border p-4'>
      <div className='mb-4 flex h-40 items-center justify-center overflow-hidden rounded-lg bg-gray-100 text-gray-400'>
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={name}
            className='h-full w-full object-cover'
          />
        ) : (
          <span>Product image</span>
        )}
      </div>

      <h2 className='text-lg font-semibold'>{name}</h2>
      <p className='mt-1 text-sm text-gray-600'>{description}</p>

      <div className='mt-4 flex items-center justify-between'>
        <span className='font-semibold'>${price.toFixed(2)}</span>
        <button
          type='button'
          className='rounded-lg bg-black px-4 py-2 text-white'
        >
          View product
        </button>
      </div>
    </article>
  );
}
