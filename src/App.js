import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import CommonPage from 'pages/CommonPage';
import OneGridPage from 'pages/OneGridPage';
import TwoGridPage from 'pages/TwoGridPage';
import GridFormPage from 'pages/GridFormPage';
import ThreeGridPage from 'pages/ThreeGridPage';
import TreeFormPage from 'pages/TreeFormPage';
import { P2PageWrapper } from 'components/layout/index';

function App() {
  return (
    <div className='w-full h-full px-0 py-0'>
      <BrowserRouter>
        <div className='flex flex-row justify-between h-10 bg-gray-200 items-center'>
          <div>
            <h1>Hello World</h1>
          </div>
          <div>
            <Link to="/"  className='px-2 cursor-pointer'>Home</Link>
            <Link to="/one" className='px-2 cursor-pointer'>One</Link>
            <Link to="/two" className='px-2 cursor-pointer'>Two</Link>
            <Link to="/three" className='px-2 cursor-pointer'>Three</Link>
            <Link to="/gridForm" className='px-2 cursor-pointer'>GridForm</Link>
            <Link to="/treeForm" className='px-2 cursor-pointer'>TreeForm</Link>
          </div>
        </div>
        <div className='flex flex-row justify-between'>
          <Routes>
            <Route path="/" element={<P2PageWrapper><CommonPage /></P2PageWrapper>} />
            <Route path="/one" element={<P2PageWrapper><OneGridPage /></P2PageWrapper>} />
            <Route path="/two" element={<P2PageWrapper><TwoGridPage /></P2PageWrapper>} />
            <Route path="/three" element={<P2PageWrapper><ThreeGridPage /></P2PageWrapper>} />
            <Route path="/gridForm" element={<P2PageWrapper><GridFormPage /></P2PageWrapper>} />
            <Route path="/treeForm" element={<P2PageWrapper><TreeFormPage /></P2PageWrapper>} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
