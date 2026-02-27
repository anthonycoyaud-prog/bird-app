import { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/table.css';

export default function BirdsTable() {
  const [birds, setBirds] = useState([]);
  const [displayedBirds, setDisplayedBirds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('nom_commun');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterValue, setFilterValue] = useState('');

  useEffect(() => {
    fetchBirds();
  }, []);

  useEffect(() => {
    applyFiltering();
  }, [birds, sortBy, sortOrder, filterValue]);

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
    } finally {
      setLoading(false);
    }
  };

  const applyFiltering = () => {
    let filtered = [...birds];

    if (filterValue) {
      filtered = filtered.filter(bird => {
        const fieldValue = bird[sortBy];
        
        if (fieldValue === null || fieldValue === undefined) {
          return false;
        }

        const filterStr = filterValue.toLowerCase();
        const fieldStr = String(fieldValue).toLowerCase();

        // For string-based searches, use includes
        if (typeof fieldValue === 'string') {
          return fieldStr.includes(filterStr);
        }

        // For numeric searches, try to parse and compare
        const numFilter = parseFloat(filterValue);
        if (!isNaN(numFilter)) {
          return fieldValue === numFilter;
        }

        // Fallback to string contains
        return fieldStr.includes(filterStr);
      });
    }

    filtered.sort((a, b) => {
      let aVal = a[sortBy] || '';
      let bVal = b[sortBy] || '';

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      const aNum = Number(aVal) || 0;
      const bNum = Number(bVal) || 0;
      return sortOrder === 'asc' ? aNum - bNum : bNum - aNum;
    });

    setDisplayedBirds(filtered.slice(0, 20));
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) return ' ⇅';
    return sortOrder === 'asc' ? ' ↑' : ' ↓';
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">Erreur: {error}</div>;

  return (
    <div className="table-container">
      <h1>Tableau des Oiseaux</h1>
      
      <div className="filter-section">
        <label htmlFor="sort-select">Trier par: </label>
        <select 
          id="sort-select"
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="nom_commun">Nom</option>
          <option value="taille_cm">Taille (cm)</option>
          <option value="poids_min_g">Poids (g)</option>
          <option value="longevite_ans">Longévité (années)</option>
          <option value="population_estimee">Population</option>
        </select>

        <input
          type="text"
          placeholder={`Filtrer par ${sortBy}...`}
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="filter-input"
        />
      </div>

      {displayedBirds.length === 0 ? (
        <p className="no-data">Aucun oiseau trouvé correspondant à vos critères.</p>
      ) : (
        <div className="table-wrapper">
          <table className="birds-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('nom_commun')} className="sortable">
                  Nom {getSortIcon('nom_commun')}
                </th>
                <th onClick={() => handleSort('taille_cm')} className="sortable">
                  Taille (cm) {getSortIcon('taille_cm')}
                </th>
                <th onClick={() => handleSort('poids_min_g')} className="sortable">
                  Poids (g) {getSortIcon('poids_min_g')}
                </th>
                <th onClick={() => handleSort('longevite_ans')} className="sortable">
                  Longévité (ans) {getSortIcon('longevite_ans')}
                </th>
                <th onClick={() => handleSort('population_estimee')} className="sortable">
                  Population {getSortIcon('population_estimee')}
                </th>
                <th>Geographic Zone</th>
              </tr>
            </thead>
            <tbody>
              {displayedBirds.map(bird => (
                <tr key={bird.id_oiseau}>
                  <td>{bird.nom_commun}</td>
                  <td>{bird.taille_cm || 'N/A'}</td>
                  <td>{bird.poids_min_g || 'N/A'}</td>
                  <td>{bird.longevite_ans || 'N/A'}</td>
                  <td>{bird.population_estimee || 'N/A'}</td>
                  <td>{bird.zone_geographique || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <p className="table-info">Showing {displayedBirds.length} of {birds.length} birds (max 20 per page)</p>
    </div>
  );
}
