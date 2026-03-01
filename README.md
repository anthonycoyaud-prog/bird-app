# Birds Project - API & App Web

Avant toute chose, le projet se distingue entre la partie rapport et la partie code_app_web

Cette application permet de gérer une base de données d'espèces d'oiseaux, d'ajouter des caractéristiques, des photos, et d'afficher des informations détaillées.

## 🛠️ Architecture

- **Backend**: Python Flask avec `pyodbc` pour la connexion SQL Server.
- **Frontend**: React.js.
- **Base de données**: SQL Server.

---

## 🚀 Prérequis

- Python 3.x installé.
- Node.js et npm installés.
- SQL Server avec la base de données configurée.

---

## 🐍 Partie Backend (API Flask)

Le backend se trouve dans le dossier `birds_api`.

### 0. Base de données

Ouvrir le script de création des tables et copier dans un sgbd (J'ai utilisé sql serveur)

### 1. Installation

Ouvrez un terminal dans le dossier `birds_api` et créez un environnement virtuel :

```bash
python -m venv venv
# Sur Windows :
.\venv\Scripts\activate
# Sur Mac/Linux :
source venv/bin/activate

```

Installez les dépendances :

```bash
pip install flask flask-cors pyodbc

```

### 2. Configuration

Créez ou modifiez le fichier `config.py` dans `birds_api` avec votre chaîne de connexion SQL Server :

```python
class Config:
    DB_CONNECTION_STRING = "DRIVER={SQL Server};SERVER=votre_serveur;DATABASE=oiseau;UID=votre_user;PWD=votre_password"

```

### 3. Lancer l'API

```bash
python app.py

```

L'API sera disponible sur `http://localhost:5000`.

### ⚡ Endpoints API

| Méthode  | URL                 | Description                                 |
| -------- | ------------------- | ------------------------------------------- |
| `GET`    | `/api/species`      | Récupère toutes les espèces (via Vue SQL)   |
| `GET`    | `/api/species/<id>` | Récupère les détails d'un oiseau spécifique |
| `POST`   | `/api/species`      | Ajoute un nouvel oiseau et ses dépendances  |
| `DELETE` | `/api/species/<id>` | Supprime un oiseau et ses dépendances       |

---

## ⚛️ Partie Frontend (App React)

Le frontend se trouve dans le dossier `birds-app`.

### 1. Installation

Ouvrez un terminal dans le dossier `birds-app` et installez les dépendances :

pnpm install

### 2. Configuration des Images Locales

Pour afficher les images, placez vos fichiers `.jpg` ou `.jpeg` dans le dossier `public/image/`.
Dans la base de données, les chemins doivent ressembler à : `public\image\nom_image.jpeg`.

### 3. Lancer l'application web

pnpm dev

## 📂 Structure du projet

```text
/
├── birds_api/
│   ├── app.py           # API Flask
│   ├── config.py        # Configuration DB
│   └── venv/            # Environnement virtuel Python
└── birds-app/
    ├── public/
    │   └── image/       # Images locales pour React
    ├── src/
    │   ├── components/  # Composants réutilisables (Navbar, Card)
    │   └── pages/       # Pages (List, Details, Add)
    └── package.json

```
