import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

 const pool = new Pool({
    user : process.env.DB_USER,
    host : process.env.DB_HOST,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
})

pool.connect()
.then(() => console.log('Connected to Postgres successfully'))
.catch((err) => console.error('Error connecting to database', err.stack))

export default pool;