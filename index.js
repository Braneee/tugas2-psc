/**
 * Program Utama - Test Semua Fungsi Studi Kasus
 * 10 Fungsi sesuai requirement latihan studi kasus
 */

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

console.log("\n╔════════════════════════════════════════════════════════╗");
console.log("║  TEST SEMUA 10 FUNGSI STUDI KASUS MAHASISWA & KULIAH  ║");
console.log("╚════════════════════════════════════════════════════════╝\n");

console.log("═══ 1. SHOW() - Menampilkan semua mahasiswa ═══");
show();

console.log("\n═══ 2. ADD() - Menambah mahasiswa baru ═══");
add({
  nim: "22003",
  nama: "Andi Setiawan",
  status: true,
  matkul: [{ matkulId: "MK003", tugas: 88, uts: 85, uas: 90 }],
});
console.log("✅ Mahasiswa baru ditambahkan:");
show();

console.log("\n═══ 3. UPDATE() - Mengupdate data mahasiswa ═══");
update("22001", { status: false, nama: "Randi Pratama Updated" });
console.log("✅ Data mahasiswa 22001 diupdate (status dan nama):");
show();

console.log("\n═══ 4. DELETBYID() - Menghapus mahasiswa berdasarkan NIM ═══");
const beforeDelete = mahasiswaList.mahasiswa.length;
deleteById("22002");
const afterDelete = mahasiswaList.mahasiswa.length;
console.log(
  `✅ Mahasiswa 22002 dihapus (${beforeDelete} → ${afterDelete} mahasiswa)`,
);
show();

console.log(
  "\n═══ 5. TOTALNILAI() - Menghitung total nilai per mata kuliah ═══",
);
console.log("Total Nilai Mahasiswa 22001:");
console.log(totalNilai("22001"));

console.log("\n═══ 6. KATEGORINILAI() - Mengelompokkan nilai A-E ═══");
console.log("Kategori nilai 88.5:", kategoriNilai(88.5), "(expected: A)");
console.log("Kategori nilai 77:", kategoriNilai(77), "(expected: B)");
console.log("Kategori nilai 68:", kategoriNilai(68), "(expected: C)");
console.log("Kategori nilai 55:", kategoriNilai(55), "(expected: D)");
console.log("Kategori nilai 45:", kategoriNilai(45), "(expected: E)");

console.log("\n═══ 7. IPS() - Menghitung Indeks Prestasi Semester ═══");
console.log(`IPS Mahasiswa 22001: ${IPS("22001")}`);
console.log(`IPS Mahasiswa 22003: ${IPS("22003")}`);

console.log("\n═══ 8. CLEAR() / CLEARARRAY() - Menghapus semua data ═══");
// Backup data untuk test selanjutnya
const backupMahasiswa = JSON.parse(JSON.stringify(mahasiswaList.mahasiswa));
console.log(`Sebelum clear: ${mahasiswaList.mahasiswa.length} mahasiswa`);
clear();
console.log(`Sesudah clear: ${mahasiswaList.mahasiswa.length} mahasiswa ✅`);

// Restore data untuk test fungsi lainnya
mahasiswaList.mahasiswa = backupMahasiswa;

console.log("\n═══ 9. JUMLAMMAHASISWA() - Menghitung jumlah mahasiswa ═══");
console.log(`Total mahasiswa: ${jumlahMahasiswa()}`);

console.log("\n═══ 10. SORTBYNIM() - Mengurutkan by NIM ═══");
console.log("Sebelum sort:");
mahasiswaList.mahasiswa.forEach((m) => console.log(`  ${m.nim} - ${m.nama}`));
sortByNIM();
console.log("Sesudah sort by NIM:");
mahasiswaList.mahasiswa.forEach((m) => console.log(`  ${m.nim} - ${m.nama}`));

console.log("\n═══ 11. SORTBYSTATUS() - Mengurutkan by Status ═══");
console.log("Sebelum sort:");
mahasiswaList.mahasiswa.forEach((m) =>
  console.log(`  ${m.nama} - ${m.status ? "Aktif" : "Tidak Aktif"}`),
);
sortByStatus();
console.log("Sesudah sort by Status (Aktif → Tidak Aktif):");
mahasiswaList.mahasiswa.forEach((m) =>
  console.log(`  ${m.nama} - ${m.status ? "Aktif" : "Tidak Aktif"}`),
);

console.log(
  "\n═══ 12. JUMLAAKTIFTIDAK() - Menghitung aktif vs tidak aktif ═══",
);
console.log(jumlahAktifTidak());
