import * as SQLite from 'expo-sqlite';
import { DogApiBreed, BreedItem } from '../types/dog';

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