import { Routes, Route } from 'react-router-dom';
import CosmicBackground from './sections/CosmicBackground';
import SearchOverlay from './sections/SearchOverlay';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import Curriculum from './sections/Curriculum';
import CinematicVision from './sections/CinematicVision';
import AlumniArchives from './sections/AlumniArchives';
import PantheonGraph from './sections/PantheonGraph';
import Footer from './sections/Footer';
import CapabilityDetail from './sections/CapabilityDetail';

function HomePage() {
  return (
    <div
      style={{
        background: '#05050e',
        minHeight: '100vh',
        overflowX: 'hidden',
        position: 'relative',
      }}
    >
      <CosmicBackground />
      <SearchOverlay />
      <Navigation />

      <main>
        <Hero />
        <Curriculum />
        <CinematicVision />
        <AlumniArchives />
        <PantheonGraph />
        <Footer />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/capability/:slug" element={<CapabilityDetail />} />
    </Routes>
  );
}
