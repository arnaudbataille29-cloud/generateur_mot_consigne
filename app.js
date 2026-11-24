const CATEGORIES = [
  { id: "poesie", label: "✒️ Poésie" },
  { id: "recit", label: "📖 Récit" },
  { id: "dialogue", label: "💬 Dialogue" },
  { id: "defi", label: "🎯 Défi" }
];

let consigneCourante = null;
let historique = chargerHistorique();

function pioche(liste) {
  return liste[Math.floor(Math.random() * liste.length)];
}

function categoriesActives() {
  const cases = document.querySelectorAll(".case-categorie input:checked");
  if (!cases.length) return CATEGORIES.map((c) => c.id);
  return Array.from(cases).map((c) => c.value);
}

function genererConsigne() {
  const cats = categoriesActives();
  const formes = FORMES.filter((f) => cats.includes(f.categorie));
  const forme = pioche(formes);
  const contrainte = pioche(CONTRAINTES);
  const avecTheme = Math.random() < 0.55;
  const theme = avecTheme ? pioche(THEMES) : null;
  const mots = tirerMots(3);
  consigneCourante = { forme, contrainte, theme, mots };
  afficherConsigne(consigneCourante);
}

function tirerMots(nombre, exclus = []) {
  const dispo = MOTS.filter((m) => !exclus.includes(m));
  const tires = [];
  let reste = dispo.slice();
  for (let i = 0; i < nombre; i++) {
    const mot = reste[Math.floor(Math.random() * reste.length)];
    tires.push(mot);
    reste = reste.filter((m) => m !== mot);
  }
  return tires;
}

function construirePhrase(c) {
  let phrase = c.forme.intro;
  if (c.theme) phrase += ` — thème : ${c.theme}`;
  phrase += `, ${c.contrainte}`;
  phrase += `, en utilisant les mots : ${c.mots.join(", ")}.`;
  return phrase;
}

function afficherConsigne(c) {
  document.getElementById("chargement").hidden = true;
  const resultat = document.getElementById("resultat");
  resultat.hidden = false;
  document.getElementById("phrase-consigne").textContent = construirePhrase(c);
  document.getElementById("detail-forme").textContent = c.forme.intro.replace(/^Écris /, "");
  document.getElementById("detail-contrainte").textContent = c.contrainte;
  document.getElementById("bloc-theme").style.display = c.theme ? "flex" : "none";
  document.getElementById("detail-theme").textContent = c.theme || "";
  const chips = document.getElementById("detail-mots");
  chips.replaceChildren();
  c.mots.forEach((mot) => {
    const span = document.createElement("span");
    span.textContent = mot;
    chips.appendChild(span);
  });
  document.getElementById("btn-mots").hidden = false;
  document.getElementById("btn-copier").hidden = false;
  historique = [construirePhrase(c), ...historique.filter((h) => h !== construirePhrase(c))].slice(0, 8);
  sauvegarderHistorique();
  afficherHistorique();
}

function regenererMots() {
  if (!consigneCourante) return;
  consigneCourante.mots = tirerMots(3, consigneCourante.mots);
  afficherConsigne(consigneCourante);
}

async function copierConsigne() {
  if (!consigneCourante) return;
  const texte = construirePhrase(consigneCourante);
  try {
    await navigator.clipboard.writeText(texte);
  } catch {
    const zone = document.createElement("textarea");
    zone.value = texte;
    document.body.appendChild(zone);
    zone.select();
    document.execCommand("copy");
    zone.remove();
  }
  const btn = document.getElementById("btn-copier");
  btn.textContent = "✅ Copié !";
  setTimeout(() => (btn.textContent = "📋 Copier"), 1500);
}

function chargerHistorique() {
  try {
    return JSON.parse(localStorage.getItem("historique-consignes") || "[]");
  } catch {
    return [];
  }
}

function sauvegarderHistorique() {
  try {
    localStorage.setItem("historique-consignes", JSON.stringify(historique));
  } catch {
  }
}

function afficherHistorique() {
  const bloc = document.getElementById("bloc-historique");
  const liste = document.getElementById("liste-historique");
  bloc.hidden = historique.length === 0;
  liste.replaceChildren();
  historique.forEach((phrase) => {
    const li = document.createElement("li");
    li.textContent = phrase;
    li.title = "Copier cette consigne";
    li.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(phrase);
      } catch {
      }
    });
    liste.appendChild(li);
  });
}

function afficherFiltres() {
  const conteneur = document.getElementById("cases-categories");
  CATEGORIES.forEach((cat) => {
    const div = document.createElement("div");
    div.className = "case-categorie";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = `cat-${cat.id}`;
    input.value = cat.id;
    input.checked = true;
    const label = document.createElement("label");
    label.htmlFor = input.id;
    label.textContent = cat.label;
    div.append(input, label);
    conteneur.appendChild(div);
  });
}

document.getElementById("btn-generer").addEventListener("click", genererConsigne);
document.getElementById("btn-mots").addEventListener("click", regenererMots);
document.getElementById("btn-copier").addEventListener("click", copierConsigne);

afficherFiltres();
afficherHistorique();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
