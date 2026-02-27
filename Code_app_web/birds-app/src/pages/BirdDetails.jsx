import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/global.css';

export default function BirdDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bird, setBird] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBirdDetails();
  }, [id]);

  const fetchBirdDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/species/${id}`);
      if (!response.ok) throw new Error('Bird not found');
      const data = await response.json();
      setBird(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet oiseau?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/species/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Erreur lors de la suppression de l\'oiseau');
        navigate('/');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">Erreur: {error}</div>;
  if (!bird) return <div className="error-message">Oiseau non trouvé</div>;

  // convert db path to web path for local images
  let localPath = bird.url_image
    ? bird.url_image.replace(/^public/i, '').replace(/\\/g, '/')
    : '';
  if (localPath && !localPath.startsWith('/')) {
    localPath = '/' + localPath;
  }
  const placeholder = '/image/default.jpg';
  const displayUrl = localPath || placeholder;

  const handleImgError = (e) => {
    e.target.onerror = null;
    e.target.src = placeholder;
  };

  return (
    <div className="details-container">
      <button onClick={() => navigate('/')} className="back-button">
        ← Retour
      </button>
      <div className="details-content">
        <div className="details-image">
          <img src={displayUrl} alt={bird.nom_commun} onError={handleImgError} />
        </div>
        <div className="details-info">
          <h1>{bird.nom_commun}</h1>
          <p className="description">{bird.description || 'N/A'}</p>

          <div className="info-section">
            <h2>Caractéristiques</h2>
            <p><strong>Taille:</strong> {bird.taille_cm || 'N/A'} cm</p>
            <p><strong>Poids:</strong> {bird.poids_min_g || 'N/A'} - {bird.poids_max_g || 'N/A'} g</p>
            <p><strong>Longévité:</strong> {bird.longevite_ans || 'N/A'} ans</p>
          </div>

          <div className="info-section">
            <h2>Classification</h2>
            <p><strong>Ordre:</strong> {bird.ordre || 'N/A'}</p>
            <p><strong>Famille:</strong> {bird.famille || 'N/A'}</p>
            <p><strong>Genre:</strong> {bird.genre || 'N/A'}</p>
          </div>

          <div className="info-section">
            <h2>Géographie et Population</h2>
            <p><strong>Zone Géographique:</strong> {bird.zone_geographique || 'N/A'}</p>
            <p><strong>Pays:</strong> {bird.nom_pays || 'N/A'}</p>
            <p><strong>Population Estimée:</strong> {bird.population_estimee || 'N/A'}</p>
          </div>

          <div className="info-section">
            <h2>Informations d'Enregistrement</h2>
            <p><strong>Auteur:</strong> {bird.prenom && bird.nom ? `${bird.prenom} ${bird.nom}` : 'N/A'}</p>
            <p><strong>Email:</strong> {bird.email ? <a href={`mailto:${bird.email}`}>{bird.email}</a> : 'N/A'}</p>
            <p><strong>Date d'Upload:</strong> {bird.date_upload ? new Date(bird.date_upload).toLocaleDateString() : 'N/A'}</p>
          </div>

          <button onClick={handleDelete} className="delete-button">
            Supprimer Oiseau
          </button>
        </div>
      </div>
    </div>
  );
}
