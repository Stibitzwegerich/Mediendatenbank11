function initModal(modalId, openButtonId, closeButtonId) {
    const modal = document.getElementById(modalId);
    const openModalLink = document.getElementById(openButtonId);
    const closeModalButton = document.getElementById(closeButtonId);

    // Event-Listener für das Öffnen des Modals
    openModalLink.addEventListener('click', (event) => {
        event.preventDefault(); // Verhindert das Standardverhalten des Links
        modal.style.display = 'block'; // Zeigt das Modal an
    });

    // Event-Listener für das Schließen des Modals
    closeModalButton.addEventListener('click', () => {
        modal.style.display = 'none'; // Versteckt das Modal
    });

    // Schließen des Modals bei Klick außerhalb des Inhaltsbereichs
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none'; // Versteckt das Modal
        }
    });
}
function routeLogout(event) {
    event.preventDefault();
    console.log('Logout clicked');
    window.location.href = '/Mediendatenbank/public/UserController/logout/';

}

function updateUserNonAdmin() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const lastname = document.getElementById('lastname').value;
    const firstname = document.getElementById('firstname').value;

    fetch('http://localhost/Mediendatenbank/public/UserController/updateUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: name,
            email: email,
            lastname: lastname,
            firstname: firstname,
        })
    })
    .then(response => response.json())
        .then(data => {
            const statusMessage = document.getElementById('statusMessage');
            if (data.status === 'success') {
                statusMessage.textContent = data.message;
                statusMessage.style.color = 'green';
            } else {
                statusMessage.textContent = data.message;
                statusMessage.style.color = 'red';
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            const statusMessage = document.getElementById('statusMessage');
            statusMessage.textContent = 'Ein Fehler ist aufgetreten.';
            statusMessage.style.color = 'red';
        });
}

function loadAll(){
    fetch('http://localhost/Mediendatenbank/public/MediumController/getAllMediums', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            const contentArea = document.getElementById('contentArea');
            const contentPath = '/Mediendatenbank/public';
            contentArea.innerHTML = '';
            Object.keys(data.data).forEach(type => {
                const mediaTypeList = data.data[type];
                mediaTypeList.forEach(medium => {
                    const element = document.createElement('img');
                    element.src = contentPath + medium.Dateipfad;  // Assuming 'Dateipfad' is the column for the file path
                    element.alt = medium.Titel || 'Kein Titel';  // Optional alt text
                    contentArea.appendChild(element);
                })
            });
            
        })
        .catch(error => console.error('Fehler beim Laden der Bilder:', error));
}

function loadPhotos() {
    fetch('http://localhost/Mediendatenbank/public/MediumController/getAllMediums', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: name,
            email: email,
            lastname: lastname,
            firstname: firstname
        })
    })
        .then(response => response.json())
        .then(data => {
            const bildContainer = document.getElementById('contentArea');
            bildContainer.innerHTML = '';
            data.forEach(bild => {
                // Erstellen eines img-Elements für jedes Bild
                const img = document.createElement('img');
                img.src = bild.Dateipfad; // Pfad zum Bild aus der Datenbank
                img.alt = bild.Titel; // Optionaler Alternativtext
                bildContainer.appendChild(img); // Hinzufügen des Bildes zum Container
            });
        })
        .catch(error => console.error('Fehler beim Laden der Bilder:', error));
}

function loadKeyWords(keyWordElement, listType, deletionButton){
    fetch('http://localhost/Mediendatenbank/public/KeywordController/getAllKeywordsAndAssociations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.status = 'success'){
                const keyWords = data.data[0];
                const keyWordList = document.getElementById(keyWordElement);
                keyWordList.innerHTML = '';

                switch (listType) {
                    case "checkbox":
                    keyWords.forEach(keyword => {
                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.name = 'keywords[]';
                        checkbox.value = keyword.Schlagwort_ID;
        
                        const label = document.createElement('label');
                        const labelText = document.createTextNode(" " + keyword.Schlagwort_Name); // Nutze den Keyword Namen als Label
                        label.appendChild(labelText);
                        
                        keyWordList.appendChild(checkbox);
                        keyWordList.appendChild(label);
                        
                        if (deletionButton){
                            const deleteButton = document.createElement('button');
                            deleteButton.textContent = 'Löschen';  // Set button text
                            deleteButton.onclick = function() {
                                deleteKeyword(keyword.Schlagwort_ID);
                                refreshKeyWords();
                            };
                            keyWordList.appendChild(deleteButton);
                        }               
                        
                        keyWordList.appendChild(document.createElement('br')); // Für Zeilenumbruch
                    });
                    break;

                    case "select":
                        const defaultOption = document.createElement('option');
                        defaultOption.text = 'Bitte Schlagwort auswählen';
                        defaultOption.value = '';
                        keyWordList.appendChild(defaultOption);

                        keyWords.forEach(keyword => {
                            const option = document.createElement('option');
                            option.value = keyword.Schlagwort_ID;
                            option.text = keyword.Schlagwort_Name;
                            keyWordList.appendChild(option);
                        });
                    break;

                    default:
                        console.error('Bitte Listentyp eintragen.');
                }

                
            } else {
                console.error('Fehler beim Laden der Schlagworte:', data.message);
            }            
        })
        .catch(error => console.error('Fehler beim Laden der Schlagworte:', error));
}

function refreshKeyWords(){
    loadKeyWords('keyWordList', 'checkbox', false);
    loadKeyWords('modifyKeyWordList', 'checkbox', true);
    loadKeyWords('keyWordSelection', 'select', false);
}

function createKeyWord(keyWordName) {
    fetch('http://localhost/Mediendatenbank/public/KeywordController/createKeyword/' + keyWordName, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    //.then(response => response.json())
    //.then(data => {
    //    if (data.status === 'success') {
    //        alert('Schlagwort erfolgreich erstellt.');
    //        loadKeyWords('keyWordElement');  // Reload the list after deletion
    //    } else {
    //        alert('Fehler beim Anlegen des Schlagworts: ' + data.message);
    //    }
    //})
    .catch(error => console.error('Fehler beim Anlegen des Schlagworts:', error));
}

function deleteKeyword(keywordId){
    if (confirm("Möchten Sie dieses Schlagwort wirklich löschen?")) {
        fetch('http://localhost/Mediendatenbank/public/KeywordController/deleteKeyword/' + keywordId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Schlagwort erfolgreich gelöscht.');
            } else {
                alert('Fehler beim Löschen des Schlagworts: ' + data.message);
            }
        })
        .catch(error => console.error('Fehler beim Löschen des Schlagworts:', error));
    }
}
