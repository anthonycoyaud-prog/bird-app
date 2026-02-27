
CREATE TABLE oiseau (
    id_oiseau INT PRIMARY KEY,
    nom_commun VARCHAR(255),
    description TEXT,
    id_taxonomie INT,
    id_caracteristique INT,
    id_population INT
);

CREATE TABLE auteur (
    id_auteur INT PRIMARY KEY,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    email VARCHAR(255)
);

CREATE TABLE auteur_oiseau (
    id_auteur INT,
    id_oiseau INT,
    PRIMARY KEY (id_auteur, id_oiseau),
    FOREIGN KEY (id_auteur) REFERENCES auteur(id_auteur),
    FOREIGN KEY (id_oiseau) REFERENCES oiseau(id_oiseau)
);

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

CREATE TABLE pays (
    id_pays INT PRIMARY KEY,
    nom_pays VARCHAR(100)
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
    date_upload DATE,
    id_oiseau INT,
    FOREIGN KEY (id_oiseau) REFERENCES oiseau(id_oiseau)
);
