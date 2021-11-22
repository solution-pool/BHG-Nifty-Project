import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Project from './pages/Project';
import Proposal from './pages/Proposal';
import Outside from './pages/Outside';
import reportWebVitals from './reportWebVitals';

const rootElement = document.getElementById('root')
ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="project" element={<Project />} />
      <Route path="proposal" element={<Proposal />} />
      <Route path="outside" element={<Outside />} />      
    </Routes>
  </BrowserRouter>,
  rootElement
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
