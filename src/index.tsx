import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
// import React;

import {
  HashRouter,
  // BrowserRouter,
  Routes,
  Route,
  Outlet
} from "react-router-dom";

import React, { useState, useEffect } from 'react'
import {DendroData} from './comps/Interfaces'
import InputView from './InputView';
import VizHolder from './VizView';

import styles from './styles/Home.module.css'
import './styles/globals.css';


const App = () => {
  const [dendrosData, setDendrosData] = useState<DendroData[]>([])

  useEffect(()=>{
    const year = new Date().getFullYear();
    document.getElementsByClassName('footer-inner')[0].textContent = `2015-${year} 3D Medicines Corporation`;
  },[])


  return (
    <Routes>
    <Route path="/" element={
      <div className={styles.container}>
          <Outlet/>
      </div>}>
      <Route path="/" element={<InputView setDendrosData={setDendrosData}/>} />
      <Route path="viz" element={<VizHolder DendrosData={dendrosData} />} />
    </Route>
  </Routes>
    
  )
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
reportWebVitals();
