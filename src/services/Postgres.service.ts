import { Pool } from 'pg';

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

db.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  db.connect((error) => {
    if (error) {
      console.error('Error reconnecting to the database', error);
    } else {
      console.log('Successfully reconnected to the database');
    }
  });
});