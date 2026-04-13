/* ============================================
   Frontend JavaScript - API Integration
   ============================================ */

const API_BASE_URL = "http://localhost:3000/api";
let mataKuliahList = { mataKuliah: [] };

// ============================================
// Utility Functions
// ============================================

/**
 * Menampilkan atau menyembunyikan section berdasarkan id
 */
function showSection(sectionId, e) {
  // Sembunyikan semua section
  const sections = document.querySelectorAll(".section");
  sections.forEach((section) => section.classList.add("hidden"));

  // Tampilkan section yang dipilih (tambahkan suffix -section)
  const fullSectionId = sectionId + "-section";
  const activeSection = document.getElementById(fullSectionId);
  if (activeSection) {
    activeSection.classList.remove("hidden");
  }

  // Update active button di sidebar
  const navButtons = document.querySelectorAll(".nav-btn");
  navButtons.forEach((btn) => btn.classList.remove("active"));
  if (e && e.target) {
    e.target.classList.add("active");
  }
}

/**
 * Helper untuk fetch dengan error handling
 */
async function fetchAPI(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

/**
 * Menampilkan notifikasi success
 */
function showSuccessMessage(message) {
  alert(message);
}

/**
 * Menampilkan notifikasi error
 */
function showErrorMessage(message) {
  alert(message);
}

// ============================================
// Section 1: Mahasiswa Data
// ============================================

/**
 * Memuat dan menampilkan data mahasiswa
 */
async function loadMahasiswa() {
  try {
    const response = await fetchAPI("/mahasiswa");
    const data = response.data || response;
    const container = document.getElementById("mahasiswa-list");
    container.innerHTML = "";

    if (!data || data.length === 0) {
      container.innerHTML =
        '<p style="text-align: center; color: #999;">Tidak ada data mahasiswa</p>';
      return;
    }

    data.forEach((mahasiswa) => {
      const card = createMahasiswaCard(mahasiswa);
      container.appendChild(card);
    });
  } catch (error) {
    showErrorMessage("Gagal memuat data mahasiswa");
    console.error("Error:", error);
  }
}

/**
 * Membuat card untuk setiap mahasiswa
 */
function createMahasiswaCard(mahasiswa) {
  const card = document.createElement("div");
  card.className = "mahasiswa-card";
  const statusClass = mahasiswa.status ? "aktif" : "tidak-aktif";
  const statusText = mahasiswa.status ? "Aktif" : "Tidak Aktif";

  card.innerHTML = `
    <h3>${mahasiswa.nama}</h3>
    <div class="mahasiswa-info">
      <div class="info-row">
        <span class="info-label">NIM:</span>
        <span class="info-value">${mahasiswa.nim}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Status:</span>
        <span class="status ${statusClass}">${statusText}</span>
      </div>
    </div>
    <div class="button-group">
      <button class="btn btn-info" onclick="editMahasiswa('${mahasiswa.nim}')">Edit</button>
      <button class="btn btn-danger" onclick="deleteMahasiswa('${mahasiswa.nim}')">Hapus</button>
    </div>
  `;

  return card;
}

// ============================================
// Section 2: Tambah Mahasiswa
// ============================================

/**
 * Handle form submit untuk tambah mahasiswa
 */
document.addEventListener("DOMContentLoaded", function () {
  const addForm = document.getElementById("form-tambah");
  if (addForm) {
    addForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const nim = document.getElementById("nim").value.trim();
      const nama = document.getElementById("nama").value.trim();
      const status = document.getElementById("status").value === "true";

      // Validasi input
      if (!nim || !nama) {
        showErrorMessage("NIM dan Nama harus diisi");
        return;
      }

      try {
        const response = await fetchAPI("/mahasiswa", {
          method: "POST",
          body: JSON.stringify({
            nim,
            nama,
            status,
            matkul: [],
          }),
        });

        showSuccessMessage("Mahasiswa berhasil ditambahkan");
        addForm.reset();
        loadMahasiswa();
        // Pindah ke section mahasiswa
        showSection("mahasiswa");
      } catch (error) {
        showErrorMessage("Gagal menambahkan mahasiswa: " + error.message);
      }
    });
  }
});

// ============================================
// Section 3: Edit Mahasiswa
// ============================================

/**
 * Memuat data mahasiswa untuk edit (dropdown)
 */
