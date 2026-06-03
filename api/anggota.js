// api/anggota.js
import { getDb } from './db.js';

export default async function handler(req, res) {
  
  // GET: Ambil semua data anggota
  if (req.method === 'GET') {
    try {
      const db = await getDb();
      const [rows] = await db.execute('SELECT * FROM anggota ORDER BY nama ASC');
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
      const { nama, nik, alamat, no_hp, tanggal_bergabung } = req.body;
      
      if (!nama || !nik) {
        return res.status(400).json({ error: 'Nama dan NIK wajib diisi' });
      }

      await db.execute(
        'INSERT INTO anggota (nama, nik, alamat, no_hp, tanggal_bergabung) VALUES (?, ?, ?, ?, ?)',
        [nama, nik, alamat, no_hp, tanggal_bergabung]
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
