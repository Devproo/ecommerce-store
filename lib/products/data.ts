import 'server-only';

import { Client, TablesDB, type Models } from 'node-appwrite';
import type { Product } from './types';

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT!)
  .setProject(process.env.APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

const tablesDB = new TablesDB(client);
const databaseId = process.env.APPWRITE_DATABASE_ID!;
const tableId = process.env.APPWRITE_PRODUCTS_COLLECTION_ID!;

type ProductRow = Models.Row & {
  sellerId: string;
  currency: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  status: Product['status'];
  createdAt: string;
  updatedAt: string;
  imageFileId?: string;
};

function toProduct(row: ProductRow): Product {
  return {
    id: row.$id,
    sellerId: row.sellerId,
    currency: row.currency,
    name: row.name,
    description: row.description,
    price: row.price,
    stockQuantity: row.stockQuantity,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    imageFileId: row.imageFileId || undefined,
  };
}

export async function listAllProducts(): Promise<Product[]> {
  const result = await tablesDB.listRows<ProductRow>(databaseId, tableId);

  return result.rows.map(toProduct);
}

export async function getProducts(): Promise<Product[]> {
  const products = await listAllProducts();

  return products.filter((product) => product.status === 'active');
}

export async function getProductById(id: string): Promise<Product | undefined> {
  try {
    const row = await tablesDB.getRow<ProductRow>(databaseId, tableId, id);

    const product = toProduct(row);

    return product.status === 'active' ? product : undefined;
  } catch {
    return undefined;
  }
}

export async function saveProduct(product: Product): Promise<void> {
  await tablesDB.upsertRow(databaseId, tableId, product.id, {
    sellerId: product.sellerId,
    currency: product.currency,
    name: product.name,
    description: product.description,
    price: product.price,
    stockQuantity: product.stockQuantity,
    status: product.status,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    imageFileId: product.imageFileId ?? '',
  });
}
