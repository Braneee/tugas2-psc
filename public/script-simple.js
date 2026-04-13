// API Base URL
const API_URL = "http://localhost:3000/api";

// ===== SECTION FUNCTIONS =====
function showSection(sectionId) {
  // Hide all sections
  const sections = document.querySelectorAll(".section");
  sections.forEach((section) => {
    section.classList.remove("active");
  });

  // Hide all nav buttons
  const navButtons = document.querySelectorAll(".nav-btn");
  navButtons.forEach((btn) => {
    btn.classList.remove("active");
  });

  // Show selected section
  const selectedSection = document.getElementById(sectionId);
  if (selectedSection) {
    selectedSection.classList.add("active");
  }

  // Activate corresponding nav button
  document
    .querySelector(`button[onclick="showSection('${sectionId}')"]`)
    ?.classList.add("active");

  // Load data based on section
  if (sectionId === "data") {
    loadMahasiswa();
  } else if (sectionId === "nilai") {
    loadMahasiswa();
  } else if (sectionId === "statistik") {
    loadStatistik();
  }
}

// Close Edit Modal
function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
  document.getElementById("editForm").reset();
}

// Show Message
function showMessage(message, type = "info") {
  const messageDiv = document.getElementById("message");
  messageDiv.className = "message " + type;
  messageDiv.textContent = message;
  setTimeout(() => (messageDiv.textContent = ""), 5000);
}

// Load All Mahasiswa
async function loadMahasiswa() {
  try {
    const response = await fetch(API_URL + "/mahasiswa");
    const result = await response.json();

    if (result.success) {
      displayMahasiswaList(result.data);
      // Update select options untuk nilai dan IPS
      updateSelectOptions(result.data);
      console.log("Data mahasiswa berhasil dimuat:", result.data);
    } else {
      showMessage("Gagal memuat data mahasiswa", "error");
    }
  } catch (error) {
    showMessage("Error: " + error.message, "error");
    console.error("Error loading mahasiswa:", error);
  }
}

// Display Mahasiswa List
function displayMahasiswaList(mahasiswaList) {
  const tbody = document.getElementById("mahasiswa-tbody");
  const table = document.getElementById("mahasiswa-table");

  if (!tbody) {
    console.error("Element mahasiswa-tbody tidak ditemukan");
    return;
  }

  if (mahasiswaList.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="5" style="text-align: center; padding: 20px; color: #999;">No student data available</td></tr>';
    return;
  }

  let html = "";
  mahasiswaList.forEach((mhs, index) => {
    const statusClass = mhs.status ? "aktif" : "tidak-aktif";
    const statusText = mhs.status ? "Active" : "Inactive";
    html += `<tr>
            <td>${index + 1}</td>
            <td><strong>${mhs.nim}</strong></td>
            <td>${mhs.nama}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>
                <button class="btn btn-warning btn-small" onclick="editMahasiswa('${mhs.nim}')">Edit</button>
                <button class="btn btn-danger btn-small" onclick="deleteMahasiswa('${mhs.nim}')">Delete</button>
            </td>
        </tr>`;
  });

  tbody.innerHTML = html;
}

// Update Select Options
function updateSelectOptions(mahasiswaList) {
  const select = document.getElementById("nim-select");
  if (!select) {
    console.error("Element nim-select tidak ditemukan");
    return;
  }

  select.innerHTML = '<option value="">-- Pilih Mahasiswa --</option>';

  if (mahasiswaList && mahasiswaList.length > 0) {
    mahasiswaList.forEach((mhs) => {
      const option = document.createElement("option");
      option.value = mhs.nim;
      option.textContent = `${mhs.nim} - ${mhs.nama}`;
      select.appendChild(option);
    });
    console.log(
      "Select options berhasil di-update dengan " +
        mahasiswaList.length +
        " mahasiswa",
    );
  } else {
    console.log("Tidak ada mahasiswa untuk ditampilkan");
  }
}

// Add Mahasiswa
async function addMahasiswa(e) {
  e.preventDefault();

  const nim = document.getElementById("nim").value;
  const nama = document.getElementById("nama").value;
  const status = document.getElementById("status").value === "true";

  try {
    const response = await fetch(API_URL + "/mahasiswa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nim,
        nama,
        status,
        matkul: [],
      }),
    });

    const result = await response.json();

    if (result.success) {
      showMessage("Student added successfully!", "success");
      document.querySelector("#tambah form").reset();
      loadMahasiswa();
    }
  } catch (error) {
    showMessage("Error: " + error.message, "error");
  }
}

// Edit Mahasiswa
function editMahasiswa(nim) {
  // Fetch current data to populate form
  fetch(API_URL + "/mahasiswa")
    .then((res) => res.json())
    .then((result) => {
      if (result.success) {
        const mahasiswa = result.data.find((m) => m.nim === nim);
        if (mahasiswa) {
          // Populate form
          document.getElementById("editOldNim").value = mahasiswa.nim;
          document.getElementById("editNewNim").value = mahasiswa.nim;
          document.getElementById("editNama").value = mahasiswa.nama;
          document.getElementById("editStatus").value = mahasiswa.status;

          // Store old NIM for reference
          document.getElementById("editForm").dataset.oldNim = nim;

          // Show modal
          document.getElementById("editModal").style.display = "flex";
        }
      }
    })
    .catch((error) => showMessage("Error: " + error.message, "error"));
}

