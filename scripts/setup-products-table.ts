import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

import { Client, TablesDB } from 'node-appwrite';

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT!)
  .setProject(process.env.APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

const tablesDB = new TablesDB(client);

const databaseId = process.env.APPWRITE_DATABASE_ID!;
const tableId = process.env.APPWRITE_PRODUCTS_COLLECTION_ID!;

async function main() {
  const columns = [
    () => tablesDB.createVarcharColumn(databaseId, tableId, 'name', 255, true),
    () =>
      tablesDB.createVarcharColumn(
        databaseId,
        tableId,
        'description',
        1000,
        true,
      ),
    () => tablesDB.createFloatColumn(databaseId, tableId, 'price', true, 0),
    () =>
      tablesDB.createIntegerColumn(
        databaseId,
        tableId,
        'stockQuantity',
        true,
        0,
      ),
    () =>
      tablesDB.createEnumColumn(
        databaseId,
        tableId,
        'status',
        ['draft', 'active', 'archived'],
        true,
      ),
    () =>
      tablesDB.createVarcharColumn(databaseId, tableId, 'createdAt', 40, true),
    () =>
      tablesDB.createVarcharColumn(databaseId, tableId, 'updatedAt', 40, true),
  ];

  for (const createColumn of columns) {
    try {
      const column = await createColumn();
      console.log(`Created column: ${column.key}`);
    } catch (error) {
      console.error('Column creation failed:', error);
      throw error;
    }
  }

  console.log('Products table setup complete.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
