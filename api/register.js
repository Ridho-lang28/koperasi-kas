import { getDb } from './db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const db = await getDb();
    const { nama, username, password } = req.body;

    if (!nama || !username || !password) return res.status(400).json({ error: 'Semua field wajib diisi' });

    const [existing] = await db.execute('SELECT id_admin FROM admin WHERE username = ?', [username]);
    if (existing.length > 0) return res.status(409).json({ error: 'Username sudah dipakai' });

    await db.execute('INSERT INTO admin (nama, username, password, role) VALUES (?, ?, ?, ?)', [nama, username, password, 'admin']);

    return res.status(201).json({ success: true, message: 'Registrasi berhasil' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Gagal mendaftar' });
  }
}