import React from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { DesignSystemPage } from '../devtools/DesignSystemPage';

const HomePage: React.FC = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-cream">
    <h1 className="text-2xl font-extrabold text-ink">
      Miya <span className="text-primary">Banque</span>
    </h1>
    <Link
      to="/design-system"
      className="text-sm font-semibold text-primary underline"
    >
      Design system (dev)
    </Link>
  </div>
);

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Route de dev temporaire — vitrine des composants @miya/ui. */}
        <Route path="/design-system" element={<DesignSystemPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
