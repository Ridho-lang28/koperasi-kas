import mysql from 'mysql2/promise';

let connection;

export async function getDb() {
  if (!connection) {
    try {
      connection = await mysql.createConnection({
        host: 'gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com',
        user: '4HiqgjKudvGuqfv.root',
        password: '48eiuraXTfE9aQ2y',
        database: 'koperasikas_db',
        port: 4000,
        ssl: {
          rejectUnauthorized: false // <-- UBAH JADI FALSE BIAR COMPATIBLE SAMA VERCEL
        },
        connectTimeout: 10000 // <-- TAMBAH TIMEOUT BIAR GAK HANG
      });
      
      // Test koneksi langsung saat dibuat
      await connection.ping();
      console.log('✅ Connected to TiDB successfully');
      
    } catch (err) {
      console.error('❌ Failed to connect to TiDB:', err.message);
      throw err; // <-- LEMPAR ERROR BIAR REGISTER TAHU KONEKSI GAGAL
    }
  }
  return connection;
}
