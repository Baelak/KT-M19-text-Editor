import { openDB } from 'idb';

// Initialize the IndexedDB
const initDb = async () => {
  openDB('kate', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('kate')) {
        console.log('kate database already exists');
        return;
      }
      db.createObjectStore('kate', { keyPath: 'id', autoIncrement: true });
      console.log('kate database created');
    },
  });
};

// Function to put data into the database
export const putDb = async (content) => {
  const kateDb = await openDB('kate', 1);
  const tx = kateDb.transaction('kate', 'readwrite');
  const store = tx.objectStore('kate');
  const request = store.put({ id: 1, value: content });
  const result = await request;
  console.log('Data saved to the database', result);
};

// Function to get data from the database
export const getDb = async () => {
  const kateDb = await openDB('kate', 1);
  const tx = kateDb.transaction('kate', 'readonly');
  const store = tx.objectStore('kate');
  const request = store.get(1);
  const result = await request;
  console.log('Data retrieved from the database', result);
  return result?.value;
};

// Call initDb to initialize the database
initDb();
