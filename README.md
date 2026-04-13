# Sistem Manajemen Mahasiswa & Mata Kuliah

Latihan studi kasus untuk mengelola data mahasiswa dan nilai mata kuliah menggunakan **Functional Programming** di JavaScript.

---

## Struktur Proyek

```
Tugas2_PSC/
├── src/
│   └── Mahasiswa.js       # Data struktur dan fungsi-fungsi utama
├── index.js               # File utama demo program
├── package.json           # Konfigurasi npm
└── README.md              # File dokumentasi
```

---

## Data Struktur

### mahasiswaList - Menyimpan daftar mahasiswa

```javascript
{
  mahasiswa: [
    {
      nim: string,
      nama: string,
      status: boolean (true = aktif, false = tidak aktif),
      matkul: [
        { matkulId: string, tugas: number, uts: number, uas: number }
      ]
    }
  ]
}
```

### mataKuliahList - Menyimpan daftar mata kuliah

```javascript
{
  mataKuliah: [{ kode: string, nama: string, sks: number }];
}
```

---

## 🔧 Fungsi-Fungsi Utama

### Fungsi Operasi Data

| Fungsi                  | Deskripsi                                        |
| ----------------------- | ------------------------------------------------ |
| `show()`                | Menampilkan semua mahasiswa & mata kuliah mereka |
| `add(mahasiswa)`        | Menambah mahasiswa baru                          |
| `update(nim, dataBaru)` | Mengupdate data mahasiswa berdasarkan NIM        |
| `deleteById(nim)`       | Menghapus mahasiswa berdasarkan NIM              |

### Fungsi Perhitungan & Analisis

| Fungsi                 | Deskripsi                                  |
| ---------------------- | ------------------------------------------ |
| `totalNilai(nim)`      | Menghitung total nilai per mata kuliah     |
| `kategoriNilai(nilai)` | Mengklasifikasi nilai dalam kategori (A-E) |
| `IPS(nim)`             | Menghitung Indeks Prestasi Semester        |

### Fungsi Query & Sorting

| Fungsi               | Deskripsi                             |
| -------------------- | ------------------------------------- |
| `jumlahMahasiswa()`  | Menghitung total jumlah mahasiswa     |
| `jumlahAktifTidak()` | Hitung mahasiswa aktif vs tidak aktif |
| `sortByNIM()`        | Mengurutkan mahasiswa berdasarkan NIM |

---

## 📐 Rumus Perhitungan

### Total Nilai Mata Kuliah

```
Total = (Tugas × 0.2) + (UTS × 0.3) + (UAS × 0.5)
```

### Indeks Prestasi Semester (IPS)

```
IPS = Σ(Total Nilai × SKS) / Σ(SKS)
```

Dimana:

- Tugas: 30% dari 0.3
- UTS: 30% dari 0.3
- UAS: 40% dari 0.5

### Kategori Nilai

| Kategori | Nilai   |
| -------- | ------- |
| A        | ≥ 85    |
| B        | 75 - 84 |
| C        | 65 - 74 |
| D        | 55 - 64 |
| E        | < 55    |

---

## Cara Menjalankan

### 1. Instalasi (opsional)

```bash
npm install
```

### 2. Jalankan Program

```bash
npm start
```

atau

```bash
node index.js
```

---

## Contoh Penggunaan

### Destructuring dari Mahasiswa.js

```javascript
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
  jumlahAktifTidak,
} = require("./src/Mahasiswa");
```

### Menambah Mahasiswa

```javascript
add({
  nim: "22003",
  nama: "Andi Setiawan",
  status: true,
  matkul: [{ matkulId: "MK001", tugas: 88, uts: 85, uas: 90 }],
});
```

### Menampilkan Semua Mahasiswa

```javascript
show();
```

### Mengupdate Data Mahasiswa

```javascript
update("22001", { status: false });
update("22001", { nama: "Nama Baru" });
```

### Menghapus Mahasiswa

```javascript
deleteById("22002");
```

### Menghitung Total Nilai

```javascript
const result = totalNilai("22001");
// { success: true, data: [{matkulId, matkulNama, total}, ...] }
```

### Menghitung IPS

```javascript
const result = IPS("22001");
// { success: true, data: 87.33 }
console.log(`IPS Mahasiswa: ${result.data}`);
```

### Mendapatkan Kategori Nilai

```javascript
console.log(kategoriNilai(88)); // "A (Sangat Baik)"
console.log(kategoriNilai(72)); // "C (Cukup)"
```

---

## Keunggulan Functional Programming

✅ **Pure Functions** - Fungsi tidak mengubah state global
✅ **Data Immutability** - Data dikembalikan dalam bentuk baru
✅ **Composable** - Fungsi dapat dicom pose dengan mudah
✅ **Easy Testing** - Fungsi standalone mudah ditest
✅ **Predictable** - Output selalu sama untuk input yang sama

---

## Fitur Utama

✅ Manajemen data mahasiswa dan mata kuliah
✅ Perhitungan nilai otomatis dengan formula bobot
✅ Perhitungan IPS terweighted dengan SKS
✅ Kategori nilai dinamis (A-E)
✅ Operasi CRUD lengkap pada data mahasiswa
✅ Sorting berdasarkan NIM
✅ Response terstruktur dengan status dan data
✅ Functional programming approach
✅ Data validation & error handling

---
