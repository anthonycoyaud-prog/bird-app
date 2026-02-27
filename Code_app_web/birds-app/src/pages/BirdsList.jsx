import { useState, useEffect } from 'react';
import BirdCard from '../components/BirdCard';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/cards.css';

export default function BirdsList() {
  const [birds, setBirds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBirds();
  }, []);

  const fetchBirds = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/species');
      if (!response.ok) throw new Error('Failed to fetch birds');
      const data = await response.json();
      setBirds(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching birds:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">Erreur: {error}</div>;

  return (
    <div className="birds-list-container">
      <h1>Galerie Oiseaux</h1>
      {birds.length === 0 ? (
        <p className="no-data">Aucun oiseau trouvé. Ajoutez des oiseaux pour commencer!</p>
      ) : (
        <div className="birds-grid">
          {birds.map(bird => (
            <BirdCard key={bird.id_oiseau} bird={bird} />
          ))}
        </div>
      )}
    </div>
  );
}
