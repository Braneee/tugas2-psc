/**
 * Data Struktur - Menyimpan list mahasiswa
 */
const mahasiswaList = {
  mahasiswa: [
    {
      nim: "22001",
      nama: "Randi Pratama",
      status: true,
      matkul: [
        { matkulId: "MK001", tugas: 85, uts: 80, uas: 88 },
        { matkulId: "MK002", tugas: 90, uts: 85, uas: 92 },
      ],
    },
    {
      nim: "22002",
      nama: "Siti Nurhaliza",
      status: true,
      matkul: [
        { matkulId: "MK001", tugas: 75, uts: 70, uas: 78 },
        { matkulId: "MK002", tugas: 80, uts: 75, uas: 82 },
      ],
    },
  ],
};

/**
 * Data Struktur - Menyimpan list mata kuliah
 */
const mataKuliahList = {
  mataKuliah: [
    { kode: "MK001", nama: "Pemrograman Komputer", sks: 3 },
    { kode: "MK002", nama: "Algoritma dan Struktur Data", sks: 4 },
    { kode: "MK003", nama: "Basis Data", sks: 3 },
  ],
};

const show = () => {
  mahasiswaList.mahasiswa.forEach((mhs) => {
    console.log(
      `NIM: ${mhs.nim}, Nama: ${mhs.nama}, Status: ${mhs.status ? "Aktif" : "Tidak Aktif"}`,
    );
    console.log("Mata Kuliah:");

    mhs.matkul.forEach((mk) => {
      const matkulName = mataKuliahList.mataKuliah.find(
        (m) => m.kode === mk.matkulId,
      ).nama;
      console.log(
        `- ${matkulName}: Tugas ${mk.tugas}, UTS ${mk.uts}, UAS ${mk.uas}`,
      );
    });
  });
};

const add = (mahasiswa) => mahasiswaList.mahasiswa.push(mahasiswa);

const update = (nim, dataBaru) => {
  mahasiswaList.mahasiswa = mahasiswaList.mahasiswa.map((m) =>
    m.nim === nim ? { ...m, ...dataBaru } : m,
  );
};

const deleteById = (nim) => {
  mahasiswaList.mahasiswa = mahasiswaList.mahasiswa.filter(
    (m) => m.nim !== nim,
  );
};

const totalNilai = (nim) => {
  const mahasiswa = mahasiswaList.mahasiswa.find((m) => m.nim === nim);
  if (!mahasiswa) return "Mahasiswa tidak ditemukan";

  return mahasiswa.matkul.map((mk) => {
    const total = mk.tugas + mk.uts + mk.uas;
    return { matkulId: mk.matkulId, total };
  });
};

const kategoriNilai = (nilai) => {
  if (nilai >= 85) return "A";
  if (nilai >= 75) return "B";
  if (nilai >= 65) return "C";
  if (nilai >= 50) return "D";

  return "E";
};

const IPS = (nim) => {
  const mahasiswa = mahasiswaList.mahasiswa.find((m) => m.nim === nim);

  if (!mahasiswa) return "Mahasiswa tidak ditemukan";

  const totalSks = mahasiswa.matkul.reduce((sum, mk) => {
    const matkul = mataKuliahList.mataKuliah.find(
      (m) => m.kode === mk.matkulId,
    );
    return sum + matkul.sks;
  }, 0);

  const totalNilaiIps = mahasiswa.matkul.reduce((sum, mk) => {
    const total = mk.tugas * 0.3 + mk.uts * 0.3 + mk.uas * 0.4;
    const matkul = mataKuliahList.mataKuliah.find(
      (m) => m.kode === mk.matkulId,
    );

    return sum + total * matkul.sks;
  }, 0);

  return parseFloat((totalNilaiIps / totalSks).toFixed(2));
};

const jumlahMahasiswa = () => mahasiswaList.mahasiswa.length;

const sortByNIM = () =>
  mahasiswaList.mahasiswa.sort((a, b) => a.nim.localeCompare(b.nim));

const jumlahAktifTidak = () => {
  return {
    aktif: mahasiswaList.mahasiswa.filter((m) => m.status).length,
    tidakAktif: mahasiswaList.mahasiswa.filter((m) => !m.status).length,
  };
};

const clear = () => {
  mahasiswaList.mahasiswa = [];
};

const clearArray = () => {
  mahasiswaList.mahasiswa = [];
};

const sortByStatus = () =>
  mahasiswaList.mahasiswa.sort((a, b) => {
    if (a.status === b.status) return 0;
    return a.status ? -1 : 1;
  });

// Export functions dan data
module.exports = {
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
};
