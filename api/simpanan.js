import { getDb } from './db.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const db = await getDb();
      const { id_anggota, jenis, jumlah, tanggal } = req.body;
      
      await db.execute(
        'INSERT INTO simpanan (id_anggota, jenis, jumlah, tanggal) VALUES (?, ?, ?, ?)',
        [id_anggota, jenis, jumlah, tanggal]
      );
      
      return res.status(201).json({ success: true });
    } catch (error) {
      console.error('Simpanan Error:', error);
      return res.status(500).json({ error: error.message });
    }
  } 
  
  else if (req.method === 'GET') {
    try {
      const db = await getDb();
      const [rows] = await db.execute('SELECT * FROM simpanan ORDER BY tanggal DESC');
      return res.status(200).json(rows);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}
