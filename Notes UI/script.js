const saveButton = document.querySelector('#btnSave');
const titleInput = document.querySelector('#title');
const descriptionInput = document.querySelector('#Description');
const noteContainer = document.querySelector('#notes__container');
const noteColor = document.querySelector('#colorHex');
const noteDelete = document.querySelector('#btnDelete');

function clearForm(){
    titleInput.value ='';
    descriptionInput.value='';
    noteColor.value='';
}
 function addNote(title, description, colorHex){
    const body = {
        title: title,
        description: description,
        colorHex: colorHex
    };

    fetch('https://localhost:7298/api/notes/',{
        method: 'POST',
        body: JSON.stringify(body),
            headers:{ 
                "content-type": "application/json"
            }
    })
    .then(data => data.json())
    .then(response => {
        clearForm();
        getAllNote();
    }); 
 }
function updateButton(id, title, description, colorHex){
    const body = {
        title: title,
        description: description,
        colorHex: colorHex
    };

    fetch(`https://localhost:7298/api/notes/${id}`,{
        method: 'PUT',
        body: JSON.stringify(body),
            headers:{
                "content-type": "application/json"
            }
    })
    .then(data => data.json())
    .then(response => {
        clearForm();
        getAllNote();
    }); 
}
 function getAllNote(){
    fetch('https://localhost:7298/api/notes/')
    .then(data => data.json())
    .then(response => displayNote(response))
 }

 function deleteNote(noteId)
{
            if (!confirm('Are you sure you want to delete this note?')) {
                return;
            }
            
            fetch(`https://localhost:7298/api/notes/${noteId}`, {
                method: 'DELETE',
                headers: {
                    "content-type": "application/json"
                }
            })
            .then(response => {
                if (response.ok) {
                    getAllNote(); // Refresh the notes list
                } else {
                    alert('Failed to delete note. Please try again.');
                }
            });
}
function disPlayNoteInForm(note){
    titleInput.value = note.title;
    descriptionInput.value = note.description;
    noteColor.value = note.colorHex;
    saveButton.setAttribute('data-id',note.id);
}

function getNoteById(noteId){
    fetch(`https://localhost:7298/api/notes/${noteId}`)
    .then(data => data.json())
    .then(response => disPlayNoteInForm(response));
}

 function displayNote(notes){

    let allNote = '';
    notes.forEach(note => {
        
        const element =  `
            <div class="note" data-id="${note.id}"style="background-color: ${note.colorHex}">
            <h3>${note.title}</h3>
            <p>${note.description}</p>
                <div class="buttoncorrect">
                    <button class="update">Update</button>
                    <button class="delete" id="btnDelete">Delete</button>
                </div>
            </div>
        `;
        allNote += element;
    });
    noteContainer.innerHTML=allNote;


    // Add event listeners to delete buttons
    document.querySelectorAll('.delete').forEach(button => {
        button.addEventListener('click', function(e) 
        {
            const noteElement = this.closest('.note');
            const noteId = noteElement.dataset.id;
            deleteNote(noteId);  
        });
        
    });

    // add event listeners to update buttons
    document.querySelectorAll('.update').forEach(button => {
        button.addEventListener('click', function(e) 
        {
            const noteElement = this.closest('.note');
            const noteId = noteElement.dataset.id;
                getNoteById(noteId);

        });
        
    });
 }

 getAllNote();

 saveButton.addEventListener('click',function(){
    const id = saveButton.dataset.id;
    if(id)
    {
        updateButton(id,titleInput.value ,descriptionInput.value, noteColor.value);
    }
    else
    {
         addNote(titleInput.value ,descriptionInput.value, noteColor.value );
    }
   
 });
