import { getDb } from './db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const db = await getDb();
    const { username, password } = req.body;

    if (!username || !password) return res.status(400).json({ error: 'Isi username & password' });

    const [rows] = await db.execute('SELECT * FROM admin WHERE username = ?', [username]);
    
    if (rows.length === 0) return res.status(404).json({ error: 'User tidak ditemukan' });

    const user = rows[0];
    // Plain text comparison
    if (password !== user.password) return res.status(401).json({ error: 'Password salah' });

    return res.status(200).json({ 
      success: true, 
      data: { id: user.id_admin, nama: user.nama, role: user.role } 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
}