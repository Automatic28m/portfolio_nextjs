import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

// This prevents multiple connections during hot-reloading in development
const globalForMysql = global;

const pool = () => {
  return mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: parseInt(process.env.MYSQL_PORT) || 18133,
    ssl: {
      // Use process.cwd() to ensure it finds the cert relative to the project root
      ca: fs.readFileSync(path.join(process.cwd(), 'src/certs/ca.pem')),
    },
    waitForConnections: true,
    connectionLimit: 10,
    enableKeepAlive: true,
    queueLimit: 0
  });
};

// If we are in development, use the global variable so the pool is reused.
// In production, we just create a new pool.
export const db = globalForMysql.mysqlPool || pool();

if (process.env.NODE_ENV !== 'production') {
  globalForMysql.mysqlPool = db;
}