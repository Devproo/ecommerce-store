export type ProductStatus = 'draft' | 'active' | 'archived';

export type UserRole = 'admin' | 'seller' | 'customer';

export type Product = {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  stockQuantity: number;
  imageFileId?: string;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateProductInput = {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
};

export function validateProduct(input: CreateProductInput) {
  if (!input.name.trim()) {
    throw new Error('Product name is required.');
  }

  if (!Number.isFinite(input.price) || input.price < 0) {
    throw new Error('Price must be a non-negative number.');
  }

  if (!Number.isInteger(input.stockQuantity) || input.stockQuantity < 0) {
    throw new Error('Stock must be a non-negative integer.');
  }
}
