// api/anggota.js
import { getDb } from './db.js';

export default async function handler(req, res) {
  
  // GET: Ambil semua data anggota
  if (req.method === 'GET') {
    try {
      const db = await getDb();
      // Sesuaikan nama kolom dengan database
      const [rows] = await db.execute('SELECT * FROM anggota ORDER BY nama_anggota ASC');
      return res.status(200).json(rows);
    } catch (error) {
      console.error('Get Anggota Error:', error);
      return res.status(500).json({ error: error.message });
    }
  } 
  
  // POST: Tambah anggota baru
  else if (req.method === 'POST') {
    try {
      const db = await getDb();
      // Mapping variabel dari frontend ke nama kolom database
      const { nama_anggota, nik, alamat, no_hp, tanggal_gabung } = req.body;
      
      if (!nama_anggota || !nik) {
        return res.status(400).json({ error: 'Nama dan NIK wajib diisi' });
      }

      // Gunakan nama kolom persis seperti di database
      await db.execute(
        'INSERT INTO anggota (nama_anggota, nik, alamat, no_hp, tanggal_gabung) VALUES (?, ?, ?, ?, ?)',
        [nama_anggota, nik, alamat, no_hp, tanggal_gabung]
      );
      
      return res.status(201).json({ success: true, message: 'Anggota berhasil ditambahkan' });
    } catch (error) {
      console.error('Add Anggota Error:', error);
      return res.status(500).json({ error: error.message });
    }
  }
  
  // Method lain tidak diizinkan
  else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
