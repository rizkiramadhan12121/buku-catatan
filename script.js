document.addEventListener("DOMContentLoaded", loadNotes);

function addNote() {
    let noteTitle = document.getElementById('noteTitle').value.trim();
    let noteText = document.getElementById('noteInput').value.trim();
    let currentDate = new Date().toLocaleString();

    if (noteTitle === '' || noteText === '') {
        Swal.fire('Error', 'Judul dan catatan tidak boleh kosong!', 'error');
        return;
    }

    let note = { 
        id: Date.now(), 
        title: noteTitle, 
        text: noteText, 
        date: currentDate 
    };

    saveNoteToLocalStorage(note);
    renderNote(note);
    
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteInput').value = '';
}

function renderNote(note) {
    let notesContainer = document.getElementById('notes');
    let noteDiv = document.createElement('div');
    noteDiv.classList.add('note');
    noteDiv.setAttribute('data-id', note.id);

    noteDiv.innerHTML = `
        <div class="note-header">
            <strong>${note.title}</strong>
            <div class="note-buttons">
                <button class="edit-btn" onclick="editNote(${note.id})">Edit</button>
                <button class="delete-btn" onclick="deleteNote(${note.id})">Hapus</button>
            </div>
        </div>
        <p>${note.text}</p>
        <small style="color: gray;">${note.date}</small>
    `;

    notesContainer.appendChild(noteDiv);
}

function deleteNote(noteId) {
    Swal.fire({
        title: 'Yakin ingin menghapus?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            let notes = getNotesFromLocalStorage();
            notes = notes.filter(note => note.id !== noteId);
            localStorage.setItem("notes", JSON.stringify(notes));

            document.querySelector(`[data-id="${noteId}"]`).remove();
            Swal.fire('Terhapus!', 'Catatan telah dihapus.', 'success');
        }
    });
}

function editNote(noteId) {
    let notes = getNotesFromLocalStorage();
    let note = notes.find(note => note.id === noteId);

    Swal.fire({
        title: 'Edit Catatan',
        html: `
            <input type='text' id='editTitle' class='swal2-input' value='${note.title}'>
            <textarea id='editText' class='swal2-input'>${note.text}</textarea>`,
        showCancelButton: true,
        confirmButtonText: 'Simpan',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            note.title = document.getElementById('editTitle').value;
            note.text = document.getElementById('editText').value;
            localStorage.setItem("notes", JSON.stringify(notes));
            
            document.querySelector(`[data-id="${noteId}"]`).querySelector('strong').textContent = note.title;
            document.querySelector(`[data-id="${noteId}"]`).querySelector('p').textContent = note.text;
            
            Swal.fire('Berhasil!', 'Catatan telah diperbarui.', 'success');
        }
    });
}

function saveNoteToLocalStorage(note) {
    let notes = getNotesFromLocalStorage();
    notes.push(note);
    localStorage.setItem("notes", JSON.stringify(notes));
}

function getNotesFromLocalStorage() {
    return JSON.parse(localStorage.getItem("notes")) || [];
}

function loadNotes() {
    let notes = getNotesFromLocalStorage();
    notes.forEach(note => renderNote(note));
}