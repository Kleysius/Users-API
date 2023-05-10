async function getArticles() {
    let articles = await fetch(`http://localhost:3000/articles`, {
        method: "GET",
        headers: {
            'Accept': 'application/json, text/plain, /',
            'Content-Type': 'application/json'
        }
    });
    articles = await articles.json();
    displayArticles(articles);
}

function displayArticles(articles) {
    let parent = document.querySelector('.containerArticle');
    parent.innerHTML = "";
    if (articles.length === 0) {
        parent.style.display = "none";
    } else {
        parent.style.display = "flex";
        articles.forEach(elem => {
            let card = document.createElement('div');
            card.classList.add("card");
            parent.appendChild(card);

            let title = document.createElement('h3');
            title.innerHTML = "Titre";
            card.appendChild(title);

            let titleArticle = document.createElement('p');
            titleArticle.innerHTML = elem.title;
            card.appendChild(titleArticle);

            let description = document.createElement('h3');
            description.innerHTML = "Description";
            card.appendChild(description);

            let descriptionArticle = document.createElement('p');
            descriptionArticle.innerHTML = elem.description;
            card.appendChild(descriptionArticle);

            let authorContainer = document.createElement('div');
            authorContainer.classList.add("authorContainer");
            card.appendChild(authorContainer);

            let divAuthor = document.createElement('div');
            divAuthor.classList.add("author");
            authorContainer.appendChild(divAuthor);

            let author = document.createElement('h3');
            author.innerHTML = "Auteur";
            divAuthor.appendChild(author);

            let authorArticle = document.createElement('p');
            authorArticle.innerHTML = elem.author.name + " " + elem.author.firstname;
            divAuthor.appendChild(authorArticle);

            let authorImg = document.createElement('img');
            fetch("https://randomuser.me/api?gender=male")
                .then(response => {
                    response.json().then(data => {
                        authorImg.src = data.results[0].picture.large;
                    })
                })
            authorContainer.appendChild(authorImg);

            let btn = document.createElement('div');
            btn.classList.add("btn");
            card.appendChild(btn);

            let modifyBtn = document.createElement('button');
            modifyBtn.innerHTML = "Modifier";
            modifyBtn.classList.add("button-modify");
            btn.appendChild(modifyBtn);
            modifyBtn.addEventListener('click', function () {
                modifyArticle(elem._id);
            });

            let deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = "Supprimer";
            deleteBtn.classList.add("button-delete");
            btn.appendChild(deleteBtn);
            deleteBtn.addEventListener('click', function () {
                deleteArticle(elem._id);
                card.remove();
            });

        });
    }
}

async function deleteArticle(articleId) {
    try {
        let article = await fetch(`http://localhost:3000/articles/${articleId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json, text/plain, /',
                'Content-Type': 'application/json'
            },
        });
        // Si la suppression a réussi, afficher une alerte
        if (article.ok) {
            alert(`L'article ${articleId} a été supprimé.`);
        } else {
            console.log(`Impossible de supprimer l'article ${articleId}.`);
        }
    } catch (error) {
        console.error(`Erreur en supprimant l'article ${articleId}: ${error}`);
    }
}

async function modifyArticle(id) {
    let article = await fetch(`http://localhost:3000/articles/${id}`);
    article = await article.json();
    let parent = document.querySelector('.containerArticle');
    parent.innerHTML = "";
    // Créer le formulaire de modification et l'ajouter à la page
    let modifyForm = document.createElement('form');
    modifyForm.classList.add('form-modify');
    parent.appendChild(modifyForm);

    // Titre label
    let title_label = document.createElement('label');
    title_label.innerHTML = "Titre : ";

    // Créer le champ titre
    let title = document.createElement('input');
    title.setAttribute('type', 'text');
    title.setAttribute('name', 'updateTitle');
    title.value = article.title;

    // Description label
    let description_label = document.createElement('label');
    description_label.innerHTML = "Description : ";

    // Créer le champ description
    let description = document.createElement('textarea');
    description.setAttribute('type', 'text');
    description.setAttribute('name', 'updateDescription');
    description.value = article.description;

    // Créer le bouton de validation
    let submit = document.createElement('input');
    submit.setAttribute('type', 'submit');
    submit.setAttribute('value', 'Modifier');

    // Ajouter les champs au formulaire
    modifyForm.appendChild(title_label);
    modifyForm.appendChild(title);
    modifyForm.appendChild(description_label);
    modifyForm.appendChild(description);
    modifyForm.appendChild(submit);


    // Ajouter un événement au formulaire
    modifyForm.addEventListener('submit', async function (e) {
        // Récupérer les nouvelles valeurs saisies dans le formulaire
        let newTitle = document.querySelector('input[name="updateTitle"]').value;
        let newDescription = document.querySelector('textarea[name="updateDescription"]').value;

        // Mettre à jour les données de l'utilisateur sélectionné sur le serveur
        let response = await fetch(`http://localhost:3000/articles/${id}`, {
            method: "PUT",
            headers: {
                'Accept': 'application/json, text/plain, /',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: newTitle,
                description: newDescription
            })
        });

        // Si la mise à jour a réussi, cacher le formulaire de modification et recharger la liste des utilisateurs
        if (response.ok) {
            modifyForm.style.display = "none";
            parent.innerHTML = "";
            getArticles();
        }
    });
}

getArticles();

async function addArticle() {
    // creation de l'objet, on peut recuperer la valeur des elements input pour le creer
    let obj = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        author: localStorage.getItem('user')
    }
    let article = await fetch(`http://localhost:3000/article`, {
        method: "POST",
        headers: {
            'Accept': 'application/json, text/plain, /',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj) //creation d'un json a partir d'un objet javascript
    })
    getArticles();
}