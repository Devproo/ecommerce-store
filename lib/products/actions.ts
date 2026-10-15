'use server';

import { Client, Storage, ID } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth0 } from '@/lib/auth0';
import {
  activateProduct,
  archiveProduct,
  createProduct,
  updateProduct,
} from '@/lib/products/service';

async function uploadProductImage(
  formData: FormData,
): Promise<string | undefined> {
  const image = formData.get('image');

  if (!(image instanceof File) || image.size === 0) {
    return undefined;
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  if (!allowedTypes.includes(image.type)) {
    throw new Error('Choose a JPEG, PNG, WebP, or GIF image.');
  }

  if (image.size > 5 * 1024 * 1024) {
    throw new Error('Image must be 5 MB or smaller.');
  }

  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT!)
    .setProject(process.env.APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);

  const storage = new Storage(client);

  const uploaded = await storage.createFile(
    process.env.APPWRITE_BUCKET_ID!,
    ID.unique(),
    InputFile.fromBuffer(Buffer.from(await image.arrayBuffer()), image.name),
  );

  return uploaded.$id;
}

export async function createProductAction(formData: FormData) {
  const session = await auth0.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  const name = String(formData.get('name') ?? '');
  const description = String(formData.get('description') ?? '');
  const price = Number(formData.get('price'));
  const stockQuantity = Number(formData.get('stockQuantity'));

  const imageFileId = await uploadProductImage(formData);

  const statusValue = String(formData.get('status') ?? 'draft');
  const status = statusValue === 'active' ? 'active' : 'draft';

  await createProduct({
    name,
    description,
    price,
    stockQuantity,
    sellerId: session.user.sub,
    currency: process.env.STORE_CURRENCY || 'USD',
    imageFileId,
    status,
  });

  revalidatePath('/dashboard');
  revalidatePath('/');

  redirect('/dashboard');
}

export async function activateProductAction(formData: FormData) {
  const session = await auth0.getSession();
  if (!session) redirect('/auth/login');

  await activateProduct(String(formData.get('id') ?? ''));

  revalidatePath('/dashboard');
  revalidatePath('/');
}

export async function archiveProductAction(formData: FormData) {
  const session = await auth0.getSession();
  if (!session) redirect('/auth/login');

  await archiveProduct(String(formData.get('id') ?? ''));

  revalidatePath('/dashboard');
  revalidatePath('/');
}

export async function updateProductAction(formData: FormData) {
  const session = await auth0.getSession();
  if (!session) redirect('/auth/login');

  const id = String(formData.get('id') ?? '');
  const name = String(formData.get('name') ?? '');
  const description = String(formData.get('description') ?? '');
  const price = Number(formData.get('price'));
  const stockQuantity = Number(formData.get('stockQuantity'));

  const imageFileId = await uploadProductImage(formData);

  await updateProduct(id, {
    name,
    description,
    price,
    stockQuantity,
    ...(imageFileId ? { imageFileId } : {}),
  });

  revalidatePath('/dashboard');
  revalidatePath('/');
  redirect('/dashboard');
}
