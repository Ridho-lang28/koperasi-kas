// api/pengeluaran.js
import { getDb } from './db.js';

export default async function handler(req, res) {
  
  // GET: Ambil semua data pengeluaran + Format ID
  if (req.method === 'GET') {
    try {
      const db = await getDb();
      const [rows] = await db.execute(`
        SELECT id_pengeluaran, kategori, nominal, tanggal, keterangan 
        FROM pengeluaran 
        ORDER BY tanggal DESC
      `);

      // FORMAT ID JADI "EXP-001" DI SINI SEBELUM DIKIRIM KE FRONTEND
      const formattedRows = rows.map(row => ({
        ...row,
        id_pengeluaran_formatted: `EXP-${String(row.id_pengeluaran).padStart(3, '0')}` 
      }));

      return res.status(200).json(formattedRows);
    } catch (error) {
      console.error('Get Pengeluaran Error:', error);
      return res.status(500).json({ error: error.message });
    }
  } 
  
  // POST: Tambah transaksi pengeluaran baru
  else if (req.method === 'POST') {
    try {
      const db = await getDb();
      const { kategori, nominal, tanggal, keterangan } = req.body;
      
      if (!kategori || !nominal || !tanggal) {
        return res.status(400).json({ error: 'Kategori, Nominal, dan Tanggal wajib diisi' });
      }

      await db.execute(
        'INSERT INTO pengeluaran (kategori, nominal, tanggal, keterangan) VALUES (?, ?, ?, ?)',
        [kategori, nominal, tanggal, keterangan || null]
      );
      
      return res.status(201).json({ success: true, message: 'Pengeluaran berhasil dicatat' });
    } catch (error) {
      console.error('Add Pengeluaran Error:', error);
      return res.status(500).json({ error: error.message });
    }
  }
  
  else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
