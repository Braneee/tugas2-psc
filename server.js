/**
 * Backend Server Express - API untuk Manajemen Mahasiswa
 */

const express = require("express");
const cors = require("cors");
const {
  mahasiswaList,
  mataKuliahList,
  show,
  add,
  update,
  deleteById,
  totalNilai,
  kategoriNilai,
  IPS,
  jumlahMahasiswa,
  sortByNIM,
  sortByStatus,
  jumlahAktifTidak,
  clear,
  clearArray,
} = require("./src/Mahasiswa");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ============================================
// API ENDPOINTS
// ============================================

// 1. GET - Menampilkan semua mahasiswa
app.get("/api/mahasiswa", (req, res) => {
  res.json({
    success: true,
    data: mahasiswaList.mahasiswa,
    count: mahasiswaList.mahasiswa.length,
  });
});

// 2. POST - Menambah mahasiswa baru
app.post("/api/mahasiswa", (req, res) => {
  const { nim, nama, status, matkul } = req.body;

  if (!nim || !nama) {
    return res.status(400).json({
      success: false,
      message: "NIM dan Nama wajib diisi",
    });
  }

  const newMahasiswa = {
    nim,
    nama,
    status: status || true,
    matkul: matkul || [],
  };

  add(newMahasiswa);

  res.status(201).json({
    success: true,
    message: `${nama} berhasil ditambahkan`,
    data: newMahasiswa,
  });
});

// 3. PUT - Mengupdate mahasiswa
app.put("/api/mahasiswa/:nim", (req, res) => {
  const { nim } = req.params;
  const dataBaru = req.body;

  const mahasiswaIndex = mahasiswaList.mahasiswa.findIndex(
    (m) => m.nim === nim,
  );
  if (mahasiswaIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Mahasiswa tidak ditemukan",
    });
  }

  update(nim, dataBaru);

  res.json({
    success: true,
    message: `Data mahasiswa ${nim} berhasil diupdate`,
    data: mahasiswaList.mahasiswa[mahasiswaIndex],
  });
});

// 4. DELETE - Menghapus mahasiswa
app.delete("/api/mahasiswa/:nim", (req, res) => {
  const { nim } = req.params;

  const mahasiswaIndex = mahasiswaList.mahasiswa.findIndex(
    (m) => m.nim === nim,
  );
  if (mahasiswaIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Mahasiswa tidak ditemukan",
    });
  }

  const deleted = mahasiswaList.mahasiswa[mahasiswaIndex];
  deleteById(nim);

  res.json({
    success: true,
    message: `${deleted.nama} berhasil dihapus`,
    data: deleted,
  });
});

// 5. GET - Total nilai mahasiswa
app.get("/api/mahasiswa/:nim/nilai", (req, res) => {
  const { nim } = req.params;
  const mahasiswa = mahasiswaList.mahasiswa.find((m) => m.nim === nim);

  if (!mahasiswa) {
    return res.status(404).json({
      success: false,
      message: "Mahasiswa tidak ditemukan",
    });
  }

  const nilaiDetails = mahasiswa.matkul.map((mk) => {
    const total = mk.tugas + mk.uts + mk.uas;
    const matkulInfo = mataKuliahList.mataKuliah.find(
      (m) => m.kode === mk.matkulId,
    );
    return {
      matkulId: mk.matkulId,
      matkulNama: matkulInfo ? matkulInfo.nama : "Unknown",
      tugas: mk.tugas,
      uts: mk.uts,
      uas: mk.uas,
      total,
    };
  });

  // Hitung total keseluruhan dari semua mata kuliah
  const nilaiTotal = nilaiDetails.reduce((sum, mk) => sum + mk.total, 0);
  const rataRata =
    nilaiDetails.length > 0 ? nilaiTotal / nilaiDetails.length : 0;

  res.json({
    success: true,
    nim,
    nilaiTotal: nilaiTotal,
    rataRata: parseFloat(rataRata.toFixed(2)),
    details: nilaiDetails,
  });
});

// 6. GET - Kategori nilai
app.get("/api/kategori/:nilai", (req, res) => {
  const { nilai } = req.params;
  const kategori = kategoriNilai(parseFloat(nilai));

  res.json({
    success: true,
    nilai: parseFloat(nilai),
    kategori,
  });
});

// 7. GET - IPS mahasiswa
app.get("/api/mahasiswa/:nim/ips", (req, res) => {
  const { nim } = req.params;
  const ips = IPS(nim);

  // Check if result is an error message (string)
  if (typeof ips === "string" && isNaN(ips)) {
    return res.status(404).json({
      success: false,
      message: ips,
    });
  }

  res.json({
    success: true,
    nim,
    ips: typeof ips === "string" ? parseFloat(ips) : ips,
  });
});

// 8. GET - Jumlah mahasiswa
app.get("/api/jumlah-mahasiswa", (req, res) => {
  res.json({
    success: true,
    jumlah: jumlahMahasiswa(),
  });
});

// 9. GET - Sort by NIM
app.get("/api/mahasiswa/sort/nim", (req, res) => {
  const sorted = [...mahasiswaList.mahasiswa].sort((a, b) =>
    a.nim.localeCompare(b.nim),
  );

  res.json({
    success: true,
    message: "Mahasiswa diurutkan berdasarkan NIM",
    data: sorted,
  });
});

// 9.1 GET - Sort by Status
app.get("/api/mahasiswa/sort/status", (req, res) => {
  const sorted = [...mahasiswaList.mahasiswa].sort((a, b) => {
    if (a.status === b.status) return 0;
    return a.status ? -1 : 1;
  });

  res.json({
    success: true,
    message: "Mahasiswa diurutkan berdasarkan Status",
    data: sorted,
  });
});

// 10. GET - Jumlah aktif/tidak aktif
app.get("/api/aktif-tidak-aktif", (req, res) => {
  const result = jumlahAktifTidak();

  res.json({
    success: true,
    ...result,
  });
});

// 11. GET - Mata kuliah list
app.get("/api/matakuliah", (req, res) => {
  res.json({
    success: true,
    data: mataKuliahList.mataKuliah,
  });
});

// 12. GET - Statistik lengkap
app.get("/api/statistik", (req, res) => {
  const aktifTidak = jumlahAktifTidak();
  const stats = {
    totalMahasiswa: mahasiswaList.mahasiswa.length,
    ...aktifTidak,
    mahasiswa: mahasiswaList.mahasiswa.map((mhs) => ({
      nim: mhs.nim,
      nama: mhs.nama,
      status: mhs.status ? "Aktif" : "Tidak Aktif",
      jumlahMataKuliah: mhs.matkul.length,
      ips: IPS(mhs.nim),
      kategori: kategoriNilai(parseFloat(IPS(mhs.nim))),
    })),
  };

  res.json({
    success: true,
    data: stats,
  });
});

// 13. DELETE - Clear semua mahasiswa
app.delete("/api/clear", (req, res) => {
  const count = mahasiswaList.mahasiswa.length;
  clear();

  res.json({
    success: true,
    message: `${count} mahasiswa berhasil dihapus semua`,
    deletedCount: count,
  });
});

// 14. DELETE - Clear array mahasiswa (sama dengan clear)
app.delete("/api/clearArray", (req, res) => {
  const count = mahasiswaList.mahasiswa.length;
  clearArray();

  res.json({
    success: true,
    message: `${count} mahasiswa berhasil dihapus semua dari array`,
    deletedCount: count,
  });
});

// Error handling
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint tidak ditemukan",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n✅ Server berjalan di http://localhost:${PORT}`);
  console.log(`📋 Buka browser dan akses aplikasi\n`);
});