// Submit Edit
async function submitEdit(e) {
  e.preventDefault();

  const oldNim = document.getElementById("editForm").dataset.oldNim;
  const newNim = document.getElementById("editNewNim").value;
  const nama = document.getElementById("editNama").value;
  const status = document.getElementById("editStatus").value === "true";

  try {
    const response = await fetch(API_URL + "/mahasiswa/" + oldNim, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nim: newNim,
        nama: nama,
        status: status,
      }),
    });

    const result = await response.json();

    if (result.success) {
      showMessage("Student data updated successfully", "success");
      closeEditModal();
      loadMahasiswa();
    } else {
      showMessage("Error: " + result.message, "error");
    }
  } catch (error) {
    showMessage("Error: " + error.message, "error");
  }
}

// Close Edit Modal
function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
  document.getElementById("editForm").reset();
}

// Delete Mahasiswa
async function deleteMahasiswa(nim) {
  if (!confirm("Are you sure you want to delete this student?")) return;

  try {
    const response = await fetch(API_URL + "/mahasiswa/" + nim, {
      method: "DELETE",
    });

    const result = await response.json();

    if (result.success) {
      showMessage("Student deleted successfully", "success");
      loadMahasiswa();
    }
  } catch (error) {
    showMessage("Error: " + error.message, "error");
  }
}

// Clear All Data
async function clearAllData() {
  if (
    !confirm(
      "Are you sure you want to delete ALL students? This action cannot be undone.",
    )
  )
    return;

  try {
    const response = await fetch(API_URL + "/clear", {
      method: "DELETE",
    });

    const result = await response.json();

    if (result.success) {
      showMessage("All students deleted successfully", "success");
      loadMahasiswa();
    }
  } catch (error) {
    showMessage("Error: " + error.message, "error");
  }
}

// Fungsi untuk mendapatkan kategori nilai
function getKategoriNilai(nilai) {
  nilai = parseFloat(nilai);
  if (nilai >= 85) return "A";
  if (nilai >= 75) return "B";
  if (nilai >= 65) return "C";
  if (nilai >= 50) return "D";
  return "E";
}

// Hitung Nilai IPS
async function hitungNilaiIps() {
  const nimSelect = document.getElementById("nim-select");
  const nim = nimSelect ? nimSelect.value : "";

  if (!nim) {
    showMessage("Please select a student first", "info");
    return;
  }

  try {
    console.log("Mencari nilai IPS untuk NIM: " + nim);

    // Fetch Mahasiswa Data
    const mahasiswaResponse = await fetch(API_URL + "/mahasiswa");
    const mahasiswaResult = await mahasiswaResponse.json();

    if (!mahasiswaResult.success) {
      showMessage("Failed to load student data", "error");
      return;
    }

    const mahasiswa = mahasiswaResult.data.find((m) => m.nim === nim);
    if (!mahasiswa) {
      showMessage("Student with NIM " + nim + " not found", "error");
      return;
    }

    // Fetch IPS
    const ipsResponse = await fetch(API_URL + "/mahasiswa/" + nim + "/ips");
    const ipsResult = await ipsResponse.json();

    if (ipsResult.success) {
      const ips = parseFloat(ipsResult.ips);
      const kategori = getKategoriNilai(ips);

      let html = "<div style='margin-top: 20px;'>";
      html += `<h3 style="color: #2c3e50; margin-bottom: 15px;">GPA Results</h3>`;
      html += `<div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">`;
      html += `<p><strong>NIM:</strong> ${mahasiswa.nim}</p>`;
      html += `<p><strong>Name:</strong> ${mahasiswa.nama}</p>`;
      html += `<p style="margin: 15px 0;"><strong>GPA:</strong> <span style="font-size: 1.5em; color: #3498db; font-weight: bold;">${ips.toFixed(2)}</span></p>`;
      html += `<p><strong>Grade:</strong> <span style="display: inline-block; padding: 6px 12px; border-radius: 20px; background: #3498db; color: white; font-weight: 600;">${kategori}</span></p>`;
      html += `</div>`;

      if (mahasiswa.matkul && mahasiswa.matkul.length > 0) {
        html +=
          "<h4 style='color: #2c3e50; margin-bottom: 10px;'>Course Details</h4>";
        html +=
          "<table style='width: 100%; border-collapse: collapse;'><thead style='background: #2c3e50; color: white;'><tr><th style='padding: 10px; text-align: left;'>Course</th><th style='padding: 10px;'>Assignment</th><th style='padding: 10px;'>Midterm</th><th style='padding: 10px;'>Final</th><th style='padding: 10px;'>Total</th></tr></thead><tbody>";

        mahasiswa.matkul.forEach((mk) => {
          const nilaiAkhir = (
            mk.tugas * 0.3 +
            mk.uts * 0.3 +
            mk.uas * 0.4
          ).toFixed(2);
          html += `<tr style='border-bottom: 1px solid #ddd;'>
                        <td style='padding: 10px;'><strong>${mk.matkulId}</strong></td>
                        <td style='padding: 10px; text-align: center;'>${mk.tugas}</td>
                        <td style='padding: 10px; text-align: center;'>${mk.uts}</td>
                        <td style='padding: 10px; text-align: center;'>${mk.uas}</td>
                        <td style='padding: 10px; text-align: center; color: #27ae60; font-weight: bold;'>${nilaiAkhir}</td>
                    </tr>`;
        });

        html += "</tbody></table>";
      } else {
        html +=
          "<p style='color: #999; font-style: italic;'>No course data available</p>";
      }
      html += "</div>";

      const nilaiResult = document.getElementById("nilai-result");
      if (nilaiResult) {
        nilaiResult.innerHTML = html;
        console.log("Hasil nilai IPS berhasil ditampilkan");
      }
    } else {
      showMessage(
        "Failed to get GPA: " + (ipsResult.message || "Unknown error"),
        "error",
      );
    }
  } catch (error) {
    showMessage("Error: " + error.message, "error");
    console.error("Error loading nilai IPS:", error);
  }
}

