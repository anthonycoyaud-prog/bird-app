import { Link } from 'react-router-dom';
import '../styles/navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🐦 App Oiseaux
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Accueil
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/birds-table" className="nav-link">
              Tableau
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/add-bird" className="nav-link">
              Ajouter Oiseau
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/add-image" className="nav-link">
              Ajouter Image
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/detect" className="nav-link">
              Détecter Oiseau
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
