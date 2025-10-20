// Définition des catégories et de la liste initiale
const CATEGORIES = [
    "Infopromo", "Vidéaste", "Graphiste", "Communication", "Digital"
];

const GENRES = [
    { code: "F", nom: "Fille" },
    { code: "M", nom: "Garçon" }
];

// LISTE COMPLÈTE MIXTE
const initialParticipantsData = [
    // --- Filles (Existant) ---
    { nom: "Emma", categorie: "Infopromo", genre: "F" },
    { nom: "Naida", categorie: "Infopromo", genre: "F" },
    { nom: "Noémie", categorie: "Infopromo", genre: "F" },
    { nom: "Mari lou", categorie: "Infopromo", genre: "F" },
    { nom: "Elena", categorie: "Infopromo", genre: "F" },
    { nom: "Emma (2)", categorie: "Vidéaste", genre: "F" },
    { nom: "Lyna", categorie: "Vidéaste", genre: "F" },
    { nom: "Tiph", categorie: "Vidéaste", genre: "F" },
    { nom: "Mél", categorie: "Vidéaste", genre: "F" },
    { nom: "Manon", categorie: "Graphiste", genre: "F" },
    { nom: "Shelley", categorie: "Graphiste", genre: "F" },
    { nom: "Lina", categorie: "Graphiste", genre: "F" },
    { nom: "Sophia", categorie: "Graphiste", genre: "F" },
    { nom: "Alyssa", categorie: "Graphiste", genre: "F" },
    { nom: "Celine", categorie: "Communication", genre: "F" },
    { nom: "Astrid", categorie: "Communication", genre: "F" },
    { nom: "Julie", categorie: "Communication", genre: "F" },
    { nom: "Hella", categorie: "Communication", genre: "F" },
    { nom: "Juliette", categorie: "Communication", genre: "F" },
    { nom: "Camille", categorie: "Communication", genre: "F" },
    { nom: "Alexia", categorie: "Communication", genre: "F" },
    { nom: "Elisa", categorie: "Communication", genre: "F" },
    { nom: "Fabienne", categorie: "Communication", genre: "F" },
    { nom: "Ludivine", categorie: "Communication", genre: "F" },
    { nom: "Victoria", categorie: "Communication", genre: "F" },
    { nom: "Léa", categorie: "Communication", genre: "F" },
    { nom: "Iris", categorie: "Digital", genre: "F" },
    { nom: "Élodie", categorie: "Digital", genre: "F" },
    { nom: "Fatimé", categorie: "Digital", genre: "F" },
    
    // --- Garçons (Nouveau) ---
    { nom: "Jean", categorie: "Digital", genre: "M" },
    { nom: "Thibaut", categorie: "Digital", genre: "M" },
    { nom: "Lucas", categorie: "Digital", genre: "M" },
    { nom: "Tého", categorie: "Digital", genre: "M" },
    { nom: "Théo", categorie: "Digital", genre: "M" },
    { nom: "Vincent", categorie: "Vidéaste", genre: "M" },
    { nom: "Miguel", categorie: "Vidéaste", genre: "M" },
    { nom: "Emeric", categorie: "Vidéaste", genre: "M" },
    { nom: "Romain LL", categorie: "Communication", genre: "M" },
    { nom: "Thomas", categorie: "Graphiste", genre: "M" },
    { nom: "Evan", categorie: "Graphiste", genre: "M" },
    { nom: "Alexandre", categorie: "Graphiste", genre: "M" },
    { nom: "Romain LG", categorie: "Graphiste", genre: "M" },
    { nom: "Haykel", categorie: "Graphiste", genre: "M" },
    { nom: "Adelane", categorie: "Infopromo", genre: "M" }
];

let participants = []; 
let matchsActuels = []; 
let historiqueTours = []; 
let tourEnCours = 0;
let tournoiDemarre = false;

let palmares = {
    vainqueur: null,
    deuxieme: null,
    troisiemes: []
};

const MIN_PARTICIPANTS = 2; 

// --- FONCTIONS UTILITAIRES ---

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function initialiserParticipants() {
    participants = initialParticipantsData.map((data, index) => ({
        id: index + 1,
        nom: data.nom,
        categorie: data.categorie,
        genre: data.genre, // Ajout du genre
        victoireTour: false
    }));
    
    matchsActuels = [];
    historiqueTours = [];
    tournoiDemarre = false;
    tourEnCours = 0;
    palmares = { vainqueur: null, deuxieme: null, troisiemes: [] }; 
    
    document.getElementById('podiumSection').style.display = 'none';
    document.getElementById('vainqueurMessage').textContent = "Appuyez sur 'Démarrer le Tournoi' pour commencer !";
    
    chargerCategoriesFiltres();
    afficherParticipants(); 
    afficherControles();
    afficherHistorique();
}

