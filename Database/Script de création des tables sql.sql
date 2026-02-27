-- =============================================
-- 1. Création de la base de données
-- =============================================
CREATE DATABASE oiseau;
GO

USE oiseau;
GO

-- =============================================
-- 2. Création des tables sans clés étrangères
-- =============================================

CREATE TABLE taxonomie (
    id_taxonomie INT PRIMARY KEY,
    ordre VARCHAR(100),
    famille VARCHAR(100),
    genre VARCHAR(100)
);

CREATE TABLE caracteristique_physique (
    id_caracteristique INT PRIMARY KEY,
    taille_cm DECIMAL(6,2),
    poids_min_g DECIMAL(10,2),
    poids_max_g DECIMAL(10,2),
    longevite_ans DECIMAL(5,2)
);

CREATE TABLE population_repartition (
    id_population INT PRIMARY KEY,
    population_estimee DECIMAL(12,2),
    zone_geographique VARCHAR(255)
);

CREATE TABLE auteur (
    id_auteur INT PRIMARY KEY,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    email VARCHAR(255)
);

CREATE TABLE pays (
    id_pays INT PRIMARY KEY,
    nom_pays VARCHAR(100)
);

-- =============================================
-- 3. Création des tables avec clés étrangères
-- =============================================

CREATE TABLE oiseau (
    id_oiseau INT PRIMARY KEY,
    nom_commun VARCHAR(255),
    description TEXT,
    id_taxonomie INT,
    id_caracteristique INT,
    id_population INT,
    FOREIGN KEY (id_taxonomie) REFERENCES taxonomie(id_taxonomie),
    FOREIGN KEY (id_caracteristique) REFERENCES caracteristique_physique(id_caracteristique),
    FOREIGN KEY (id_population) REFERENCES population_repartition(id_population)
);

CREATE TABLE auteur_oiseau (
    id_auteur INT,
    id_oiseau INT,
    PRIMARY KEY (id_auteur, id_oiseau),
    FOREIGN KEY (id_auteur) REFERENCES auteur(id_auteur),
    FOREIGN KEY (id_oiseau) REFERENCES oiseau(id_oiseau)
);

CREATE TABLE oiseau_pays (
    id_oiseau INT,
    id_pays INT,
    PRIMARY KEY (id_oiseau, id_pays),
    FOREIGN KEY (id_oiseau) REFERENCES oiseau(id_oiseau),
    FOREIGN KEY (id_pays) REFERENCES pays(id_pays)
);

CREATE TABLE image (
    id_image INT PRIMARY KEY,
    url_image VARCHAR(255),
    date_upload DATETIME, -- Modifié de DATE à DATETIME pour stocker l'heure exacte
    id_oiseau INT,
    FOREIGN KEY (id_oiseau) REFERENCES oiseau(id_oiseau)
);

-- =============================================
-- 4. Insertion des données (basé sur le script Python)
-- =============================================

-- Insertion taxonomie
INSERT INTO taxonomie (id_taxonomie, ordre, famille, genre) VALUES 
(1, 'Accipitriformes', 'Accipitridae', 'Aquila'),
(2, 'Sphenisciformes', 'Spheniscidae', 'Eudyptula'),
(3, 'Passeriformes', 'Corvidae', 'Corvus'),
(4, 'Strigiformes', 'Strigidae', 'Bubo');

-- Insertion caracteristique_physique
INSERT INTO caracteristique_physique (id_caracteristique, taille_cm, poids_min_g, poids_max_g, longevite_ans) VALUES 
(1, 90, 3630, 6700, 25),
(2, 39, 500, 750, 20),
(3, 65, 800, 1600, 15),
(4, 65, 2000, 3000, 20);

-- Insertion population_repartition
INSERT INTO population_repartition (id_population, population_estimee, zone_geographique) VALUES 
(1, 250, 'Europe'),
(2, 300, 'Australie'),
(3, 1000000, 'Mondial'),
(4, 50000, 'Eurasie');

-- Insertion auteur
INSERT INTO auteur (id_auteur, nom, prenom, email) VALUES 
(1, 'Dupont', 'Jean', 'jean.dupont@email.com'),
(2, 'Martin', 'Claire', 'claire.martin@email.com');

-- Insertion pays
INSERT INTO pays (id_pays, nom_pays) VALUES 
(1, 'France'),
(2, 'Australie'),
(3, 'États-Unis');

-- Insertion oiseau
INSERT INTO oiseau (id_oiseau, nom_commun, description, id_taxonomie, id_caracteristique, id_population) VALUES 
(1, 'Aigle royal', 'Grand rapace majestueux', 1, 1, 1),
(2, 'Petit Pingouin', 'Plus petit manchot du monde', 2, 2, 2),
(3, 'Corbeau commun', 'Oiseau intelligent et adaptable', 3, 3, 3),
(4, 'Hibou Grand-duc', 'Grand rapace nocturne', 4, 4, 4);

-- Insertion auteur_oiseau
INSERT INTO auteur_oiseau (id_auteur, id_oiseau) VALUES 
(1, 1),
(2, 2),
(1, 3);

-- Insertion oiseau_pays
INSERT INTO oiseau_pays (id_oiseau, id_pays) VALUES 
(1, 1),
(2, 2),
(3, 1),
(3, 3);

-- Insertion image
-- Les dates sont générées dynamiquement pour correspondre au comportement de datetime.now()
INSERT INTO image (id_image, url_image, date_upload, id_oiseau) VALUES 
(1, 'public\image\Aigle royal.jpeg', GETDATE(), 1),
(2, 'public\image\Petit Pingouin.jpeg', GETDATE(), 2),
(3, 'public\image\Corbeau commun.jpeg', GETDATE(), 3),
(4, 'public\image\Hibou Grand-duc.jpeg', GETDATE(), 4);