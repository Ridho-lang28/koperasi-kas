import { getDb } from './db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    console.log('📥 Register request received:', req.body);
    
    const db = await getDb();
    const { nama, username, password } = req.body;

    if (!nama || !username || !password) {
      return res.status(400).json({ error: 'Semua field wajib diisi' });
    }

    console.log(' Checking existing user...');
    const [existing] = await db.execute('SELECT id_admin FROM admin WHERE username = ?', [username]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Username sudah dipakai' });
    }

    console.log('💾 Inserting new user...');
    const [result] = await db.execute(
      'INSERT INTO admin (nama, username, password, role) VALUES (?, ?, ?, ?)', 
      [nama, username, password, 'admin']
    );
    
    console.log('✅ User inserted with ID:', result.insertId);

    return res.status(201).json({ success: true, message: 'Registrasi berhasil' });

  } catch (error) {
    console.error('❌ REGISTER ERROR:', error.message);
    console.error('Full error:', error);
    return res.status(500).json({ 
      error: 'Gagal mendaftar', 
      detail: error.message // <-- KIRIM DETAIL ERROR KE FRONTEND
    });
  }
}
