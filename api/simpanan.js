// api/simpanan.js
import { getDb } from './db.js';

export default async function handler(req, res) {
  
  // GET: Ambil semua data simpanan + nama anggota
  if (req.method === 'GET') {
    try {
      const db = await getDb();
      // JOIN tabel simpanan dengan anggota biar bisa tampil nama_anggota di frontend
      const [rows] = await db.execute(`
        SELECT s.id_simpanan, s.jenis_simpanan, s.nominal, s.tanggal, s.keterangan, 
               a.nama_anggota, a.id_anggota
        FROM simpanan s 
        JOIN anggota a ON s.id_anggota = a.id_anggota 
        ORDER BY s.tanggal DESC
      `);
      return res.status(200).json(rows);
    } catch (error) {
      console.error('Get Simpanan Error:', error);
      return res.status(500).json({ error: error.message });
    }
  } 
  
  // POST: Tambah transaksi simpanan baru
  else if (req.method === 'POST') {
    try {
      const db = await getDb();
      // Mapping variabel dari frontend ke nama kolom database
      const { id_anggota, jenis_simpanan, nominal, tanggal, keterangan } = req.body;
      
      if (!id_anggota || !jenis_simpanan || !nominal) {
        return res.status(400).json({ error: 'Anggota, Jenis, dan Nominal wajib diisi' });
      }

      // Gunakan nama kolom persis seperti di database
      await db.execute(
        'INSERT INTO simpanan (id_anggota, jenis_simpanan, nominal, tanggal, keterangan) VALUES (?, ?, ?, ?, ?)',
        [id_anggota, jenis_simpanan, nominal, tanggal, keterangan || null]
      );
      
      return res.status(201).json({ success: true, message: 'Simpanan berhasil dicatat' });
    } catch (error) {
      console.error('Add Simpanan Error:', error);
      return res.status(500).json({ error: error.message });
    }
  }
  
  else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
