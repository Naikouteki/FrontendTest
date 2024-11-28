// Menyimpan semua data baris form
let formRows = [];
const formContainer = document.getElementById("formRows");
const saveBtn = document.getElementById("saveBtn");

// Fungsi untuk menambahkan baris baru
function addRow() {
  const rowId = Date.now(); // ID unik untuk setiap baris
  const rowDiv = document.createElement("div");
  rowDiv.className = "row";
  rowDiv.setAttribute("data-id", rowId);

  rowDiv.innerHTML = `
    <label>Nama: <input type="text" class="name" required minlength="3"></label>
    <div class="error name-error"></div>
    
    <label>Jenis Kelamin:
      <input type="radio" name="gender-${rowId}" value="Laki-laki"> Laki-laki
      <input type="radio" name="gender-${rowId}" value="Perempuan"> Perempuan
    </label>
    <div class="error gender-error"></div>

    <label>Hobi:
      <input type="checkbox" value="Membaca"> Membaca
      <input type="checkbox" value="Menulis"> Menulis
      <input type="checkbox" value="Olahraga"> Olahraga
      <input type="checkbox" value="Musik"> Musik
    </label>
    
    <label>Deskripsi:</label>
    <div class="editor" id="editor-${rowId}"></div>
    <textarea class="description" style="display: none;"></textarea>

    <label>Foto: <input type="file" class="photo" accept="image/*"></label>
    <div class="error photo-error"></div>
    
    <div class="actions">
      <button type="button" onclick="editRow(${rowId})">Edit</button>
      <button type="button" onclick="deleteRow(${rowId})">Hapus</button>
    </div>
  `;

  formContainer.appendChild(rowDiv);

  // Tambahkan editor Quill
  const editor = new Quill(`#editor-${rowId}`, {
    theme: "snow"
  });
  editor.on("text-change", function () {
    rowDiv.querySelector(".description").value = editor.root.innerHTML;
  });

  formRows.push({ id: rowId, element: rowDiv });
  updateSaveButton();
}

// Fungsi untuk menghapus baris
function deleteRow(rowId) {
  const rowIndex = formRows.findIndex(row => row.id === rowId);
  if (rowIndex > -1) {
    formRows[rowIndex].element.remove();
    formRows.splice(rowIndex, 1);
  }
  updateSaveButton();
}

// Fungsi untuk mengedit baris (tidak banyak aksi karena data sudah bisa diubah langsung)
function editRow(rowId) {
  alert("Ubah data langsung di kolom yang sesuai.");
}

// Validasi form dan aktifkan tombol simpan jika valid
function validateForm() {
  let isValid = true;

  formRows.forEach(row => {
    const nameInput = row.element.querySelector(".name");
    const genderInputs = row.element.querySelectorAll(`input[name="gender-${row.id}"]`);
    const photoInput = row.element.querySelector(".photo");

    // Validasi nama
    if (nameInput.value.trim().length < 3) {
      isValid = false;
      row.element.querySelector(".name-error").innerText = "Nama minimal 3 karakter.";
    } else {
      row.element.querySelector(".name-error").innerText = "";
    }

    // Validasi jenis kelamin
    if (![...genderInputs].some(input => input.checked)) {
      isValid = false;
      row.element.querySelector(".gender-error").innerText = "Pilih jenis kelamin.";
    } else {
      row.element.querySelector(".gender-error").innerText = "";
    }

    // Validasi foto
    if (!photoInput.files[0] || photoInput.files[0].size > 1024 * 1024) {
      isValid = false;
      row.element.querySelector(".photo-error").innerText = "Upload foto (maksimal 1MB).";
    } else {
      row.element.querySelector(".photo-error").innerText = "";
    }
  });

  return isValid;
}

// Update tombol Simpan
function updateSaveButton() {
  saveBtn.disabled = formRows.length === 0 || !validateForm();
}

// Simpan data ke console
function saveData() {
  if (!validateForm()) return;

  const data = formRows.map(row => {
    const name = row.element.querySelector(".name").value.trim();
    const gender = [...row.element.querySelectorAll(`input[name="gender-${row.id}"]`)].find(input => input.checked)?.value;
    const hobbies = [...row.element.querySelectorAll("input[type='checkbox']:checked")].map(input => input.value);
    const description = row.element.querySelector(".description").value;
    const photo = row.element.querySelector(".photo").files[0];

    return { name, gender, hobbies, description, photo };
  });

  console.log(data);
  alert("Data berhasil disimpan!");
}

// Event Listeners
document.getElementById("addRowBtn").addEventListener("click", addRow);
saveBtn.addEventListener("click", saveData);
