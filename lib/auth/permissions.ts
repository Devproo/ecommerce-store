import { auth0 } from '@/lib/auth0';
import { redirect } from 'next/navigation';
import type { UserRole } from '@/lib/products/types';

export async function requireRole(allowedRoles: UserRole[]) {
  const session = await auth0.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  // Role lookup is not implemented yet.
  // Do not use this helper to enforce role-specific access yet.
  void allowedRoles;

  return session;
}
