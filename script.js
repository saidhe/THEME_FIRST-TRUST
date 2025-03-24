document.addEventListener("DOMContentLoaded", function () {
    chargerNumeros();
});

// Ajouter un numéro
function ajouterNumero() {
    let input = document.getElementById("telephone");
    let numero = input.value.trim().replace(/\s+/g, ''); // Supprimer les espaces

    // Retirer le préfixe "237" si présent
    if (numero.startsWith("237")) {
        numero = numero.slice(3);
    }

    // Vérifier que le numéro a au moins 9 chiffres avant de le tronquer
    if (numero.length < 9) {
        let message = document.getElementById("message");
        message.innerHTML = "❌ Le numéro ne doit pas contenir moins 9 chiffres !";
        message.classList.add("text-danger");
        return;
    }

    // Prendre seulement les 9 premiers chiffres
    numero = numero.slice(0, 9);

    let message = document.getElementById("message");
    let numeros = JSON.parse(localStorage.getItem("numeros") || "[]");

    // Vérifier que le numéro commence par "6"
    if (!numero.startsWith("6")) {
        message.innerHTML = "Le numéro doit commencer par 6 !";
        message.classList.add("text-danger");
        return;
    }

    // Vérifier si le numéro (9 premiers chiffres) est déjà enregistré
    if (numeros.some(entry => entry.numero.slice(0, 9) === numero)) {
        message.innerHTML = "Ce numéro est déjà enregistré !";
        message.classList.add("text-danger");
        return;
    }

    if (!confirm("Voulez-vous ajouter ce numéro ?")) return;

    let now = new Date();
    let dateAjout = now.toLocaleDateString("fr-FR");
    let heureAjout = now.toLocaleTimeString("fr-FR");

    // Sauvegarde du numéro (9 chiffres seulement)
    sauvegarderNumero(numero, dateAjout, heureAjout);
    chargerNumeros();

    message.innerHTML = "Numéro ajouté avec succès !";
    message.classList.remove("text-danger");
    message.classList.add("text-success");
    input.value = "";
}
function filtrerParDate() {
    let dateSelectionnee = document.getElementById("dateFilter").value;
    let rows = document.querySelectorAll("#table-body tr");
    
    rows.forEach(row => {
        let dateCell = row.cells[2].innerText;
        row.style.display = dateCell === dateSelectionnee || dateSelectionnee === "" ? "" : "none";
    });
}

// Sauvegarde en localStorage
function sauvegarderNumero(numero, dateAjout, heureAjout) {
    let numeros = JSON.parse(localStorage.getItem("numeros") || "[]");
    numeros.push({ numero, dateAjout, heureAjout });
    localStorage.setItem("numeros", JSON.stringify(numeros));
}

// Chargement des numéros enregistrés
function chargerNumeros() {
    let tableBody = document.getElementById("table-body");
    tableBody.innerHTML = "";
    let numeros = JSON.parse(localStorage.getItem("numeros") || "[]");

    numeros.forEach((entry, index) => {
        let newRow = tableBody.insertRow();
        newRow.insertCell(0).innerHTML = index + 1;
        newRow.insertCell(1).innerHTML = entry.numero; // Afficher directement le numéro
        newRow.insertCell(2).innerHTML = entry.dateAjout;
        newRow.insertCell(3).innerHTML = entry.heureAjout;
        newRow.insertCell(4).innerHTML = `<button class='btn btn-danger' onclick='supprimerNumero("${entry.numero}", this)'>Supprimer</button>`;
    });
}

// Supprimer un numéro
function supprimerNumero(numero, bouton) {
    if (!confirm("Voulez-vous vraiment supprimer ce numéro ?")) return;
    let row = bouton.parentNode.parentNode;
    row.parentNode.removeChild(row);

    let numeros = JSON.parse(localStorage.getItem("numeros") || "[]");
    numeros = numeros.filter(entry => entry.numero !== numero);
    localStorage.setItem("numeros", JSON.stringify(numeros));

    chargerNumeros();
}

// Modifier un numéro
function modifierNumero(numero, bouton) {
    let newNumero = prompt("Modifiez le numéro:", numero);
    if (newNumero) {
        // Nettoyage du numéro
        newNumero = newNumero.trim().replace(/\s+/g, ''); // Supprimer les espaces
        if (newNumero.startsWith("237")) {
            newNumero = newNumero.slice(3); // Supprimer le préfixe 237
        }
        newNumero = newNumero.slice(0, 9); // Prendre seulement les 9 premiers chiffres

        // Vérification si le numéro commence bien par "6"
        if (!newNumero.startsWith("6")) {
            alert("Le numéro doit commencer par 6 !");
            return;
        }

        // Mise à jour du numéro
        let numeros = JSON.parse(localStorage.getItem("numeros") || "[]");
        let index = numeros.findIndex(entry => entry.numero === numero);

        if (index !== -1) {
            let now = new Date();
            let dateModif = now.toLocaleDateString("fr-FR");
            let heureModif = now.toLocaleTimeString("fr-FR");

            // Mise à jour de la date et de l'heure
            numeros[index].numero = newNumero;
            numeros[index].dateAjout = dateModif;
            numeros[index].heureAjout = heureModif;

            localStorage.setItem("numeros", JSON.stringify(numeros));
            chargerNumeros(); // Recharger les numéros dans le tableau
            alert("Numéro modifié avec succès !");
        }
    }
}

