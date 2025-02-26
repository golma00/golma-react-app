import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import OneGridPage from 'pages/OneGridPage';
import TwoGridPage from 'pages/TwoGridPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OneGridPage />} />
        <Route path="/one" element={<OneGridPage />} />
        <Route path="/two" element={<TwoGridPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
