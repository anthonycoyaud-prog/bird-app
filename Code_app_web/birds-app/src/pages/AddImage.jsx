import { useState, useEffect } from 'react';
import '../styles/forms.css';

export default function AddImage() {
  const [species, setSpecies] = useState([]);
  const [selectedSpeciesId, setSelectedSpeciesId] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSpecies();
  }, []);

  const fetchSpecies = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/species');
      if (!response.ok) throw new Error('Failed to fetch species');
      const data = await response.json();
      setSpecies(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedSpeciesId) {
      setError('Veuillez sélectionner une espèce');
      return;
    }
    
    if (!file) {
      setError('Veuillez sélectionner une image');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('species_id', selectedSpeciesId);
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:5000/api/images', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Erreur lors du téléchargement de l\'image');

      setSuccess('Image téléchargée avec succès!');
      setFile(null);
      setSelectedSpeciesId('');
      e.target.reset();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1>Ajouter Image Oiseau</h1>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="image-form">
        <div className="form-group">
          <label htmlFor="species-select">Sélectionner une Espèce *</label>
          <select
            id="species-select"
            value={selectedSpeciesId}
            onChange={(e) => setSelectedSpeciesId(e.target.value)}
            required
          >
            <option value="">-- Choisir une espèce --</option>
            {species.map(bird => (
              <option key={bird.id_oiseau} value={bird.id_oiseau}>
                {bird.nom_commun}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="image-input">Fichier Image *</label>
          <input
            type="file"
            id="image-input"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
          {file && (
            <p className="file-info">Sélectionné: {file.name}</p>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Envoi...' : 'Uploader Image'}
          </button>
        </div>
      </form>
    </div>
  );
}
