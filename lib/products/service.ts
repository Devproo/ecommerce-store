import type { CreateProductInput, Product } from './types';
import { validateProduct } from './types';
import { listAllProducts, saveProduct } from './data';

export async function createProduct(
  input: CreateProductInput & {
    sellerId: string;
    currency: string;
    imageFileId?: string;
    status?: 'draft' | 'active';
  },
): Promise<Product> {
  validateProduct(input);

  const now = new Date().toISOString();

  const product: Product = {
    id: crypto.randomUUID(),
    ...input,
    status: input.status ?? 'draft',
    createdAt: now,
    updatedAt: now,
  };

  await saveProduct(product);
  return product;
}

export async function updateProduct(
  id: string,
  input: CreateProductInput & { imageFileId?: string },
): Promise<Product> {
  validateProduct(input);

  const existing = (await listAllProducts()).find(
    (product) => product.id === id,
  );

  if (!existing || existing.status === 'archived') {
    throw new Error('Product not found or archived.');
  }

  const updated: Product = {
    ...existing,
    ...input,
    ...(input.imageFileId ? { imageFileId: input.imageFileId } : {}),
    updatedAt: new Date().toISOString(),
  };

  await saveProduct(updated);

  return updated;
}

export async function archiveProduct(id: string): Promise<void> {
  const existing = (await listAllProducts()).find(
    (product) => product.id === id,
  );

  if (!existing || existing.status === 'archived') {
    throw new Error('Product not found or already archived.');
  }

  await saveProduct({
    ...existing,
    status: 'archived',
    updatedAt: new Date().toISOString(),
  });
}

export async function activateProduct(id: string): Promise<void> {
  const existing = (await listAllProducts()).find(
    (product) => product.id === id,
  );

  if (!existing || existing.status === 'archived') {
    throw new Error('Product not found or archived.');
  }

  await saveProduct({
    ...existing,
    status: 'active',
    updatedAt: new Date().toISOString(),
  });
}
