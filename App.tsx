import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PeriodDetail from './pages/PeriodDetail';
import Leaderboard from './pages/Leaderboard';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen bg-gray-100 font-sans text-gray-900">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/period/:id" element={<PeriodDetail />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </main>
        <footer className="bg-military-900 text-white py-6 text-center text-sm border-t border-military-800">
          <p>© {new Date().getFullYear()} Sư đoàn 324 - Đoàn Ngự Bình. Ứng dụng hỗ trợ học tập lịch sử.</p>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;