import * as SQLite from 'expo-sqlite';
import { DogApiBreed, BreedItem, GroupItem } from '../types/dog';

// Opens or creates the database synchronously
const db = SQLite.openDatabaseSync('tripare_dogs.db');

export const initDatabase = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS breeds (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      group_id TEXT,
      hypoallergenic INTEGER,
      data TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS groups (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sync_metadata (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
};

export const saveBreedsToDb = (breeds: DogApiBreed[]) => {
  const statement = db.prepareSync(
    'INSERT OR REPLACE INTO breeds (id, name, group_id, hypoallergenic, data) VALUES ($id, $name,$group_id, $hypoallergenic,$data)'
  );

  try {
    db.withTransactionSync(() => {
      for (const breed of breeds) {
        const groupId = breed.relationships?.group?.data?.id || null;
        statement.executeSync({
          $id: breed.id,
          $name: breed.attributes.name,
          $group_id: groupId,$hypoallergenic: breed.attributes.hypoallergenic ? 1 : 0,
          $data: JSON.stringify(breed),
        });
      }
    });
  } finally {
    statement.finalizeSync();
  }
};

export const getBreedsFromDb = (): BreedItem[] => {
  const result = db.getAllSync<{ id: string; name: string; group_id: string; hypoallergenic: number; data: string }>(
    'SELECT * FROM breeds ORDER BY name ASC'
  );

  return result.map((row) => ({
    id: row.id,
    name: row.name,
    groupId: row.group_id,
    hypoallergenic: row.hypoallergenic === 1,
    description: JSON.parse(row.data).attributes.description,
    rawAttributes: JSON.parse(row.data).attributes,
  }));
};

export const saveGroupsToDb = (groups: GroupItem[]) => {
  const statement = db.prepareSync('INSERT OR REPLACE INTO groups (id, name) VALUES ($id, $name)');
  try {
    db.withTransactionSync(() => {
      groups.forEach((group) => statement.executeSync({ $id: group.id, $name: group.name }));
    });
  } finally {
    statement.finalizeSync();
  }
};

export const getGroupsFromDb = (): GroupItem[] => db.getAllSync<GroupItem>('SELECT id, name FROM groups ORDER BY name ASC');

export const setSyncTimestamp = (timestamp: string) => {
  db.runSync('INSERT OR REPLACE INTO sync_metadata (key, value) VALUES ($key, $value)', {
    $key: 'lastSyncedAt',
    $value: timestamp,
  });
};

export const getSyncTimestamp = (): string | null => {
  const row = db.getFirstSync<{ value: string }>('SELECT value FROM sync_metadata WHERE key = $key', { $key: 'lastSyncedAt' });
  return row?.value ?? null;
};