function reinitialiserParticipants() {
    if (tournoiDemarre) {
        if (confirm("Le tournoi est en cours. Voulez-vous vraiment recommencer avec la liste par défaut ?")) {
             initialiserParticipants();
        }
    } else if (confirm("Êtes-vous sûr de vouloir réinitialiser la liste à sa version par défaut ?")) {
        initialiserParticipants();
    }
}

/**
 * NOUVEAU: Gère la logique de création des cases à cocher de filtre.
 */
function createCheckboxFilter(containerId, options, isGenreFilter) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    const allCode = isGenreFilter ? 'TousGenre' : 'TousCategorie';
    const allLabel = isGenreFilter ? 'Tous' : 'Tous les Services';
    
    // Ajout de la case "Tous"
    const checkboxTous = document.createElement('input');
    checkboxTous.type = 'checkbox';
    checkboxTous.id = `filtre-${allCode}`;
    checkboxTous.value = allCode;
    checkboxTous.checked = true;
    checkboxTous.onchange = () => {
        const isChecked = checkboxTous.checked;
        document.querySelectorAll(`#${containerId} input[type="checkbox"]:not(#filtre-${allCode})`).forEach(cb => {
            cb.checked = isChecked;
        });
        afficherParticipants();
    };
    container.appendChild(checkboxTous);
    
    const labelTous = document.createElement('label');
    labelTous.htmlFor = `filtre-${allCode}`;
    labelTous.textContent = allLabel;
    container.appendChild(labelTous);
    
    // Ajout des cases par option
    options.forEach(option => {
        const value = isGenreFilter ? option.code : option;
        const labelText = isGenreFilter ? option.nom : option;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `filtre-${value.replace(/\s/g, '')}`;
        checkbox.value = value;
        checkbox.checked = true;
        checkbox.onchange = () => {
            if (!checkbox.checked) {
                document.getElementById(`filtre-${allCode}`).checked = false;
            } else if (Array.from(document.querySelectorAll(`#${containerId} input[type="checkbox"]:not(#filtre-${allCode})`)).every(cb => cb.checked)) {
                document.getElementById(`filtre-${allCode}`).checked = true;
            }
            afficherParticipants();
        };
        container.appendChild(checkbox);
        
        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = labelText;
        container.appendChild(label);
    });
}

function chargerCategoriesFiltres() {
    const selectAddCat = document.getElementById('categorieParticipant');
    const selectAddGenre = document.getElementById('genreParticipant');

    // Options d'ajout de catégorie (inchangé)
    selectAddCat.innerHTML = '';
    CATEGORIES.forEach(cat => {
        const optAdd = document.createElement('option');
        optAdd.value = cat;
        optAdd.textContent = cat;
        selectAddCat.appendChild(optAdd);
    });
    
    // Options d'ajout de genre (déjà fait en HTML, on le vide juste)
    // Le HTML contient déjà les options M/F, c'est suffisant.
    
    // Création des filtres par Service
    createCheckboxFilter('filtreCheckboxContainerCategorie', CATEGORIES, false);

    // Création des filtres par Genre
    createCheckboxFilter('filtreCheckboxContainerGenre', GENRES, true);
}

function genererMatchs(listeParticipantes) {
    shuffle(listeParticipantes); 

    let nouvellesPaires = [];
    let byes = [];
    
    for (let i = 0; i < listeParticipantes.length; i += 2) {
        if (i + 1 < listeParticipantes.length) {
            nouvellesPaires.push({
                matchId: nouvellesPaires.length,
                joueur1: listeParticipantes[i],
                joueur2: listeParticipantes[i + 1],
                vainqueur: null,
                perdant: null,
                termine: false
            });
        } else {
            listeParticipantes[i].victoireTour = true;
            byes.push(listeParticipantes[i]);
        }
    }
    
    matchsActuels = nouvellesPaires;
    tourEnCours++;
    
    historiqueTours.push({
        tour: tourEnCours,
        matchs: [],
        byes: byes
    });
}


// --- FONCTIONS DE GESTION DES ACTIONS ---

/**
 * NOUVEAU: Récupère les valeurs des checkboxes pour un conteneur donné.
 */
function getSelectedFilters(containerId) {
    return Array.from(document.querySelectorAll(`#${containerId} input[type="checkbox"]:checked`))
        .map(cb => cb.value)
        .filter(v => v !== 'Tous' && v !== 'TousGenre' && v !== 'TousCategorie');
}

