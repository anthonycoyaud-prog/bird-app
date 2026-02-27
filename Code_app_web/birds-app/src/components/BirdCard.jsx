import { Link } from 'react-router-dom';
import '../styles/cards.css';

export default function BirdCard({ bird }) {
  const placeholder = '/image/default.jpg';
  // convert database path to web path, remove public and backslashes
  let localPath = bird.url_image
    ? bird.url_image.replace(/^public/i, '').replace(/\\/g, '/')
    : '';
  if (localPath && !localPath.startsWith('/')) {
    localPath = '/' + localPath;
  }
  const imageUrl = localPath || placeholder;

  const handleImgError = (e) => {
    e.target.onerror = null; // prevent infinite loop
    e.target.src = placeholder;
  };

  return (
    <div className="bird-card">
      <div className="card-image">
        <img
          src={imageUrl}
          alt={bird.nom_commun}
          onError={handleImgError}
        />
      </div>
      <div className="card-content">
        <h3 className="card-title">{bird.nom_commun}</h3>
        <div className="card-info">
          <p><strong>Taille:</strong> {bird.taille_cm || 'N/A'} cm</p>
          <p><strong>Poids:</strong> {bird.poids_min_g || 'N/A'} g</p>
        </div>
        <Link to={`/bird/${bird.id_oiseau}`} className="card-link">
          Voir Détails
        </Link>
      </div>
    </div>
  );
}
