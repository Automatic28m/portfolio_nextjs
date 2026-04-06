import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

// This prevents multiple connections during hot-reloading in development
const globalForMysql = global;

const getSslConfig = () => {
  const certPath = path.join(process.cwd(), 'src/certs/ca.pem');

  // Preferred for CI/CD: set cert text in env and preserve line breaks.
  if (process.env.MYSQL_SSL_CA) {
    return {
      ca: process.env.MYSQL_SSL_CA.replace(/\\n/g, '\n'),
    };
  }

  // Local development fallback when cert file exists in the repo/workspace.
  if (fs.existsSync(certPath)) {
    return {
      ca: fs.readFileSync(certPath, 'utf8'),
    };
  }

  // Avoid build-time crash when cert file is not available (e.g. Netlify).
  // Keeps TLS enabled but skips CA verification unless a CA is provided.
  return {
    rejectUnauthorized: false,
  };
};

const pool = () => {
  return mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: parseInt(process.env.MYSQL_PORT) || 18133,
    ssl: getSslConfig(),
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