async function loadDataMahasiswa() {
  try {
    const response = await fetchAPI("/mahasiswa");
    const data = response.data || response;
    const selectDropdown = document.getElementById("select-mahasiswa");
    selectDropdown.innerHTML =
      '<option value="">-- Pilih Mahasiswa --</option>';

    data.forEach((mahasiswa) => {
      const option = document.createElement("option");
      option.value = mahasiswa.nim;
      option.textContent = `${mahasiswa.nama} (${mahasiswa.nim})`;
      selectDropdown.appendChild(option);
    });
  } catch (error) {
    showErrorMessage("Gagal memuat data mahasiswa");
  }
}

/**
 * Ketika user memilih mahasiswa dari dropdown
 */
document.addEventListener("DOMContentLoaded", function () {
  const editDropdown = document.getElementById("select-mahasiswa");
  if (editDropdown) {
    editDropdown.addEventListener("change", async function () {
      const nim = this.value;
      if (!nim) return;

      try {
        const response = await fetchAPI("/mahasiswa");
        const data = response.data || response;
        const mahasiswa = data.find((m) => m.nim === nim);

        if (mahasiswa) {
          document.getElementById("edit-nim").value = mahasiswa.nim;
          document.getElementById("edit-nama").value = mahasiswa.nama;
          document.getElementById("edit-status").value = mahasiswa.status;
          document.getElementById("form-edit").classList.remove("hidden");
        }
      } catch (error) {
        showErrorMessage("Gagal memuat data mahasiswa");
      }
    });
  }
});

/**
 * Handle form submit untuk edit mahasiswa
 */
document.addEventListener("DOMContentLoaded", function () {
  const editForm = document.getElementById("form-edit");
  if (editForm) {
    editForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const nim = document.getElementById("edit-nim").value;
      const nama = document.getElementById("edit-nama").value.trim();
      const status = document.getElementById("edit-status").value === "true";

      if (!nama) {
        showErrorMessage("Nama harus diisi");
        return;
      }

      try {
        await fetchAPI(`/mahasiswa/${nim}`, {
          method: "PUT",
          body: JSON.stringify({ nama, status }),
        });

        showSuccessMessage("Mahasiswa berhasil diupdate");
        editForm.reset();
        editForm.classList.add("hidden");
        document.getElementById("select-mahasiswa").value = "";
        loadMahasiswa();
      } catch (error) {
        showErrorMessage("Gagal mengupdate mahasiswa: " + error.message);
      }
    });
  }
});

/**
 * Edit mahasiswa dari card
 */
async function editMahasiswa(nim) {
  showSection("edit");
  document.getElementById("select-mahasiswa").value = nim;

  try {
    const response = await fetchAPI("/mahasiswa");
    const data = response.data || response;
    const mahasiswa = data.find((m) => m.nim === nim);

    if (mahasiswa) {
      document.getElementById("edit-nim").value = mahasiswa.nim;
      document.getElementById("edit-nama").value = mahasiswa.nama;
      document.getElementById("edit-status").value = mahasiswa.status;
      document.getElementById("form-edit").classList.remove("hidden");
    }
  } catch (error) {
    showErrorMessage("Gagal memuat data mahasiswa");
  }
}

/**
 * Hapus mahasiswa
 */
async function deleteMahasiswa(nim) {
  if (!confirm(`Yakin ingin menghapus mahasiswa dengan NIM ${nim}?`)) {
    return;
  }

  try {
    await fetchAPI(`/mahasiswa/${nim}`, {
      method: "DELETE",
    });

    showSuccessMessage("Mahasiswa berhasil dihapus");
    loadMahasiswa();
  } catch (error) {
    showErrorMessage("Gagal menghapus mahasiswa: " + error.message);
  }
}

/**
 * Hapus mahasiswa dari edit form
 */
function deleteCurrentMahasiswa() {
  const nim = document.getElementById("edit-nim").value;
  if (!nim) {
    showErrorMessage("NIM tidak ditemukan");
    return;
  }
  deleteMahasiswa(nim);
}

/**
 * Hapus semua mahasiswa
 */
async function clearAllMahasiswa() {
  if (
    !confirm(
      "⚠️ Anda yakin ingin menghapus SEMUA mahasiswa? Tindakan ini tidak dapat dibatalkan!",
    )
  ) {
    return;
  }

  try {
    await fetchAPI("/clear", {
      method: "DELETE",
    });

    showSuccessMessage("Semua mahasiswa berhasil dihapus");
    loadMahasiswa();
    loadDataMahasiswa();
  } catch (error) {
    showErrorMessage("Gagal menghapus semua mahasiswa: " + error.message);
  }
}

// ============================================
// Section 4: Nilai & IPS
// ============================================

/**
 * Get nilai mahasiswa yang dipilih
 */
