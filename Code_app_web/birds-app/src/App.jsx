import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import BirdsList from './pages/BirdsList';
import BirdDetails from './pages/BirdDetails';
import AddBird from './pages/AddBird';
import BirdsTable from './pages/BirdsTable';
import AddImage from './pages/AddImage';
import DetectBird from './pages/DetectBird';
import './styles/global.css';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="page-container">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<BirdsList />} />
            <Route path="/bird/:id" element={<BirdDetails />} />
            <Route path="/add-bird" element={<AddBird />} />
            <Route path="/birds-table" element={<BirdsTable />} />
            <Route path="/add-image" element={<AddImage />} />
            <Route path="/detect" element={<DetectBird />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
