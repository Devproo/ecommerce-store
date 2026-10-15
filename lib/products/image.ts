import 'server-only';

export function getProductImageUrl(fileId: string): string {
  const endpoint = process.env.APPWRITE_ENDPOINT!;
  const projectId = process.env.APPWRITE_PROJECT_ID!;
  const bucketId = process.env.APPWRITE_BUCKET_ID!;

  return `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`;
}
