import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/forms.css';

export default function AddBird() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    size: '',
    weight: '',
    longevity: '',
    class: 'Aves',
    order: '',
    family: '',
    genus: '',
    species_name: '',
    population: '',
    population_status: 'Stable',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/species', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to add bird');

      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1>Ajouter un Nouvel Oiseau</h1>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="bird-form">
        <div className="form-section">
          <h2>Informations Générales</h2>
          
          <div className="form-group">
            <label htmlFor="name">Nom *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="ex: Pigeon Biset"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Décrivez l'oiseau..."
              rows="4"
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Caractéristiques Physiques</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="size">Taille (cm)</label>
              <input
                type="number"
                id="size"
                name="size"
                value={formData.size}
                onChange={handleChange}
                placeholder="ex: 23"
              />
            </div>

            <div className="form-group">
              <label htmlFor="weight">Poids (g)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="ex: 77"
              />
            </div>

            <div className="form-group">
              <label htmlFor="longevity">Longévité (années)</label>
              <input
                type="number"
                id="longevity"
                name="longevity"
                value={formData.longevity}
                onChange={handleChange}
                placeholder="ex: 14"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Taxonomie</h2>
          
          <div className="form-group">
            <label htmlFor="class">Classe</label>
            <input
              type="text"
              id="class"
              name="class"
              value={formData.class}
              onChange={handleChange}
              placeholder="ex: Aves"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="order">Ordre *</label>
              <input
                type="text"
                id="order"
                name="order"
                value={formData.order}
                onChange={handleChange}
                required
                placeholder="ex: Passeriformes"
              />
            </div>

            <div className="form-group">
              <label htmlFor="family">Famille *</label>
              <input
                type="text"
                id="family"
                name="family"
                value={formData.family}
                onChange={handleChange}
                required
                placeholder="ex: Turdidae"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="genus">Genre *</label>
              <input
                type="text"
                id="genus"
                name="genus"
                value={formData.genus}
                onChange={handleChange}
                required
                placeholder="ex: Turdus"
              />
            </div>

            <div className="form-group">
              <label htmlFor="species_name">Espèce *</label>
              <input
                type="text"
                id="species_name"
                name="species_name"
                value={formData.species_name}
                onChange={handleChange}
                required
                placeholder="ex: migratorius"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Population</h2>
          
          <div className="form-group">
            <label htmlFor="population">Population Estimée</label>
            <input
              type="text"
              id="population"
              name="population"
              value={formData.population}
              onChange={handleChange}
              placeholder="ex: 370 millions"
            />
          </div>

          <div className="form-group">
            <label htmlFor="population_status">Statut Population</label>
            <select
              id="population_status"
              name="population_status"
              value={formData.population_status}
              onChange={handleChange}
            >
              <option value="Stable">Stable</option>
              <option value="Increasing">En Augmentation</option>
              <option value="Decreasing">En Déclin</option>
              <option value="Unknown">Inconnu</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Ajout...' : 'Ajouter Oiseau'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="cancel-button"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