function demarrerProchainTour() {
    let participantesTourSuivant = participants.filter(p => p.victoireTour);
    let listeDepart = [];

    if (!tournoiDemarre) {
        // Détermination des catégories et genres sélectionnés
        const categoriesSélectionnées = getSelectedFilters('filtreCheckboxContainerCategorie');
        const genresSélectionnés = getSelectedFilters('filtreCheckboxContainerGenre');

        if (categoriesSélectionnées.length === 0 || genresSélectionnés.length === 0) {
            alert("Veuillez sélectionner au moins un service ET un genre pour démarrer le tournoi.");
            return;
        }

        // DOUBLE FILTRAGE
        listeDepart = participants.filter(p => 
            categoriesSélectionnées.includes(p.categorie) &&
            genresSélectionnés.includes(p.genre)
        );
        
        if (listeDepart.length < MIN_PARTICIPANTS) {
            alert(`Il faut au moins ${MIN_PARTICIPANTS} participantes/participants dans les filtres sélectionnés pour démarrer le tournoi !`);
            return;
        }
        
        participantesTourSuivant = listeDepart;
        tournoiDemarre = true;
        palmarès = { vainqueur: null, deuxieme: null, troisiemes: [] };
    }
    
    if (participantesTourSuivant.length === 1) {
        afficherVainqueurFinal(participantesTourSuivant[0]);
        return;
    }
    
    participants.forEach(p => p.victoireTour = false);

    genererMatchs(participantesTourSuivant);
    
    document.getElementById('vainqueurMessage').textContent = `Début du Tour ${tourEnCours} (${matchsActuels.length} matchs) ! Votez pour chaque match.`;
    afficherParticipants();
    afficherControles();
    afficherHistorique();
}

function voterMatch(matchId, joueurQuiVote) {
    const match = matchsActuels.find(m => m.matchId === matchId);
    if (!match || match.termine) return;

    const vainqueur = (joueurQuiVote === 1) ? match.joueur1 : match.joueur2;
    const perdant = (joueurQuiVote === 1) ? match.joueur2 : match.joueur1;
    
    match.termine = true;
    match.vainqueur = vainqueur;
    match.perdant = perdant;
    vainqueur.victoireTour = true;
    
    // Logique du Palmarès
    if (matchsActuels.length === 1) { 
        palmares.deuxieme = perdant;
    } else if (matchsActuels.length === 2) { 
        palmares.troisiemes.push(perdant);
    }
    
    historiqueTours[tourEnCours - 1].matchs.push({
        joueur1: match.joueur1.nom,
        joueur2: match.joueur2.nom,
        vainqueur: vainqueur.nom,
        perdant: perdant.nom
    });
    
    // --- Mise à jour Visuelle Immédiate ---
    const nomVainqueurElement = document.querySelector(`#match-${matchId} #nom-${matchId}-${joueurQuiVote} .nom`);
    const nomPerdantElement = document.querySelector(`#match-${matchId} #nom-${matchId}-${joueurQuiVote === 1 ? 2 : 1} .nom`);
    const voteAreaVainqueur = document.querySelector(`#match-${matchId} #vote-area-${matchId}-${joueurQuiVote}`);
    const voteAreaPerdant = document.querySelector(`#match-${matchId} #vote-area-${matchId}-${joueurQuiVote === 1 ? 2 : 1}`);
    
    if (nomVainqueurElement && nomPerdantElement && voteAreaVainqueur && voteAreaPerdant) {
        nomVainqueurElement.classList.add('vainqueur');
        nomPerdantElement.classList.add('perdant');
        
        voteAreaVainqueur.innerHTML = '<span class="score-result">VAINQUEUR</span>';
        voteAreaPerdant.innerHTML = '<span class="score-result">ÉLIMINÉE</span>';
    }
    
    if (matchsActuels.every(m => m.termine)) {
        document.getElementById('vainqueurMessage').textContent = "Tous les matchs du tour sont terminés. Passage au tour suivant...";
        afficherHistorique();
        setTimeout(demarrerProchainTour, 2000); 
    }
}


// --- FONCTIONS D'AFFICHAGE ---

function toggleHistorique() {
    const container = document.getElementById('historiqueContainer');
    const button = document.getElementById('toggleHistorique');
    
    if (container.style.display === 'none') {
        container.style.display = 'block';
        button.textContent = 'Masquer l\'historique ▲';
    } else {
        button.textContent = 'Afficher l\'historique ▼';
        container.style.display = 'none';
    }
}

