const header = document.querySelector('header');
const message = document.querySelector('#message');
message.innerText = 'Cliquez et maintenez cet élément pour le déplacer.';
let isDragging = false;
let offsetX, offsetY;

header.addEventListener('mousedown', function (e) {
    message.innerText = 'Relâchez la souris pour déplacer cet élément.';
    offsetX = e.clientX - header.offsetLeft;
    offsetY = e.clientY - header.offsetTop;
    isDragging = true;
});

document.addEventListener('mousemove', function (e) {
    if (!isDragging) {
        return;
    }

    header.style.left = e.clientX - offsetX + 'px';
    header.style.top = e.clientY - offsetY + 'px';
});

document.addEventListener('mouseup', function (e) {
    message.innerText = 'Cliquez et maintenez cet élément pour le déplacer.';
    isDragging = false;
});


async function getUsers() {
    let users = await fetch("http://146.59.242.125:3001/users", {
        method: "GET",
        headers: {
            'Accept': 'application/json, text/plain, /',
            'Content-Type': 'application/json'
        }
    });
    users = await users.json();
    displayUser(users);
}

function displayUser(users) {
    let parent = document.querySelector('.card-container');
    parent.innerHTML = "";
    users.forEach(elem => {
        let card = document.createElement('div');
        parent.appendChild(card);

        let firstname = document.createElement('p');
        firstname.innerHTML = "Nom : " + '<br>' + elem.firstname;
        card.appendChild(firstname);

        let name = document.createElement('p');
        name.innerHTML = "Prénom : " + '<br>' + elem.name;
        card.appendChild(name);

        let email = document.createElement('p');
        email.innerHTML = "Email : " + '<br>' + elem.mail;
        card.appendChild(email);

        let modifyButton = document.createElement('button');
        modifyButton.innerHTML = "Modifier";
        modifyButton.classList.add("button-modify");
        modifyButton.onclick = function () {
            // Afficher le formulaire de modification
            modifyForm.style.display = "block";

            // Pré-remplir les champs du formulaire avec les données de l'utilisateur sélectionné
            modifyFirstnameInput.value = elem.firstname;
            modifyNameInput.value = elem.name;
            modifyEmailInput.value = elem.mail;
            modifyMdpInput.value = elem.password;

            // Enregistrer l'ID de l'utilisateur sélectionné pour pouvoir le modifier plus tard
            userId = elem._id;
        };
        card.appendChild(modifyButton);

        let deleteButton = document.createElement('button');
        deleteButton.innerHTML = "Supprimer";
        deleteButton.classList.add("button-delete");
        deleteButton.onclick = function () {
            if (confirm("êtes vous sûr de vouloir supprimer l'utilisateur ?")) {
                deleteUser(elem._id);
                card.remove(); // supprime la carte correspondant à l'utilisateur supprimé
            }
        };
        card.appendChild(deleteButton);
    });

    // Créer le formulaire de modification et l'ajouter à la page
    let modifyForm = document.createElement('form');
    modifyForm.classList = "form";
    modifyForm.style.display = "none"; // Masquer le formulaire au début
    parent.appendChild(modifyForm);

    let modifyFirstnameLabel = document.createElement('label');
    modifyFirstnameLabel.innerHTML = "Nom : ";
    modifyForm.appendChild(modifyFirstnameLabel);

    let modifyFirstnameInput = document.createElement('input');
    modifyFirstnameInput.type = "text";
    modifyForm.appendChild(modifyFirstnameInput);

    let modifyNameLabel = document.createElement('label');
    modifyNameLabel.innerHTML = "Prénom : ";
    modifyForm.appendChild(modifyNameLabel);

    let modifyNameInput = document.createElement('input');
    modifyNameInput.type = "text";
    modifyForm.appendChild(modifyNameInput);

    let modifyEmailLabel = document.createElement('label');
    modifyEmailLabel.innerHTML = "Email : ";
    modifyForm.appendChild(modifyEmailLabel);

    let modifyEmailInput = document.createElement('input');
    modifyEmailInput.type = "email";
    modifyForm.appendChild(modifyEmailInput);

    let modifyMdpLabel = document.createElement('label');
    modifyMdpLabel.innerHTML = "Mot de passe : ";
    modifyForm.appendChild(modifyMdpLabel);

    let modifyMdpInput = document.createElement('input');
    modifyMdpInput.type = "password";
    modifyForm.appendChild(modifyMdpInput);

    let modifySubmitButton = document.createElement('button');
    modifySubmitButton.type = 'button';
    modifySubmitButton.innerHTML = "Enregistrer";
    modifySubmitButton.onclick = async function () {
        // Récupérer les nouvelles valeurs saisies dans le formulaire
        let newFirstname = modifyFirstnameInput.value;
        let newName = modifyNameInput.value;
        let newEmail = modifyEmailInput.value;
        let newMdp = modifyMdpInput.value;

        // Mettre à jour les données de l'utilisateur sélectionné sur le serveur
        let response = await fetch(`http://146.59.242.125:3001/user/${userId}`, {
            method: "PUT",
            headers: {
                'Accept': 'application/json, text/plain, /',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstname: newFirstname,
                name: newName,
                mail: newEmail,
                password: newMdp
            })
        });

        // Si la mise à jour a réussi, cacher le formulaire de modification et recharger la liste des utilisateurs
        if (response.ok) {
            modifyForm.style.display = "none";
            parent.innerHTML = ""; // Effacer les anciennes cartes d'utilisateurs
        }
        getUsers();
    };
    modifyForm.appendChild(modifySubmitButton);

    // Variable pour stocker l'ID de l'utilisateur sélectionné pour la modification
    let userId = null;
}



getUsers();

async function deleteUser(userId) {
    try {
        let response = await fetch(`http://146.59.242.125:3001/user/${userId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json, text/plain, /',
                'Content-Type': 'application/json'
            },
        });
        // Si la suppression a réussi, afficher une alerte
        if (response.ok) {
            alert(`L'utilisateur ${userId} a été supprimé.`);
        } else {
            console.log(`Impossible de supprimer l'utilisateur ${userId}.`);
        }
    } catch (error) {
        console.error(`Erreur en supprimant l'utilisateur ${userId}: ${error}`);
    }
}

async function postUser() {
    let addForm = document.querySelector(".addForm");
    addForm.style.display = "none";
    // creation de l'objet, on peut recuperer la valeur des elements input pour le creer
    let obj = {
        name: document.getElementById('name').value,
        firstname: document.getElementById('firstName').value,
        mail: document.getElementById('email').value,
        password: document.getElementById('password').value
    }
    let user = await fetch("http://146.59.242.125:3001/user", {
        method: "POST",
        headers: {
            'Accept': 'application/json, text/plain, /',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj) //creation d'un json a partir d'un objet javascript
    })
    getUsers();
}

document.getElementById('btnAdd').addEventListener("click", () => {
    let addForm = document.querySelector(".addForm");
    addForm.style.display = "block";
})