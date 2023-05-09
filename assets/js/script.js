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
    let users = await fetch("http://localhost:3000/users", {
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

        let name = document.createElement('p');
        name.innerHTML = "Nom : " + '<br>' + elem.name;
        card.appendChild(name);

        let firstname = document.createElement('p');
        firstname.innerHTML = "Prénom : " + '<br>' + elem.firstname;
        card.appendChild(firstname);

        let age = document.createElement('p');
        age.innerHTML = "Age : " + '<br>' + elem.age;
        card.appendChild(age);

        let email = document.createElement('p');
        email.innerHTML = "Email : " + '<br>' + elem.email;
        card.appendChild(email);

        let mdp = document.createElement('p');
        mdp.innerHTML = "Mot de passe : " + '<br>' + elem.password;
        card.appendChild(mdp);

        let modifyButton = document.createElement('button');
        modifyButton.innerHTML = "Modifier";
        modifyButton.classList.add("button-modify");
        modifyButton.onclick = function () {
            // Afficher le formulaire de modification
            modifyForm.style.display = "block";

            // Pré-remplir les champs du formulaire avec les données de l'utilisateur sélectionné
            modifyNameInput.value = elem.name;
            modifyFirstnameInput.value = elem.firstname;
            modifyAgeInput.value = elem.age;
            modifyEmailInput.value = elem.email;
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

    let modifyNameLabel = document.createElement('label');
    modifyNameLabel.innerHTML = "Nom : ";
    modifyForm.appendChild(modifyNameLabel);
    
    let modifyNameInput = document.createElement('input');
    modifyNameInput.type = "text";
    modifyForm.appendChild(modifyNameInput);

    let modifyFirstnameLabel = document.createElement('label');
    modifyFirstnameLabel.innerHTML = "Prénom : ";
    modifyForm.appendChild(modifyFirstnameLabel);

    let modifyFirstnameInput = document.createElement('input');
    modifyFirstnameInput.type = "text";
    modifyForm.appendChild(modifyFirstnameInput);
    
    let modifyAgeLabel = document.createElement('label');
    modifyAgeLabel.innerHTML = "Age : ";
    modifyForm.appendChild(modifyAgeLabel);

    let modifyAgeInput = document.createElement('input');
    modifyAgeInput.type = "number";
    modifyForm.appendChild(modifyAgeInput);

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
        let newName = modifyNameInput.value;
        let newFirstname = modifyFirstnameInput.value;
        let newAge = modifyAgeInput.value;
        let newEmail = modifyEmailInput.value;
        let newMdp = modifyMdpInput.value;

        // Mettre à jour les données de l'utilisateur sélectionné sur le serveur
        let response = await fetch(`http://localhost:3000/users/${userId}`, {
            method: "PUT",
            headers: {
                'Accept': 'application/json, text/plain, /',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: newName,
                firstname: newFirstname,
                age: newAge,
                email: newEmail,
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
        let response = await fetch(`http://localhost:3000/users/${userId}`, {
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
        age: document.getElementById('age').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    }
    let user = await fetch("http://localhost:3000/user", {
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

// Fonction pour se connecter
async function login() {
    let obj = {
        email: document.getElementById('emailLogin').value,
        password: document.getElementById('passwordLogin').value
    }
    let user = await fetch("http://localhost:3000/user/login", {
        method: "POST",
        headers: {
            'Accept': 'application/json, text/plain, /',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj) // Création d'un json à partir d'un objet Javascript
    })

    // Si la connexion a réussi, rediriger vers la page d'accueil après avoir affiché un message de bienvenue pendant 3 secondes
    if (user.status == 200) {
        let welcome = document.querySelector(".welcome");
        let loader = document.querySelector(".load-3");
        loader.style.display = "block";
        welcome.innerHTML = "Connexion réussie, vous allez être redirigé vers la page d'accueil";
        setTimeout(function () {
            window.location.href = "./index.html";
        }, 3000);
    } else {
        let error = document.querySelector(".erreur");
        error.innerHTML = "Email ou mot de passe incorrect";
    }
    user = await user.json();
}