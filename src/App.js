import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import CommonPage from 'pages/CommonPage';
import OneGridPage from 'pages/OneGridPage';
import TwoGridPage from 'pages/TwoGridPage';

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
          </div>
        </div>
        <div className='flex flex-row justify-between'>
          <Routes>
            <Route path="/" element={<CommonPage />} />
            <Route path="/one" element={<OneGridPage />} />
            <Route path="/two" element={<TwoGridPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
