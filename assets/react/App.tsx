// assets/react/App.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import Report from './pages/Report';


export default function App() {
  return (
    <BrowserRouter basename="/app">
      <Routes>
        <Route path="/" element={<AppLayout />} />
        <Route path="/report/:id" element={<Report />} />
      </Routes>
    </BrowserRouter>
  );
}
