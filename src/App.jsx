import { useState } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";

import './App.css'
import Collections from './components/Collections';
import CollectionsDetails from './components/CollectionsDetails';

function App() {

  return (  
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Collections />} />
          <Route path="/collections/:collectionId" element={<CollectionsDetails />} />  
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
