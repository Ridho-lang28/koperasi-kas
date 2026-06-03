import mysql from 'mysql2/promise';

let connection;

export async function getDb() {
  if (!connection) {
    connection = await mysql.createConnection({
      host: 'gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com',
      user: '4HiqgjKudvGuqfv.root',
      password: '48eiuraXTfE9aQ2y', // Password Baru Kamu
      database: 'koperasikas_db',
      port: 4000,
      ssl: { rejectUnauthorized: true }
    });
  }
  return connection;
}