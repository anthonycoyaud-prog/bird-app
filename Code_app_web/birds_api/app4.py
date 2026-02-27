# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import pyodbc
from config import Config

app = Flask(__name__)
CORS(app)

def get_db_connection():
    return pyodbc.connect(Config.DB_CONNECTION_STRING)

# --- ROUTES ---

# GET /api/species -> Liste des espèces (utilisant la vue SQL)
@app.route('/api/species', methods=['GET'])
def get_all_species():
    conn = get_db_connection()
    cursor = conn.cursor()
    # On utilise la vue pour un affichage rapide
    cursor.execute("SELECT * FROM dbo.All_info")
    
    columns = [column[0] for column in cursor.description]
    species_list = []
    for row in cursor.fetchall():
        species_list.append(dict(zip(columns, row)))
    
    conn.close()
    return jsonify(species_list)

# !!! AJOUT DE LA ROUTE MANQUANTE POUR LE FRONTEND !!!
# GET /api/species/<id> -> Récupérer un oiseau spécifique (via la vue)
@app.route('/api/species/<int:bird_id>', methods=['GET'])
def get_one_species(bird_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # On requête la vue avec un filtre sur l'ID
    query = "SELECT * FROM dbo.All_info WHERE id_oiseau = ?"
    cursor.execute(query, bird_id)
    row = cursor.fetchone()
    conn.close()
    
    if row:
        # Transformation du résultat en dictionnaire JSON
        columns = [column[0] for column in cursor.description]
        return jsonify(dict(zip(columns, row)))
    
    return jsonify({"error": "Oiseau non trouvé"}), 404

# POST /api/species -> Ajouter un oiseau 
@app.route('/api/species', methods=['POST'])
def add_bird():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # 1. Insertion Taxonomie
        cursor.execute(
            "INSERT INTO taxonomie (ordre, famille, genre) VALUES (?, ?, ?)",
            (data['ordre'], data['famille'], data['genre'])
        )
        cursor.execute("SELECT @@IDENTITY")
        tax_id = cursor.fetchone()[0]
        
        # 2. Insertion Caractéristiques
        cursor.execute(
            "INSERT INTO caracteristique_physique (taille_cm, poids_min_g, poids_max_g, longevite_ans) VALUES (?, ?, ?, ?)",
            (data['taille_cm'], data['poids_min_g'], data['poids_max_g'], data['longevite_ans'])
        )
        cursor.execute("SELECT @@IDENTITY")
        carac_id = cursor.fetchone()[0]
        
        # 3. Insertion Population
        cursor.execute(
            "INSERT INTO population_repartition (population_estimee, zone_geographique) VALUES (?, ?)",
            (data['population_estimee'], data['zone_geographique'])
        )
        cursor.execute("SELECT @@IDENTITY")
        pop_id = cursor.fetchone()[0]
        
        # 4. Insertion Oiseau (Table principale)
        cursor.execute(
            "INSERT INTO oiseau (nom_commun, description, id_taxonomie, id_caracteristique, id_population) VALUES (?, ?, ?, ?, ?)",
            (data['nom_commun'], data['description'], tax_id, carac_id, pop_id)
        )
        cursor.execute("SELECT @@IDENTITY")
        bird_id = cursor.fetchone()[0]
        
        # 5. Insertion Pays (Si fourni)
        if 'id_pays' in data:
            cursor.execute(
                "INSERT INTO oiseau_pays (id_oiseau, id_pays) VALUES (?, ?)",
                (bird_id, data['id_pays'])
            )

        conn.commit()
        return jsonify({"message": "Oiseau et données associées ajoutés"}), 201
    
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# DELETE /api/species/<id> -> Supprimer un oiseau 
@app.route('/api/species/<int:bird_id>', methods=['DELETE'])
def delete_bird(bird_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Pour supprimer un oiseau, il faut supprimer ses dépendances d'abord
        cursor.execute("DELETE FROM image WHERE id_oiseau = ?", bird_id)
        cursor.execute("DELETE FROM oiseau_pays WHERE id_oiseau = ?", bird_id)
        cursor.execute("DELETE FROM auteur_oiseau WHERE id_oiseau = ?", bird_id)
        
        # Ensuite on supprime l'oiseau lui-même
        cursor.execute("DELETE FROM oiseau WHERE id_oiseau = ?", bird_id)
        
        conn.commit()
        return jsonify({"message": "Oiseau supprimé avec succès"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

if __name__ == '__main__':
    app.run(debug=True, port=5000)