import { getDb } from './db.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const db = await getDb();
      const { kategori, deskripsi, jumlah, tanggal } = req.body;
      
      await db.execute(
        'INSERT INTO pengeluaran (kategori, deskripsi, jumlah, tanggal) VALUES (?, ?, ?, ?)',
        [kategori, deskripsi, jumlah, tanggal]
      );
      
      return res.status(201).json({ success: true });
    } catch (error) {
      console.error('Pengeluaran Error:', error);
      return res.status(500).json({ error: error.message });
    }
  } 
  
  else if (req.method === 'GET') {
    try {
      const db = await getDb();
      const [rows] = await db.execute('SELECT * FROM pengeluaran ORDER BY tanggal DESC');
      return res.status(200).json(rows);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}