async function getNilaiMahasiswa() {
  const nim = document.getElementById("select-nilai").value;
  if (!nim) return;

  try {
    const nilaiRes = await fetchAPI(`/mahasiswa/${nim}/nilai`);
    const nilaiTotal = nilaiRes.nilaiTotal || 0;
    const rataRata = nilaiRes.rataRata || 0;

    const kategoriRes = await fetchAPI(`/kategori/${rataRata}`);
    const kategori = kategoriRes.kategori || "N/A";

    const ipsRes = await fetchAPI(`/mahasiswa/${nim}/ips`);
    const ips = (ipsRes.ips || 0).toFixed(2);

    const detailNilai = document.getElementById("detail-nilai");
    if (detailNilai) {
      let detailHtml = `
        <p><strong>Nilai Total Semua Mata Kuliah:</strong> ${nilaiTotal}</p>
        <p><strong>Rata-rata Nilai:</strong> ${rataRata}</p>
      `;

      if (nilaiRes.details && nilaiRes.details.length > 0) {
        detailHtml += `<h4>Detail per Mata Kuliah:</h4><ul>`;
        nilaiRes.details.forEach((detail) => {
          const matkulName = detail.matkulNama || detail.matkulId;
          detailHtml += `<li>${matkulName}: Tugas=${detail.tugas}, UTS=${detail.uts}, UAS=${detail.uas}, Total=${detail.total}</li>`;
        });
        detailHtml += `</ul>`;
      }

      detailNilai.innerHTML = detailHtml;
    }

    const detailIps = document.getElementById("detail-ips");
    if (detailIps) {
      detailIps.innerHTML = `
        <p><strong>IPS:</strong> ${ips}</p>
        <p><strong>Kategori:</strong> ${kategori}</p>
      `;
    }

    document.getElementById("nilai-result").classList.remove("hidden");
  } catch (error) {
    showErrorMessage("Gagal memuat nilai mahasiswa: " + error.message);
    console.error("Error detail:", error);
  }
}

// ============================================
// Section 5: Statistik
// ============================================

/**
 * Memuat statistik kelas
 */
async function loadStatistik() {
  try {
    const jumlahRes = await fetchAPI("/jumlah-mahasiswa");
    const aktivRes = await fetchAPI("/aktif-tidak-aktif");
    const statistikRes = await fetchAPI("/statistik");

    const container = document.getElementById("statistik-container");
    container.innerHTML = "";

    // Membuat stat boxes
    const statsGrid = document.createElement("div");
    statsGrid.className = "stats-grid";

    const totalBox = document.createElement("div");
    totalBox.className = "stat-box";
    totalBox.innerHTML = `
      <h4>Total Mahasiswa</h4>
      <div class="value">${jumlahRes.jumlah || 0}</div>
    `;

    const aktivBox = document.createElement("div");
    aktivBox.className = "stat-box";
    aktivBox.style.background = "linear-gradient(135deg, #2ecc71, #27ae60)";
    aktivBox.innerHTML = `
      <h4>Mahasiswa Aktif</h4>
      <div class="value">${aktivRes.aktif || 0}</div>
    `;

    const tidakAktifBox = document.createElement("div");
    tidakAktifBox.className = "stat-box";
    tidakAktifBox.style.background =
      "linear-gradient(135deg, #e74c3c, #c0392b)";
    tidakAktifBox.innerHTML = `
      <h4>Tidak Aktif</h4>
      <div class="value">${aktivRes.tidakAktif || 0}</div>
    `;

    const rataIpsBox = document.createElement("div");
    rataIpsBox.className = "stat-box";
    rataIpsBox.style.background = "linear-gradient(135deg, #f39c12, #e67e22)";
    rataIpsBox.innerHTML = `
      <h4>IPS Rata-rata</h4>
      <div class="value">${(statistikRes.rataIps || 0).toFixed(2)}</div>
    `;

    statsGrid.appendChild(totalBox);
    statsGrid.appendChild(aktivBox);
    statsGrid.appendChild(tidakAktifBox);
    statsGrid.appendChild(rataIpsBox);

    container.appendChild(statsGrid);

    // Detail statistik dalam tabel
    if (statistikRes.details) {
      const detailsTable = document.createElement("table");
      detailsTable.className = "table";
      detailsTable.innerHTML = `
        <thead>
          <tr>
            <th>Nama</th>
            <th>NIM</th>
            <th>Status</th>
            <th>IPS</th>
          </tr>
        </thead>
        <tbody></tbody>
      `;

      const tbody = detailsTable.querySelector("tbody");
      statistikRes.details.forEach((detail) => {
        const row = document.createElement("tr");
        const statusClass = detail.status ? "aktif" : "tidak-aktif";
        const statusText = detail.status ? "Aktif" : "Tidak Aktif";

        row.innerHTML = `
          <td>${detail.nama}</td>
          <td>${detail.nim}</td>
          <td><span class="status ${statusClass}">${statusText}</span></td>
          <td>${(detail.ips || 0).toFixed(2)}</td>
        `;
        tbody.appendChild(row);
      });

      container.appendChild(detailsTable);
    }
  } catch (error) {
    showErrorMessage("Gagal memuat statistik");
  }
}