function afficherControles() {
    const divControles = document.getElementById('tournoiControles');
    if (!divControles) return;
    
    divControles.innerHTML = '';
    
    if (!tournoiDemarre) {
        const btnDemarrer = document.createElement('button');
        
        const categoriesSélectionnées = getSelectedFilters('filtreCheckboxContainerCategorie');
        const genresSélectionnés = getSelectedFilters('filtreCheckboxContainerGenre');
        
        const listeFiltréeCount = participants.filter(p => 
            categoriesSélectionnées.includes(p.categorie) &&
            genresSélectionnés.includes(p.genre)
        ).length;
        
        btnDemarrer.textContent = `Démarrer le Tournoi (${listeFiltréeCount} participants sélectionnés)`;
        btnDemarrer.onclick = demarrerProchainTour;
        divControles.appendChild(btnDemarrer);
    } 
    
    const btnReinit = document.createElement('button');
    btnReinit.textContent = "Réinitialiser le Tournoi";
    btnReinit.onclick = reinitialiserParticipants;
    btnReinit.style.marginLeft = '10px';
    divControles.appendChild(btnReinit);
}

/**
 * Mise à jour: Filtre la liste d'édition par Service ET Genre.
 */
function afficherParticipants() {
    const ul = document.getElementById('participantsList');
    if (!ul) return;
    
    ul.innerHTML = ''; 
    ul.classList.remove('liste-edition', 'liste-match');
    
    if (!tournoiDemarre) {
        // Mode ÉDITION/LISTE INITIALE
        const categoriesAffichées = getSelectedFilters('filtreCheckboxContainerCategorie');
        const genresAffichés = getSelectedFilters('filtreCheckboxContainerGenre');
        
        ul.classList.add('liste-edition');
        
        // Double filtrage pour l'affichage de la liste
        const listeFiltrée = participants.filter(p => 
            categoriesAffichées.includes(p.categorie) &&
            genresAffichés.includes(p.genre)
        );

        listeFiltrée.forEach((p) => {
            const indexDansParticipants = participants.findIndex(item => item.id === p.id);
            
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${p.nom} (Service: <strong>${p.categorie}</strong>, Genre: <strong>${p.genre}</strong>)</span>
                <button class="delete-btn" onclick="supprimerParticipant(${indexDansParticipants})">X Supprimer</button>
            `;
            ul.appendChild(li);
        });
        
        afficherControles(); 

    } else {
        // Mode MATCHS EN COURS (Logique inchangée)
        ul.classList.add('liste-match');
        
        matchsActuels.forEach(match => {
            const li = document.createElement('li');
            li.id = `match-${match.matchId}`; 
            
            const getNomClasses = (joueur) => {
                if (!match.termine) return '';
                return match.vainqueur && match.vainqueur.id === joueur.id ? 'vainqueur' : 'perdant';
            };
            
            const getJoueurContent = (joueur, index) => {
                const nomClass = getNomClasses(joueur);
                const isVainqueur = match.vainqueur && match.vainqueur.id === joueur.id;
                
                return `
                    <div id="nom-${match.matchId}-${index}" class="match-participant">
                        <span class="nom ${nomClass}">${joueur.nom}</span>
                        <span class="service">${joueur.categorie} / ${joueur.genre}</span>
                    </div>
                    <div id="vote-area-${match.matchId}-${index}" class="vote-area">
                        ${!match.termine 
                            ? `<button class="vote-btn" onclick="voterMatch(${match.matchId}, ${index})">VOTER</button>`
                            : `<span class="score-result">${isVainqueur ? 'VAINQUEUR' : 'ÉLIMINÉE'}</span>`
                        }
                    </div>
                `;
            };

            const joueur1Content = getJoueurContent(match.joueur1, 1);
            
            li.innerHTML = `
                <div style="display: flex; align-items: center; width: 40%; justify-content: flex-start;">
                    ${joueur1Content}
                </div> 
                <span class="vs">VS</span> 
                <div style="display: flex; align-items: center; width: 40%; justify-content: flex-end;">
                    <div id="vote-area-${match.matchId}-2" class="vote-area">
                        ${!match.termine 
                            ? `<button class="vote-btn" onclick="voterMatch(${match.matchId}, 2)">VOTER</button>`
                            : `<span class="score-result">${match.vainqueur && match.vainqueur.id === match.joueur2.id ? 'VAINQUEUR' : 'ÉLIMINÉE'}</span>`
                        }
                    </div>
                    <div id="nom-${match.matchId}-2" class="match-participant" style="margin-left: 10px;">
                        <span class="nom ${getNomClasses(match.joueur2)}">${match.joueur2.nom}</span>
                        <span class="service">${match.joueur2.categorie} / ${match.joueur2.genre}</span>
                    </div>
                </div>
            `;
            
            ul.appendChild(li);
        });

        // Affiche les participantes passées par "BYE"
        const participantesBye = participants.filter(p => p.victoireTour && !matchsActuels.find(m => m.joueur1.id === p.id || m.joueur2.id === p.id));
        participantesBye.forEach(p => {
             const li = document.createElement('li');
             li.className = 'match-termine';
             li.style.cssText = 'background-color: var(--color-secondary); border: 1px dashed var(--color-success);';
             li.innerHTML = `<span style="font-weight: bold; color: var(--color-text); width: 100%; padding-left: 10px;">${p.nom} (Service: ${p.categorie} / ${p.genre}) passe directement au tour suivant (BYE)</span>`;
             ul.appendChild(li);
        });
    }
}

function afficherHistorique() {
    const container = document.getElementById('historiqueContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (historiqueTours.length === 0) {
        container.innerHTML = '<p>Aucun tour joué pour l\'instant.</p>';
        return;
    }
    
    historiqueTours.forEach(tourData => {
        const divTour = document.createElement('div');
        divTour.className = 'tour-historique';
        divTour.innerHTML = `<h4>Tour ${tourData.tour} (${tourData.matchs.length} Matchs)</h4>`;

        tourData.byes.forEach(p => {
            const pBye = document.createElement('p');
            pBye.innerHTML = `➡️ <span class="vainqueur">${p.nom}</span> (Passe par BYE)`;
            divTour.appendChild(pBye);
        });
        
        tourData.matchs.forEach(match => {
            const divMatch = document.createElement('div');
            divMatch.className = 'match-historique';
            divMatch.innerHTML = `
                <span class="perdant">${match.perdant}</span> 
                <span>🆚</span> 
                <span class="vainqueur">${match.vainqueur}</span>
            `;
            divTour.appendChild(divMatch);
        });
        
        container.appendChild(divTour);
    });
}

function supprimerParticipant(index) {
    if (tournoiDemarre) {
        alert("Le tournoi est démarré. Vous ne pouvez plus supprimer de participante.");
        return;
    }
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${participants[index].nom} ?`)) {
        participants.splice(index, 1);
        afficherParticipants();
        afficherControles();
    }
}

function ajouterParticipant() {
    if (tournoiDemarre) {
        alert("Le tournoi est démarré. Vous ne pouvez plus ajouter de participante.");
        return;
    }
    const input = document.getElementById('nomParticipant');
    const selectCat = document.getElementById('categorieParticipant');
    const selectGenre = document.getElementById('genreParticipant');
    const nom = input.value.trim();
    const categorie = selectCat.value;
    const genre = selectGenre.value; // Récupère le genre
    
    if (nom !== "") {
        if (participants.some(p => p.nom.toLowerCase() === nom.toLowerCase())) {
            alert("Cette participante/participant existe déjà.");
            return;
        }

        participants.push({
            id: participants.length + Math.random(), 
            nom: nom,
            categorie: categorie,
            genre: genre, // Enregistre le genre
            victoireTour: false
        });
        
        afficherParticipants();
        afficherControles();
        input.value = "";
    }
}

function afficherVainqueurFinal(vainqueur) {
    palmares.vainqueur = vainqueur;

    document.getElementById('participantsList').innerHTML = '';
    document.getElementById('vainqueurMessage').innerHTML = 
        `🎉 **LE GRAND VAINQUEUR EST :** 🥇 **${vainqueur.nom}** 🥇 🎉`;
    
    // Remplissage du podium
    document.getElementById('firstPlace').textContent = palmares.vainqueur ? palmares.vainqueur.nom : 'N/A';
    document.getElementById('secondPlace').textContent = palmares.deuxieme ? palmares.deuxieme.nom : 'N/A';
    
    const troisiemesNoms = palmares.troisiemes.map(p => p.nom);
    if (troisiemesNoms.length === 2) {
        document.getElementById('thirdFourthPlace').innerHTML = `${troisiemesNoms[0]}<br>et<br>${troisiemesNoms[1]}`;
    } else if (troisiemesNoms.length > 0) {
        document.getElementById('thirdFourthPlace').textContent = troisiemesNoms.join(', ');
    } else {
        document.getElementById('thirdFourthPlace').textContent = 'N/A';
    }
    
    document.getElementById('podiumSection').style.display = 'block';

    afficherHistorique();
    afficherControles(); 
}


// --- DÉMARRAGE ---
document.addEventListener('DOMContentLoaded', initialiserParticipants);