// Load Statistik
async function loadStatistik() {
  try {
    const response = await fetch(API_URL + "/mahasiswa");
    const result = await response.json();

    if (result.success) {
      const data = result.data;
      const jumlah = data.length;
      const aktif = data.filter((m) => m.status).length;
      const tidakAktif = data.filter((m) => !m.status).length;

      let html = '<div class="stats">';
      html += `<div class="stat-card">
                <div class="stat-value">${jumlah}</div>
                <div class="stat-label">Total Students</div>
            </div>`;
      html += `<div class="stat-card">
                <div class="stat-value">${aktif}</div>
                <div class="stat-label">Active Students</div>
            </div>`;
      html += `<div class="stat-card">
                <div class="stat-value">${tidakAktif}</div>
                <div class="stat-label">Inactive Students</div>
            </div>`;
      html += "</div>";

      document.getElementById("statistik-data").innerHTML = html;
    }
  } catch (error) {
    showMessage("Error: " + error.message, "error");
  }
}

// Refresh Data
function refreshData() {
  loadMahasiswa();
  loadStatistik();
  showMessage("🔄 Data telah diperbarui", "info");
}

// Sort Mahasiswa by NIM
async function sortMahasiswaByNIM() {
  try {
    const response = await fetch(API_URL + "/mahasiswa/sort/nim");
    const result = await response.json();

    if (result.success) {
      displaySortResult(result.data, "NIM");
      showMessage("Students sorted by NIM", "success");
    } else {
      showMessage("Failed to sort data", "error");
    }
  } catch (error) {
    showMessage("Error: " + error.message, "error");
  }
}

// Sort Mahasiswa by Status
async function sortMahasiswaByStatus() {
  try {
    const response = await fetch(API_URL + "/mahasiswa/sort/status");
    const result = await response.json();

    if (result.success) {
      displaySortResult(result.data, "Status");
      showMessage("Students sorted by status", "success");
    } else {
      showMessage("Failed to sort data", "error");
    }
  } catch (error) {
    showMessage("Error: " + error.message, "error");
  }
}

// Display Sort Result
function displaySortResult(mahasiswaList, sortedBy) {
  const container = document.getElementById("sort-result");

  if (mahasiswaList.length === 0) {
    container.innerHTML =
      "<p style='color: #999;'>No student data available</p>";
    return;
  }

  let html = `<h3 style="color: #2c3e50; margin: 20px 0 15px 0;">Sorted by: <strong>${sortedBy}</strong></h3>`;
  html +=
    "<table style='width: 100%; border-collapse: collapse;'><thead style='background: #2c3e50; color: white;'><tr><th style='padding: 10px; text-align: left;'>NIM</th><th style='padding: 10px; text-align: left;'>Name</th><th style='padding: 10px; text-align: left;'>Status</th></tr></thead><tbody>";

  mahasiswaList.forEach((mhs) => {
    const statusClass = mhs.status ? "aktif" : "tidak-aktif";
    const statusText = mhs.status ? "Active" : "Inactive";
    html += `<tr style='border-bottom: 1px solid #ddd;'>
      <td style='padding: 10px;'><strong>${mhs.nim}</strong></td>
      <td style='padding: 10px;'>${mhs.nama}</td>
      <td style='padding: 10px;'><span class="status-badge ${statusClass}">${statusText}</span></td>
    </tr>`;
  });

  html += "</tbody></table>";
  container.innerHTML = html;
}

// Load data on page load
document.addEventListener("DOMContentLoaded", () => {
  console.log("Halaman dimulai, loading data mahasiswa...");
  loadMahasiswa();
  loadStatistik();
});