// ============================================
// Section 6: Urutan/Sort
// ============================================

/**
 * Urutkan mahasiswa berdasarkan NIM
 */
async function sortByNIM() {
  try {
    const data = await fetchAPI("/mahasiswa/sort/nim");
    const container = document.getElementById("sort-result");
    container.innerHTML = "";

    if (!data || data.length === 0) {
      container.innerHTML =
        '<p style="text-align: center;">Tidak ada data mahasiswa</p>';
      return;
    }

    const table = document.createElement("table");
    table.className = "table";
    table.innerHTML = `
      <thead>
        <tr>
          <th>No.</th>
          <th>Nama</th>
          <th>NIM</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

    const tbody = table.querySelector("tbody");
    data.forEach((mahasiswa, index) => {
      const statusClass = mahasiswa.status ? "aktif" : "tidak-aktif";
      const statusText = mahasiswa.status ? "Aktif" : "Tidak Aktif";

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${mahasiswa.nama}</td>
        <td>${mahasiswa.nim}</td>
        <td><span class="status ${statusClass}">${statusText}</span></td>
      `;
      tbody.appendChild(row);
    });

    container.appendChild(table);
    showSuccessMessage("Data diurutkan berdasarkan NIM");
  } catch (error) {
    showErrorMessage("Gagal mengurutkan data");
  }
}

/**
 * Urutkan mahasiswa berdasarkan Status
 */
async function sortByStatus() {
  try {
    const response = await fetchAPI("/mahasiswa/sort/status");
    const data = response.data || response;

    if (!data || data.length === 0) {
      document.getElementById("sort-result").innerHTML =
        '<p style="text-align: center;">Tidak ada data mahasiswa</p>';
      return;
    }

    const container = document.getElementById("sort-result");
    container.innerHTML = "";

    const table = document.createElement("table");
    table.className = "table";
    table.innerHTML = `
      <thead>
        <tr>
          <th>No.</th>
          <th>Nama</th>
          <th>NIM</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

    const tbody = table.querySelector("tbody");
    data.forEach((mahasiswa, index) => {
      const statusClass = mahasiswa.status ? "aktif" : "tidak-aktif";
      const statusText = mahasiswa.status ? "Aktif" : "Tidak Aktif";

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${mahasiswa.nama}</td>
        <td>${mahasiswa.nim}</td>
        <td><span class="status ${statusClass}">${statusText}</span></td>
      `;
      tbody.appendChild(row);
    });

    container.appendChild(table);
    showSuccessMessage("Data diurutkan berdasarkan Status");
  } catch (error) {
    showErrorMessage("Gagal mengurutkan data");
  }
}

// ============================================
// Initialization
// ============================================

document.addEventListener("DOMContentLoaded", function () {
  // Load data saat page load
  loadMahasiswa();
  loadDataMahasiswa();

  // Load mataKuliah data
  async function loadMataKuliah() {
    try {
      const response = await fetchAPI("/matakuliah");
      mataKuliahList = {
        mataKuliah: response.data || [],
      };
    } catch (error) {
      console.error("Error loading matakuliah:", error);
    }
  }
  loadMataKuliah();

  // Tambahkan event listener ke nav buttons untuk showSection
  const navButtons = document.querySelectorAll(".nav-btn");
  navButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const sectionId = this.getAttribute("data-section");
      showSection(sectionId, e);
    });
  });

  // Hide edit form by default
  const editForm = document.getElementById("form-edit");
  if (editForm) {
    editForm.classList.add("hidden");
  }

  // Populate nilai dropdown
  async function populateNilaiDropdown() {
    try {
      const response = await fetchAPI("/mahasiswa");
      const data = response.data || response;
      const selectNilai = document.getElementById("select-nilai");
      if (selectNilai) {
        data.forEach((mahasiswa) => {
          const option = document.createElement("option");
          option.value = mahasiswa.nim;
          option.textContent = `${mahasiswa.nama} (${mahasiswa.nim})`;
          selectNilai.appendChild(option);
        });
      }
    } catch (error) {
      console.error("Error populating nilai dropdown:", error);
    }
  }

  populateNilaiDropdown();
});