// Chargement des numéros enregistrés
function chargerNumeros() {
    let tableBody = document.getElementById("table-body");
    tableBody.innerHTML = "";
    let numeros = JSON.parse(localStorage.getItem("numeros") || "[]");

    numeros.forEach((entry, index) => {
        let newRow = tableBody.insertRow();
        newRow.insertCell(0).innerHTML = index + 1;
        newRow.insertCell(1).innerHTML = entry.numero; // Afficher directement le numéro
        newRow.insertCell(2).innerHTML = entry.dateAjout;
        newRow.insertCell(3).innerHTML = entry.heureAjout;
        newRow.insertCell(4).innerHTML = `
            <button class='btn btn-warning' onclick='modifierNumero("${entry.numero}", this)'>Modifier</button>
            <button class='btn btn-danger' onclick='supprimerNumero("${entry.numero}", this)'>Supprimer</button>
        `;
    });
}

// Supprimer tous les numéros
function supprimerTousLesNumeros() {
    if (confirm("Voulez-vous vraiment supprimer tous les numéros ?")) {
        localStorage.removeItem("numeros");
        chargerNumeros();
    }
}

// Recherche d'un numéro
function rechercherNumero() {
    let filter = document.getElementById("search").value.toLowerCase();
    let rows = document.querySelectorAll("#table-body tr");

    rows.forEach(row => {
        let numero = row.cells[1].innerText.toLowerCase();
        row.style.display = numero.includes(filter) ? "" : "none";
    });
}

// Exporter en Excel
document.addEventListener("DOMContentLoaded", function () {
    chargerNumeros();
});

function exporterExcel() {
    let tableBody = document.getElementById("table-body");
    let dataNumeros = [["Numéro", "Date", "Heure"]];

    // Récupérer les bons numéros
    for (let row of tableBody.rows) {
        let numero = row.cells[1].innerText;
        let dateAjout = row.cells[2].innerText;
        let heureAjout = row.cells[3].innerText;
        dataNumeros.push([numero, dateAjout, heureAjout]);
    }

    // Récupérer les mauvais numéros stockés
    let mauvaisNumeros = JSON.parse(localStorage.getItem("mauvaisNumeros") || "[]");
    let dataMauvaisNumeros = [["Numéro", "Date", "Heure"]];

    mauvaisNumeros.forEach(entry => {
        dataMauvaisNumeros.push([entry.numero, entry.date, entry.heure]);
    });

    // Créer les feuilles Excel
    let wsNumeros = XLSX.utils.aoa_to_sheet(dataNumeros);
    let wsMauvaisNumeros = XLSX.utils.aoa_to_sheet(dataMauvaisNumeros);

    // Appliquer le format des couleurs aux en-têtes
    let range = XLSX.utils.decode_range(wsNumeros['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
        let colLetter = String.fromCharCode(65 + C);
        let cellAddress = colLetter + "1";
        if (wsNumeros[cellAddress]) {
            if (C === 0) wsNumeros[cellAddress].s = { fill: { fgColor: { rgb: "FFDDC1" } } }; // Numéro (orange clair)
            if (C === 1) wsNumeros[cellAddress].s = { fill: { fgColor: { rgb: "C1FFD7" } } }; // Date (vert clair)
            if (C === 2) wsNumeros[cellAddress].s = { fill: { fgColor: { rgb: "C1D4FF" } } }; // Heure (bleu clair)
        }
    }

    // Créer le workbook et y ajouter les feuilles
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsNumeros, "Numéros");
    XLSX.utils.book_append_sheet(wb, wsMauvaisNumeros, "MauvaisNuméros");

    // Télécharger le fichier Excel
    XLSX.writeFile(wb, "numeros.xlsx");
}

document.getElementById("loginButton").addEventListener("click", function() {
    alert("Redirection vers la page de connexion !");
});
function handleFile() {
    const fileInput = document.getElementById("fileInput");
    const numList = document.getElementById("numList");

    if (!fileInput.files.length) {
        alert("Veuillez sélectionner un fichier Excel.");
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });

        numList.innerHTML = ""; // Vider la liste avant d'ajouter les nouveaux numéros

        // Parcours de toutes les feuilles du fichier Excel
        workbook.SheetNames.forEach(sheetName => {
            const sheet = workbook.Sheets[sheetName];
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Convertir en tableau

            // Vérifier que le fichier contient bien les colonnes attendues
            if (rows.length > 0 && rows[0].length >= 3) {
                rows.slice(1).forEach(row => { // Ignorer l'en-tête
                    const num = row[0]?.toString().trim(); // Colonne Numéro
                    const dateAjout = row[1]?.toString().trim(); // Colonne Date
                    const heureAjout = row[2]?.toString().trim(); // Colonne Heure
                    
                    if (/^\d{9}$/.test(num) && dateAjout && heureAjout) { // Vérifie les données
                        // Sauvegarder chaque numéro avec sa date et heure du fichier Excel
                        sauvegarderNumero(num, dateAjout, heureAjout);

                        const li = document.createElement("li");
                        li.className = "list-group-item list-group-item-success";
                        li.textContent = `${num} (Importé le ${dateAjout} à ${heureAjout})`;
                        numList.appendChild(li);
                    }
                });
            } else {
                alert("Le fichier Excel ne contient pas les colonnes attendues (Numéro, Date, Heure).");
            }
        });

        // Recharger les numéros dans le tableau
        chargerNumeros();
    };

    reader.readAsBinaryString(file);
}
document.getElementById("loginBtn").addEventListener("click", function() {
    alert("Connexion en cours...");
});

document.getElementById("logoutBtn").addEventListener("click", function() {
    alert("Déconnexion effectuée !");
});
