import { useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/forms.css';

export default function DetectBird() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
      setError(null);
      setResult(null);
    }
  };

  const handleDetect = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Veuillez sélectionner une image');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:5000/api/detect', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Erreur lors de la détection');

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="form-container">
      <h1>Détecter une Espèce d'Oiseau</h1>
      <p className="subtitle">Téléchargez une image pour identifier l'espèce d'oiseau à l'aide de la détection par IA</p>
      
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleDetect} className="detect-form">
        <div className="form-group">
          <label htmlFor="image-input" className="file-upload-label">
            Choisir une Image *
          </label>
          <input
            type="file"
            id="image-input"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </div>

        {preview && (
          <div className="preview-section">
            <h3>Aperçu de l'Image</h3>
            <img src={preview} alt="Aperçu" className="preview-image" />
          </div>
        )}

        {result && (
          <div className="result-section">
            <h3>Résultats de la Détection</h3>
            <div className="result-card">
              <p><strong>Espèce:</strong> {result.species || 'Inconnue'}</p>
              <p><strong>Confiance:</strong> {result.confidence ? `${(result.confidence * 100).toFixed(2)}%` : 'N/A'}</p>
              {result.description && (
                <p><strong>Description:</strong> {result.description}</p>
              )}
            </div>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="submit-button">
            Détecter un Oiseau
          </button>
          {preview && (
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setPreview(null);
                setResult(null);
              }}
              className="cancel-button"
            >
              Effacer
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
